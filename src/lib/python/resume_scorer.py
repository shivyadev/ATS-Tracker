import spacy
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict
import re
from typing import Dict, List, Tuple, Optional, Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import json


class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str

class ResumeResponse(BaseModel):
    final_score: float
    skill_match_score: float
    search_ability_score: float 
    experience_score: float
    education_score: float
    matched_skills: Dict[str, List[str]]
    missing_skills: Dict[str, List[str]]
    experience: Dict[str, int]
    education: Dict[str, Union[str, List[str]]] 

class ResumeScorer:
    def __init__(self):
        # Load spaCy model for NER and text processing
        self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize TF-IDF vectorizer
        self.tfidf = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=10000
        )
        
        # Define skill categories and their respective keywords
        self.skill_categories = {
            'programming_languages': {
                'keywords': [
                    'python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
                    'typescript', 'matlab', 'scala', 'perl', 'go', 'rust', 'objective-c', 'vb.net',
                    'lua', 'haskell', 'dart', 'bash', 'shell', 'groovy', 'julia', 'fortran', '.net', 'sql'
                ],
                'weight': 0.20
            },
            'frameworks': {
                'keywords': [
                    'react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel', 'rails', 
                    'asp.net', 'svelte', 'ember', 'backbone', 'meteor', 'nestjs', 'next.js', 'nuxt.js', 
                    'ionic', 'bootstrap', 'foundation', 'tailwind', 'bulma', 'aws', 'tensorflow', 'pytorch'
                ],
                'weight': 0.15
            },
            'databases': {
                'keywords': [
                    'sql', 'mongodb', 'postgresql', 'mysql', 'oracle', 'redis', 'cassandra', 'couchdb',
                    'dynamodb', 'mariadb', 'neo4j', 'elasticsearch', 'firebase', 'sqlite', 'teradata',
                    'hbase', 'clickhouse', 'db2', 'hive', 'arangodb', 'influxdb', 'bigquery', 'data warehouse'
                ],
                'weight': 0.15
            },
            'soft_skills': {
                'keywords': [
                    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'critical thinking',
                    'adaptability', 'creativity', 'conflict resolution', 'time management', 'empathy', 'interpersonal skills',
                    'negotiation', 'decision making', 'resilience', 'work ethic', 'organization', 'public speaking',
                    'emotional intelligence', 'collaboration', 'active listening', 'coaching', 'customer service',
                    'client relationships', 'relationship building', 'business planning', 'strategic planning', 
                    'business strategy', 'presentations', 'team building'
                ],
                'weight': 0.15
            },
            'tools': {
                'keywords': [
                    'git', 'docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'gcp', 'terraform', 'ansible', 'chef', 
                    'puppet', 'circleci', 'travisci', 'vagrant', 'splunk', 'datadog', 'newrelic', 'sonarqube', 
                    'jira', 'confluence', 'slack', 'bitbucket', 'gitlab', 'octopus deploy', 'npm', 'yarn', 
                    'postman', 'selenium', 'cypress', 'grafana', 'prometheus', 'tableau', 'power bi', 'salesforce', 
                    'excel', 'word', 'outlook', 'photoshop', 'illustrator', 'indesign', 'microsoft office'
                ],
                'weight': 0.15
            },
            'certifications': {
                'keywords': [
                    'aws certified', 'google certified', 'microsoft certified', 'cisco certified', 
                    'comptia', 'pmp', 'scrum master', 'cissp', 'ceh', 'six sigma', 'itil', 'ccnp', 
                    'ccna', 'mcse', 'azure fundamentals', 'aws solutions architect', 'aws developer', 
                    'aws sysops', 'gcp associate', 'oracle certified', 'ibm certified', 'red hat certified', 
                    'salesforce certified', 'kubernetes certified', 'data science certification', 
                    'machine learning certification', 'blockchain certification', 'cloud certification', 
                    'CFA', 'CPA', 'PMP', 'CISM', 'CGEIT', 'CRISC'
                ],
                'weight': 0.10
            }
        }



        # Define education levels and their weights
        self.education_levels = {
            'phd': 1.0,
            'masters': 0.8,
            'bachelors': 0.6,
            'associates': 0.4,
            'high school': 0.2
        }
        
        # Define education fields
        self.education_fields = [
            'computer science', 'software engineering', 'information technology', 'computer engineering', 
            'data science', 'mathematics', 'information systems', 'electrical engineering', 
            'mechanical engineering', 'statistics', 'cybersecurity', 'business information systems', 
            'network engineering', 'telecommunications', 'artificial intelligence', 'bioinformatics', 
            'geographic information systems', 'robotics', 'computer programming', 'software development', 
            'game development', 'data analytics', 'machine learning', 'human-computer interaction', 
            'applied mathematics', 'physics', 'cognitive science', 'data engineering', 'cloud computing'
        ]

    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and extra whitespace
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        
        # Process with spaCy
        doc = self.nlp(text)
        
        # Lemmatize and remove stopwords
        processed_text = ' '.join([token.lemma_ for token in doc 
                                 if not token.is_stop and not token.is_punct])
        
        return processed_text

    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract skills from text based on predefined categories"""
        text = text.lower()
        found_skills = defaultdict(list)
        
        for category, data in self.skill_categories.items():
            for skill in data['keywords']:
                pattern = r'\b{}\b'.format(skill)
                if re.search(pattern, text):
                    found_skills[category].append(skill)
        
        return dict(found_skills)

    def calculate_skill_match_score(self, resume_skills: Dict[str, List[str]], jd_skills: Dict[str, List[str]]) -> float:
        """Calculate the skill match score between resume and job description"""
        if not jd_skills:  # If no skills mentioned in JD
            return 0  # Return 0 when no skills in job description
            
        total_jd_skills = sum(len(skills) for skills in jd_skills.values())
        if total_jd_skills == 0:
            return 0  # Return 0 when no skills required
            
        matched_skills = 0
        for category, jd_skill_list in jd_skills.items():
            resume_skill_list = resume_skills.get(category, [])
            matched_skills += len(set(jd_skill_list) & set(resume_skill_list))

        return (matched_skills / total_jd_skills) * 100
    
    def calculate_search_ability_score(self, resume_text: str) -> Tuple[float, Dict[str, List[str]]]:
        """Calculate search ability score based on contact details in the resume"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        social_media_pattern = r'(?:https?://)?(?:www\.)?(linkedin|twitter|github|stackoverflow|medium|dev\.to)[^\s]*'
        
        emails = re.findall(email_pattern, resume_text)
        phones = re.findall(phone_pattern, resume_text)
        social_media_handles = re.findall(social_media_pattern, resume_text, re.IGNORECASE)
        
        # Calculate individual scores
        email_score = 100 if emails else 0
        phone_score = 100 if phones else 0
        social_media_score = min(100, len(social_media_handles) * 33.33)  # 33.33 points per platform
        
        # Check if all three are present, if so, set score to 100
        if email_score == 100 and phone_score == 100 and social_media_score > 0:
            search_ability_score = 100
        else:
            # Otherwise, calculate the score based on individual scores
            search_ability_score = (email_score + phone_score + social_media_score) / 3
        
        return search_ability_score, {
            'emails': emails,
            'phones': phones,
            'social_media_handles': [h.capitalize() for h in social_media_handles]
        }


    def extract_education(self, text: str) -> Dict[str, Union[str, List[str]]]:
        """Extract education information from text"""
        text = text.lower()
        education_info = {
            'highest_level': None,
            'fields': []
        }
        
        # Extract highest education level
        found_levels = []
        for level in self.education_levels.keys():
            if re.search(r'\b' + re.escape(level) + r'\b', text):
                found_levels.append(level)
        
        if found_levels:
            # Get the highest level based on weights
            education_info['highest_level'] = max(
                found_levels,
                key=lambda x: self.education_levels[x]
            )
        
        # Extract fields of study
        education_info['fields'] = [
            field for field in self.education_fields
            if re.search(r'\b' + re.escape(field.lower()) + r'\b', text)
        ]
        
        return education_info

    def extract_experience(self, text: str, job_text: str = "") -> dict:
        """
        Extract years of experience from text and return in frontend-friendly format.
        Returns a dict with total_days, formatted_experience, and experience_score.
        """
        text = text.lower()
        job_text = job_text.lower()
        total_days = 0

        # Check if neither resume nor job description mentions experience
        experience_keywords = ["years", "months", "days", "experience"]
        if not any(keyword in text for keyword in experience_keywords) and not any(keyword in job_text for keyword in experience_keywords):
            return {
                "total_days": 0,
                "formatted_experience": "No experience mentioned",
                "experience_score": 100
            }
        
        # Patterns for extracting experience
        year_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of)?\s*experience',
            r'experience\s*(?:of)?\s*(\d+)\+?\s*years?',
            r'(?:worked|working)\s*(?:for)?\s*(\d+)\+?\s*years?'
        ]
        month_patterns = [
            r'(\d+)\s*months?\s*(?:of)?\s*experience',
            r'experience\s*(?:of)?\s*(\d+)\s*months?',
            r'(?:worked|working)\s*(?:for)?\s*(\d+)\s*months?'
        ]
        combined_pattern = r'(\d+)\s*years?\s*(?:and)?\s*(\d+)\s*months?'
        day_patterns = [
            r'(\d+)\s*days?\s*(?:of)?\s*experience',
            r'experience\s*(?:of)?\s*(\d+)\s*days?'
        ]
        
        # Check for combined years and months first
        combined_matches = re.findall(combined_pattern, text)
        if combined_matches:
            for years, months in combined_matches:
                total_days += (int(years) * 365) + (int(months) * 30)
        
        # Check for years if no combined match
        if not total_days:
            for pattern in year_patterns:
                matches = re.findall(pattern, text)
                if matches:
                    max_years = max(int(match) for match in matches)
                    total_days = max_years * 365
                    break
        
        # Check for months if we haven't found years
        if not total_days:
            for pattern in month_patterns:
                matches = re.findall(pattern, text)
                if matches:
                    max_months = max(int(match) for match in matches)
                    total_days = max_months * 30
                    break
        
        # Check for days if we haven't found months or years
        if not total_days:
            for pattern in day_patterns:
                matches = re.findall(pattern, text)
                if matches:
                    total_days = max(int(match) for match in matches)
                    break
        
        def calculate_score(days):
            """
            Calculate experience score on a scale of 0-100
            - 0-3 months: 0-25
            - 3-12 months: 25-50
            - 1-3 years: 50-75
            - 3+ years: 75-100
            """
            years = days / 365
            
            if years >= 3:
                score = min(100, 75 + ((years - 3) * 5))
            elif years >= 1:
                score = 50 + ((years - 1) * 12.5)
            elif years >= 0.25:
                score = 25 + ((years - 0.25) * 33.33)
            else:
                score = (years / 0.25) * 25
                
            return round(score, 1)
        
        def format_experience(days):
            if days == 0:
                return "No experience mentioned"
            
            years = days // 365
            remaining_days = days % 365
            months = remaining_days // 30
            days = remaining_days % 30
            
            parts = []
            if years > 0:
                parts.append(f"{years} year{'s' if years != 1 else ''}")
            if months > 0:
                parts.append(f"{months} month{'s' if months != 1 else ''}")
            if days > 0 and not years:
                parts.append(f"{days} day{'s' if days != 1 else ''}")
            
            return " and ".join(parts)
        
        experience_score = calculate_score(total_days)
        
        return {
            "total_days": total_days,
            "formatted_experience": format_experience(total_days),
            "experience_score": experience_score
        }


    def calculate_education_score(self, 
                                resume_education: Dict[str, Union[str, List[str]]], 
                                jd_education: Dict[str, Union[str, List[str]]]) -> float:
        """Calculate education match score"""
        if not jd_education.get('highest_level') and not jd_education.get('fields'):
            # If no education requirements specified, base score on resume education level
            resume_level = resume_education.get('highest_level')
            if resume_level:
                return self.education_levels[resume_level] * 100
            return 50  # Default score when no education info available
            
        score = 0
        total_weight = 0
        
        # Score for education level
        if jd_education.get('highest_level'):
            total_weight += 0.6
            resume_level = resume_education.get('highest_level')
            jd_level = jd_education['highest_level']
            
            if resume_level:
                resume_weight = self.education_levels[resume_level]
                jd_weight = self.education_levels[jd_level]
                level_score = min(100, (resume_weight / jd_weight) * 100) if jd_weight > 0 else 100
                score += level_score * 0.6
        
        # Score for field match
        if jd_education.get('fields'):
            total_weight += 0.4
            resume_fields = set(resume_education.get('fields', []))
            jd_fields = set(jd_education['fields'])
            
            if resume_fields:
                field_matches = resume_fields.intersection(jd_fields)
                field_score = (len(field_matches) / len(jd_fields)) * 100 if jd_fields else 100
                score += field_score * 0.4
        
        return round(score / total_weight if total_weight > 0 else 50, 2)

    def score_resume(self, resume_text: str, job_description: str) -> Dict:
        """Score resume against job description"""
        # Handle empty inputs
        if not resume_text.strip():
            raise ValueError("Resume text cannot be empty")
        if not job_description.strip():
            job_description = "Any experience and skills"  # Default job description
        
        # Extract information
        resume_skills = self.extract_skills(resume_text)
        jd_skills = self.extract_skills(job_description)
        resume_education = self.extract_education(resume_text)
        jd_education = self.extract_education(job_description)
        
        # Extract experience with source types
        resume_exp = self.extract_experience(resume_text)
        required_exp = self.extract_experience(job_description)
        
        # Calculate scores
        skill_match_score = self.calculate_skill_match_score(resume_skills, jd_skills)
        search_ability_score, search_ability_details = self.calculate_search_ability_score(resume_text)
        education_score = self.calculate_education_score(resume_education, jd_education)
        
        # Calculate experience score
        if required_exp['total_days'] == 0 and resume_exp['total_days'] == 0:
            experience_score = 100  # Set experience score to 100 if both have no experience defined
        elif required_exp['total_days'] > 0:
            experience_score = min(100, (resume_exp['total_days'] / required_exp['total_days']) * 100)
        else:
            experience_score = resume_exp['experience_score']
        
        # Calculate weighted final score
        weights = {
            'skill_match': 0.4,
            'search_ability': 0.2,
            'experience': 0.2,
            'education': 0.2
        }
        
        # Adjust weights based on available information
        if not jd_skills:
            weights['skill_match'] = 0.2
            weights['search_ability'] += 0.1
            weights['experience'] += 0.1
        
        # Calculate weighted final score
        final_score = (
            skill_match_score * weights['skill_match'] +
            search_ability_score * weights['search_ability'] +
            experience_score * weights['experience'] +
            education_score * weights['education']
        )

        # Identify matched and missing skills
        matched_skills = {
            category: list(set(jd_skills.get(category, [])) & set(resume_skills.get(category, [])))
            for category in set(jd_skills.keys()) | set(resume_skills.keys())
        }
        
        missing_skills = {
            category: list(set(jd_skills.get(category, [])) - set(resume_skills.get(category, [])))
            for category in jd_skills.keys()
        }
        
        # Remove empty categories
        matched_skills = {k: v for k, v in matched_skills.items() if v}
        missing_skills = {k: v for k, v in missing_skills.items() if v}
        
        # Prepare detailed report
        return {
            'final_score': round(final_score, 2),
            'skill_match_score': round(skill_match_score, 2),
            'search_ability_score': round(search_ability_score, 2),
            'search_ability_details': search_ability_details,
            'experience_score': round(experience_score, 2),
            'education_score': round(education_score, 2),
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'all_resume_skills': resume_skills,  # Added all resume skills here
            'experience': {
                'resume': {
                    'total_days': resume_exp['total_days'],
                    'formatted_experience': resume_exp['formatted_experience'],
                    'experience_score': resume_exp['experience_score']
                },
                'required': {
                    'total_days': required_exp['total_days'],
                    'formatted_experience': required_exp['formatted_experience'],
                    'experience_score': required_exp['experience_score']
                }
            },
            'education': {
                'resume_education': resume_education,
                'required_education': jd_education
            }
        }

    @staticmethod
    def parse_cli_args():
        """Parse command line arguments passed from Node.js"""
        if len(sys.argv) < 2:
            raise ValueError("No input arguments provided")
            
        try:
            input_data = json.loads(sys.argv[1])
            resume_text = input_data.get('resume_text')
            job_description = input_data.get('job_description')
            
            if not resume_text:
                raise ValueError("Missing resume text")
                
            # Allow empty job description - will use default
            job_description = job_description or "Any experience and skills"
                
            return resume_text, job_description
            
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON input")
    

if __name__ == "__main__":
    try:
        # Parse command line arguments
        resume_text, job_description = ResumeScorer.parse_cli_args()
        
        # Create scorer instance and process
        scorer = ResumeScorer()
        result = scorer.score_resume(resume_text, job_description)
        
        # Print result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)