import { cn } from "@/lib/utils";

// interface Props {
//   experience: Record<string, number>;
// }

export default function Experience({ experience }) {
  return (
    <div className="mt-5 flex flex-col text-sm">
      <div className="p-2 pr-4 flex justify-between">
        <p>Required Experience </p>
        <p>{experience?.required?.formatted_experience}</p>
      </div>
      <div
        className={cn("p-2 pr-4 flex justify-between rounded-xl", {
          "bg-green-200": experience?.experience_score === 100,
          "bg-red-200": experience?.experience_score === 0,
        })}
      >
        <p>Resume Experience </p>
        <p>{experience?.resume?.formatted_experience}</p>
      </div>
    </div>
  );
}
