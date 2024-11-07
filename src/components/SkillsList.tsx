"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Progress } from "./ui/progress";
import { useState } from "react";

interface SkillsListProps {
  header: string;
  matchedSkills: Record<string, string[]>;
  missingSkills: Record<string, string[]>;
  category: string;
}

function combineAndShuffleSkills({
  matchedSkills,
  missingSkills,
  category,
}: SkillsListProps): string[] {
  const matched = matchedSkills[category] || [];
  const missing = missingSkills[category] || [];
  const combinedSkills = [...matched, ...missing];

  for (let i = combinedSkills.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combinedSkills[i], combinedSkills[j]] = [
      combinedSkills[j],
      combinedSkills[i],
    ];
  }

  return combinedSkills;
}

export default function SkillsList({
  header,
  matchedSkills,
  missingSkills,
  category,
}: SkillsListProps) {
  const [open, setOpen] = useState<boolean>(false);

  const matchedSkillsCount = matchedSkills[category]?.length || 0;
  const missingSkillsCount = missingSkills[category]?.length || 0;
  const totalSkills = matchedSkillsCount + missingSkillsCount;

  let value = 0;
  let message = "";

  if (totalSkills === 0) {
    message = "No skills required for this category in the job description.";
  } else if (missingSkillsCount === 0) {
    value = 100;
    message = "All required skills matched!";
  } else if (matchedSkillsCount === 0) {
    message = "No matching skills found.";
  } else {
    value = (matchedSkillsCount / totalSkills) * 100;
    message = `${missingSkillsCount} of ${totalSkills} skills are missing.`;
  }

  return (
    <Collapsible className="my-4" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full grid grid-cols-3">
        <div className="h-full col-span-2 flex flex-col">
          <h2 className="col-span-2 text-left">{header}</h2>
          <span className="mt-1">
            <div className="text-xs text-left text-zinc-700">{message}</div>
          </span>
        </div>
        <div className="w-full min-h-full col-span-1 col-start-3 flex items-center justify-center gap-2">
          <Progress
            value={value}
            className=""
            indicatorColor={cn("bg-red-600", {
              "bg-green-600": value >= 75,
              "bg-blue-500": value < 75 && value >= 25,
            })}
          />
          {!open ? (
            <ChevronDown className="mx-2" />
          ) : (
            <ChevronDown className="mx-2 -rotate-90" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 grid grid-cols-2 gap-1 relative">
          {totalSkills > 0 &&
            combineAndShuffleSkills({
              matchedSkills,
              missingSkills,
              category,
              header,
            }).map((skill, idx) => (
              <ul key={idx}>
                <li className="py-1 mx-2">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn("p-1 px-2 rounded-xl", {
                        "bg-red-200": !matchedSkills[category]?.includes(skill),
                      })}
                    >
                      {skill}
                    </p>
                    {matchedSkills[category]?.includes(skill) ? (
                      <Check className="size-4 text-white bg-green-500 rounded-full" />
                    ) : (
                      <X className="size-4 text-white bg-red-500 rounded-full" />
                    )}
                  </div>
                </li>
              </ul>
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
