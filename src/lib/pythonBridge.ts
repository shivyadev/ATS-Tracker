import { PythonShell } from "python-shell";
import path from "path";

interface ResumeScore {
  final_score: number;
  skill_match_score: number;
  text_similarity_score: number;
  experience_score: number;
  education_score: number;
  matched_skills: Record<string, string[]>;
  missing_skills: Record<string, string[]>;
  experience: {
    resume_experience: number;
    required_experience: number;
  };
  education: {
    resume_education: {
      highest_level: string | null;
      fields: string[];
    };
    required_education: {
      highest_level: string | null;
      fields: string[];
    };
  };
}

export default async function scoreResume(
  resumeText: string,
  jobDescription: string
): Promise<ResumeScore> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(
      process.cwd(),
      "src",
      "lib",
      "python",
      "resume_scorer.py"
    );

    const options = {
      mode: "json",
      pythonPath: "python",
      pythonOptions: ["-u"],
      scriptPath: path.dirname(pythonScriptPath),
      args: [
        JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      ],
    };

    // Using callback for PythonShell.run
    PythonShell.run("resume_scorer.py", options, (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results && results.length > 0) {
        try {
          resolve(results[0] as ResumeScore);
        } catch (error) {
          reject(new Error("Error parsing results from Python script"));
        }
      } else {
        reject(new Error("No results returned from Python script"));
      }
    });
  });
}
