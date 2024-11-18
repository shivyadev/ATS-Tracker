import { useRouter } from "next/navigation";

interface ResumeData {
  atsScore: number;
  submittedAt: string;
  description: string;
  fileName: string;
}

interface Props {
  resumes: ResumeData[]; // This would be the fetched resume data
}

const LatestResumesList = ({ resumes }: Props) => {
  const router = useRouter();

  // Handle redirect on click
  const handleClick = (fileName: string) => {
    router.push(`/resume/analysis/${fileName}`); // Redirect to the resume detail page
  };

  // Only show the latest 5 resumes
  const latestResumes = [...resumes].slice(-5).reverse();

  return (
    <div className="my-10">
      <h2 className="text-xl font-semibold mb-4">Latest Resume Scores</h2>
      <div className="space-y-4">
        {latestResumes.map((resume, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border shadow-md rounded-xl cursor-pointer hover:bg-gray-100 bg-gray-200"
            onClick={() => handleClick(resume.fileName)}
          >
            {/* ATS Score Circle */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white">
              <span>{resume.atsScore}</span>
            </div>
            {/* Resume Data */}
            <div className="ml-4 flex-1">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Submitted: </span>{" "}
                {new Date(resume.submittedAt).toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-gray-600 line-clamp-1 ">
                {resume?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestResumesList;
