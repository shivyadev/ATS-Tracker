interface ResumeData {
  _id: string;
  fileName: string;
  atsScore: number;
  submittedAt: string;
}

interface Props {
  resumeData: ResumeData[];
}

const StatsDisplay = ({ resumeData }: Props) => {
  // Calculate stats
  const totalResumes = resumeData.length;
  const avgScore =
    resumeData.length > 0
      ? (
          resumeData.reduce((sum, item) => sum + item.atsScore, 0) /
          resumeData.length
        ).toFixed(1)
      : 0;

  return (
    <div className="w-full aspect-[1] border-[1px] border-gray-200 rounded-xl shadow-md p-4">
      <div className="flex justify-between items-start gap-2 mb-8">
        {/* Total Resumes Box */}
        <div className="flex flex-col items-center border-[1px] border-gray-200 p-2 shadow-md">
          <div className="w-full h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
            <span className="text-xl font-semibold text-blue-600">
              {totalResumes}
            </span>
          </div>
          <span className="text-sm text-gray-600 text-center">
            Total Resumes
          </span>
        </div>

        {/* Average Score Box */}
        <div className="flex flex-col items-center border-[1px] border-gray-200 p-2 shadow-md">
          <div className="w-full h-16 bg-green-50 rounded-lg flex items-center justify-center mb-2">
            <span className="text-xl font-semibold text-green-600">
              {avgScore}
            </span>
          </div>
          <span className="text-sm text-gray-600 text-center">
            Average Score
          </span>
        </div>

        {/* Placeholder Box */}
        <div className="flex flex-col items-center border-[1px] border-gray-200 p-2 shadow-md">
          <div className="w-full h-16 bg-purple-50 rounded-lg flex items-center justify-center mb-2">
            <span className="text-xl font-semibold text-purple-600">0</span>
          </div>
          <span className="text-sm text-gray-600 text-center">
            Applied Jobs
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
