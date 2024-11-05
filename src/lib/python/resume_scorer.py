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
    text_similarity_score: float
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
                    'python', 'java', 'javascript', 'c++', 'c', 'c#', 'ruby', 'php', 'swift', 'kotlin',
                    'typescript', 'r', 'matlab', 'scala', 'perl', 'go', 'rust', 'objective-c', 'vb.net',
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
        """Extract skills from text based on predefined categories"""
        text = text.lower()
        found_skills = defaultdict(list)
        
        for category, data in self.skill_categories.items():
            for skill in data['keywords']:
                if skill in text:
                    found_skills[category].append(skill)
        
        return found_skills

    def calculate_skill_match_score(self, 
                                  resume_skills: Dict[str, List[str]], 
                                  jd_skills: Dict[str, List[str]]) -> float:
        """Calculate skill match score between resume and job description"""
        total_score = 0
        max_score = 0
        
        for category, data in self.skill_categories.items():
            weight = data['weight']
            jd_category_skills = set(jd_skills.get(category, []))
            resume_category_skills = set(resume_skills.get(category, []))
            
            if jd_category_skills:
                max_score += weight
                if resume_category_skills:
                    match_ratio = len(resume_category_skills.intersection(jd_category_skills)) / len(jd_category_skills)
                    total_score += weight * match_ratio
        
        return (total_score / max_score) * 100 if max_score > 0 else 0
    
    def calculate_text_similarity(self, resume_text: str, jd_text: str) -> float:
        """Calculate text similarity using TF-IDF and cosine similarity"""
        # Preprocess texts
        processed_resume = self.preprocess_text(resume_text)
        processed_jd = self.preprocess_text(jd_text)
        
        # Calculate TF-IDF vectors
        tfidf_matrix = self.tfidf.fit_transform([processed_jd, processed_resume])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        return similarity * 100

    def extract_education(self, text: str) -> Dict[str, Union[str, List[str]]]:
        """Extract education information from text"""
        text = text.lower()
        education_info = {
            'highest_level': None,
            'fields': []
        }
        
        # Extract education level
        for level in self.education_levels.keys():
            if level in text:
                if education_info['highest_level'] is None or \
                   self.education_levels[level] > self.education_levels[education_info['highest_level']]:
                    education_info['highest_level'] = level
        
        # Extract fields of study
        for field in self.education_fields:
            if field in text:
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
        """Calculate education match score"""
        score = 0
        
        # Score for education level
        if jd_education['highest_level'] and resume_education['highest_level']:
            resume_level_weight = self.education_levels[resume_education['highest_level']]
            required_level_weight = self.education_levels[jd_education['highest_level']]
            level_score = min(100, (resume_level_weight / required_level_weight) * 100) \
                         if required_level_weight > 0 else 100
            score += level_score * 0.6  # Education level is 60% of education score
        
        # Score for field match
        if jd_education['fields'] and resume_education['fields']:
            field_matches = set(resume_education['fields']).intersection(set(jd_education['fields']))
            field_score = (len(field_matches) / len(jd_education['fields'])) * 100 \
                         if jd_education['fields'] else 100
            score += field_score * 0.4  # Field match is 40% of education score
        
        return score

    def score_resume(self, resume_text: str, job_description: str) -> Dict:
        """Score resume against job description"""
        # Extract skills
        resume_skills = self.extract_skills(resume_text)
        jd_skills = self.extract_skills(job_description)
        
        # Extract education
        resume_education = self.extract_education(resume_text)
        jd_education = self.extract_education(job_description)
        
        # Calculate various scores
        skill_match_score = self.calculate_skill_match_score(resume_skills, jd_skills)
        text_similarity_score = self.calculate_text_similarity(resume_text, job_description)
        education_score = self.calculate_education_score(resume_education, jd_education)
        
        # Extract experience
        resume_experience = self.extract_experience(resume_text)
        required_experience = self.extract_experience(job_description)
        
        # Calculate experience score
        experience_score = min(100, (resume_experience / max(1, required_experience)) * 100) \
                         if required_experience > 0 else 100
        
        # Calculate weighted final score
        final_score = (
            skill_match_score * 0.35 +
            text_similarity_score * 0.25 +
            experience_score * 0.20 +
            education_score * 0.20
        )
        
        # Prepare detailed report
        return {
            'final_score': round(final_score, 2),
            'skill_match_score': round(skill_match_score, 2),
            'text_similarity_score': round(text_similarity_score, 2),
            'experience_score': round(experience_score, 2),
            'education_score': round(education_score, 2),
            'matched_skills': dict(resume_skills),
            'missing_skills': {
                category: list(set(jd_skills.get(category, [])) - set(resume_skills.get(category, [])))
                for category in self.skill_categories.keys()
            },
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

# Keep existing methods (preprocess_text, extract_skills, calculate_skill_match_score, 
# calculate_text_similarity, extract_experience) as they are...

# Create FastAPI app
app = FastAPI()

# Initialize scorer
scorer = ResumeScorer()

@app.post("/api/score-resume")
async def score_resume(request: ResumeRequest) -> ResumeResponse:
    try:
        result = scorer.score_resume(request.resume_text, request.job_description)
        return ResumeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# For Next.js API route
async def handle_resume_scoring(resume_text: str, job_description: str) -> Dict:
    try:
        scorer = ResumeScorer()
        result = scorer.score_resume(resume_text, job_description)
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    

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


# import json

# def test_resume_scoring():
#     sample_resume_text = """
#         John Doe is a software engineer with 5 years of experience in Python, Java, and SQL.
#         He has worked on full-stack projects, primarily using Django and React.
#         Holds a Bachelor's degree in Computer Science from a reputed university.
#     """
    
#     sample_job_description = """
#         We are looking for a software engineer proficient in Python, Java, and SQL.
#         The candidate should have experience with full-stack development, especially in Django and React.
#         A Bachelor's degree in Computer Science or related field is required.
#     """
    
#     # Initialize scorer and run scoring function
#     scorer = ResumeScorer()
#     result = scorer.score_resume(sample_resume_text, sample_job_description)
    
#     # Organize and print results for better readability
#     print("\n=== Test Resume Scoring Result ===\n")
    
#     print(f"Final Score: {result['final_score']}%")
#     print(f"Skill Match Score: {result['skill_match_score']}%")
#     print(f"Text Similarity Score: {result['text_similarity_score']}%")
#     print(f"Experience Score: {result['experience_score']}%")
#     print(f"Education Score: {result['education_score']}%\n")

#     print("Matched Skills by Category:")
#     for category, skills in result['matched_skills'].items():
#         print(f"  - {category.capitalize()}: {', '.join(skills) if skills else 'None'}")

#     print("\nMissing Skills by Category:")
#     for category, skills in result['missing_skills'].items():
#         print(f"  - {category.capitalize()}: {', '.join(skills) if skills else 'None'}")
    
#     print("\nExperience Details:")
#     print(f"  - Resume Experience: {result['experience']['resume_experience']} years")
#     print(f"  - Required Experience: {result['experience']['required_experience']} years")

#     print("\nEducation Details:")
#     print(f"  - Resume Education Level: {result['education']['resume_education']['highest_level']}")
#     print(f"  - Required Education Level: {result['education']['required_education']['highest_level']}")
#     print(f"  - Matched Fields of Study: {', '.join(result['education']['resume_education']['fields'])}")
#     print(f"  - Required Fields of Study: {', '.join(result['education']['required_education']['fields'])}")

# # Run test function only if script is run directly
# if __name__ == "__main__":
#     test_resume_scoring()
