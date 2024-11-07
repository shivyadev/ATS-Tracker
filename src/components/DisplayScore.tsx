import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  score: number;
}

interface FeedbackProps {
  title: string;
  feedback: string;
}

function DisplayFeedback({ title, feedback }: FeedbackProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg">{title}</h2>
      <p className="text-sm font-extralight">{feedback}</p>
    </div>
  );
}

function lineColor(score: number) {
  if (score <= 25) {
    return "rgba(163, 0, 20, 0.8)";
  } else if (score > 25 && score < 75) {
    return "rgba(8, 75, 165, 0.8)";
  } else {
    return "rgba(11, 132, 17, 0.8)";
  }
}

export default function DisplayScore({ score }: Props) {
  const atsScore = Math.ceil(score);

  return (
    <div className="grid grid-cols-3 items-center gap-4 py-10 my-5 px-3 w-full rounded-xl shadow-lg border-[1px] border-gray-200">
      <div className="cols-span-1 p-2">
        <CircularProgressbar
          value={atsScore}
          text={`${atsScore}`}
          className="size-32 p-0 m-0 font-extrabold"
          styles={buildStyles({
            textSize: "27px",
            textColor: lineColor(atsScore),
            pathColor: lineColor(atsScore),
          })}
        />
      </div>
      <div className="col-span-2">
        {atsScore >= 75 && (
          <DisplayFeedback
            title={"Ready to apply!"}
            feedback="You've reached the recommended match rate! You can feel confident applying with this resume."
          />
        )}
        {atsScore >= 50 && atsScore < 75 && (
          <DisplayFeedback
            title={"You're almost there!"}
            feedback="Your ATS score is decent, but there’s room for improvement. Consider refining your resume to better align with the job requirements."
          />
        )}
        {atsScore >= 25 && atsScore < 50 && (
          <DisplayFeedback
            title={"Keep working on it!"}
            feedback="Your current ATS score indicates that there are significant gaps in your resume. Focus on adding relevant skills and experiences to enhance your match."
          />
        )}
        {atsScore < 25 && (
          <DisplayFeedback
            title={"Need some improvements!"}
            feedback="Your ATS score is quite low. It’s essential to revisit your resume and make substantial changes to improve your chances of getting noticed. Consider highlighting key skills and experiences relevant to the job."
          />
        )}
      </div>
    </div>
  );
}
