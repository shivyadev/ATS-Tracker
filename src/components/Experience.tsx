import { cn } from "@/lib/utils";

interface Props {
  experience: Record<string, number>;
}

export default function Experience({ experience }: Props) {
  return (
    <div className="mt-5 flex flex-col">
      <div className="p-2 pr-4 flex justify-between">
        <p>Required Experience </p>
        <p>{experience["required_experience"]} years</p>
      </div>
      <div
        className={cn("p-2 pr-4 flex justify-between rounded-xl bg-red-200", {
          "bg-green-200":
            experience["resume_experience"] >=
            experience["required_experience"],
        })}
      >
        <p>Resume Experience </p>
        <p>{experience["resume_experience"]} years</p>
      </div>
    </div>
  );
}
