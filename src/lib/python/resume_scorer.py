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
                    'lua', 'haskell', 'dart', 'bash', 'shell', 'groovy', 'julia', 'fortran'
                ],
                'weight': 0.20
            },
            'frameworks': {
                'keywords': [
                    'react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel', 'rails', 
                    'asp.net', 'svelte', 'ember', 'backbone', 'meteor', 'nestjs', 'next.js', 'nuxt.js', 
                    'ionic', 'bootstrap', 'foundation', 'tailwind', 'bulma'
                ],
                'weight': 0.15
            },
            'databases': {
                'keywords': [
                    'sql', 'mongodb', 'postgresql', 'mysql', 'oracle', 'redis', 'cassandra', 'couchdb',
                    'dynamodb', 'mariadb', 'neo4j', 'elasticsearch', 'firebase', 'sqlite', 'teradata',
                    'hbase', 'clickhouse', 'db2', 'hive', 'arangodb', 'influxdb', 'bigquery'
                ],
                'weight': 0.15
            },
            'soft_skills': {
                'keywords': [
                    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'critical thinking',
                    'adaptability', 'creativity', 'conflict resolution', 'time management', 'empathy', 'interpersonal skills',
                    'negotiation', 'decision making', 'resilience', 'work ethic', 'organization', 'public speaking',
                    'emotional intelligence', 'collaboration', 'active listening', 'coaching'
                ],
                'weight': 0.15
            },
            'tools': {
                'keywords': [
                    'git', 'docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'gcp', 'terraform', 'ansible', 'chef', 
                    'puppet', 'circleci', 'travisci', 'vagrant', 'splunk', 'datadog', 'newrelic', 'sonarqube', 
                    'jira', 'confluence', 'slack', 'bitbucket', 'gitlab', 'octopus deploy', 'npm', 'yarn', 
                    'postman', 'selenium', 'cypress', 'grafana', 'prometheus'
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
                    'machine learning certification', 'blockchain certification', 'cloud certification'
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
        """Extract skills from text based on predefined categories, matching complete words without removing valid skills."""
        text = text.lower()
        found_skills = defaultdict(list)
        
        for category, data in self.skill_categories.items():
            for skill in data['keywords']:
                # Use a regex to match the skill as a complete word
                pattern = r'\b{}\b'.format(skill)
                if re.search(pattern, text):
                    found_skills[category].append(skill)
        
        # Remove duplicates
        for category, skills in found_skills.items():
            found_skills[category] = list(set(skills))
        
        return found_skills

    def calculate_skill_match_score(self, resume_skills: Dict[str, List[str]], jd_skills: Dict[str, List[str]]) -> float:
        """Calculate the skill match score between resume and job description"""
        total_jd_skills = sum(len(skills) for skills in jd_skills.values())
        matched_skills = 0

        for category, jd_skill_list in jd_skills.items():
            resume_skill_list = resume_skills.get(category, [])
            matched_skills += len(set(jd_skill_list) & set(resume_skill_list))

        return (matched_skills / total_jd_skills) * 100
    
    def calculate_search_ability_score(self, resume_text: str) -> Tuple[float, Dict[str, List[str]]]:
        """Calculate search ability score based on contact details in the resume"""
        
        # Search for email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, resume_text)
        email_score = 100 if emails else 0

        # Search for phone numbers
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        phones = re.findall(phone_pattern, resume_text)
        phone_score = 100 if phones else 0

        # Search for social media handles (LinkedIn, Twitter, GitHub, etc.)
        social_media_pattern = r'(?:https?://)?(?:www\.)?(linkedin|twitter|github|stackoverflow|medium|dev\.to)[^\s]*'
        social_media_handles = re.findall(social_media_pattern, resume_text, re.IGNORECASE)
        social_media_score = 100 if social_media_handles else 0

        capitalized_handles = [h.capitalize() for h in social_media_handles]

        # Calculate the overall search ability score
        search_ability_score = (email_score + phone_score + social_media_score) / 3

        # Return the overall score and the contact details
        return search_ability_score, {
            'emails': emails,
            'phones': phones,
            'social_media_handles': capitalized_handles
        }
    
    def extract_education(self, text: str) -> Dict[str, Union[str, List[str]]]:
        """Extract education information from text."""
        text = text.lower()
        education_info = {
            'highest_level': None,
            'fields': []
        }

        # Extract highest education level
        for level in self.education_levels.keys():
            if re.search(r'\b' + re.escape(level) + r'\b', text):
                education_info['highest_level'] = level
                break  # Stop once the highest level is found

        # Extract fields of study
        for field in self.education_fields:
            if re.search(r'\b' + re.escape(field.lower()) + r'\b', text):
                education_info['fields'].append(field)

        return education_info

    def extract_experience(self, text: str) -> int:
        """Extract years of experience from text"""
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of)?\s*experience',
            r'experience\s*(?:of)?\s*(\d+)\+?\s*years?'
        ]
        
        for pattern in experience_patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                return int(matches[0])
        return 0

    def calculate_education_score(self, 
                                  resume_education: Dict[str, Union[str, List[str]]], 
                                  jd_education: Dict[str, Union[str, List[str]]]) -> float:
        """Calculate education match score."""
        score = 0

        # Score for education level
        resume_level = resume_education.get('highest_level')
        jd_level = jd_education.get('highest_level')
        
        if jd_level and resume_level:
            resume_weight = self.education_levels[resume_level]
            jd_weight = self.education_levels[jd_level]
            level_score = min(100, (resume_weight / jd_weight) * 100) if jd_weight > 0 else 100
            score += level_score * 0.6  # Education level is 60% of education score
        
        # Score for field match
        resume_fields = set(resume_education.get('fields', []))
        jd_fields = set(jd_education.get('fields', []))
        
        if jd_fields and resume_fields:
            field_matches = resume_fields.intersection(jd_fields)
            field_score = (len(field_matches) / len(jd_fields)) * 100 if jd_fields else 100
            score += field_score * 0.4  # Field match is 40% of education score
        
        return round(score, 2)

    def score_resume(self, resume_text: str, job_description: str) -> Dict:
        """Score resume against job description with verified skill matches"""
        # Extract skills
        resume_skills = self.extract_skills(resume_text)
        jd_skills = self.extract_skills(job_description)
        
        # Extract education
        resume_education = self.extract_education(resume_text)
        jd_education = self.extract_education(job_description)
        
        # Calculate various scores
        skill_match_score = self.calculate_skill_match_score(resume_skills, jd_skills)
        search_ability_score, search_ability_details = self.calculate_search_ability_score(resume_text)
        education_score = self.calculate_education_score(resume_education, jd_education)
        
        # Extract experience
        resume_experience = self.extract_experience(resume_text)
        required_experience = self.extract_experience(job_description)
        
        # Calculate experience score
        experience_score = min(100, (resume_experience / max(1, required_experience)) * 100) \
                        if required_experience > 0 else 100
        
        # Calculate weighted final score
        final_score = (
            skill_match_score * 0.4 +
            search_ability_score * 0.2 +
            experience_score * 0.2 +
            education_score * 0.2
        )

        # Identify missing skills specific to job description
        # Calculate skills present in both job description and resume
        matched_skills = {
            category: list(set(jd_skills.get(category, [])) & set(resume_skills.get(category, [])))
            for category in jd_skills
        }
        
        missing_skills = {
            category: list(set(jd_skills.get(category, [])) - set(matched_skills.get(category, [])))
            for category in jd_skills
        }
        
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
            'experience': {
                'resume_experience': resume_experience,
                'required_experience': required_experience
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
            
            if not resume_text or not job_description:
                raise ValueError("Missing required fields")
                
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

