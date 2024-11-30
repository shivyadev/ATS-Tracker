from flask import Flask, render_template, request, jsonify
from resume_scorer import ResumeScorer

app = Flask(__name__)
scorer = ResumeScorer()

@app.route('/', methods=['GET', 'POST'])
def index():
    return "Hello World 2"

@app.route('/api/score_resume', methods=['POST'])
def api_score_resume():
    try:
        # Parse the incoming JSON data
        data = request.get_json()
        
        # Check if data is provided
        if not data:
            return jsonify({"error": "No data provided in the request."}), 400
                
        # Extract and validate resume_text and job_description
        resume_text = data.get('resume_text')
        job_description = data.get('job_description')
        
        if not resume_text:
            return jsonify({"error": "Missing 'resume_text' in the request data."}), 400
        
        if not job_description:
            return jsonify({"error": "Missing 'job_description' in the request data."}), 400
        
        # Score the resume
        result = scorer.score_resume(resume_text, job_description)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()