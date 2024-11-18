"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import StyledButton from "./StyledButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jobDescriptions } from "@/lib/descriptions";
import { useToast } from "@/hooks/use-toast";

const Textbox = () => {
  const [desc, setDesc] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const uploadDescription = async () => {
    if (desc.length !== 0) {
      const { data } = await axios.post("/api/resume/upload/description", {
        desc,
      });
      if (data) {
        router.push(`/resume/analysis/${data.fileName}`);
      }
    } else {
      toast({
        title: "Missing description",
        description:
          "Provide the job description to continue the analysis process",
        variant: "destructive",
      });
      console.log("missing description");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-2 min-h-[36vh] min-w-[75vh]">
        <Textarea
          className="col-span-3 min-h-[36vh] min-w-[65vh] text-lg"
          value={desc}
          onChange={(ev) => setDesc(ev.target.value)}
          placeholder="Enter or paste your job description here..."
        />
        <div className="border-[1px] border-gray-200 rounded-md p-2">
          <h2 className="text-lg text-center mt-2 text-gray-800">
            Job Descriptions
          </h2>
          <ul className="mt-4">
            {jobDescriptions.map((job, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setDesc(job.text); // Set description when clicked
                }}
                className={`text-center cursor-pointer mb-2 text-zinc-400 hover:text-zinc-800 ${
                  selectedIndex === index ? "text-zinc-800 font-semibold" : ""
                }`}
              >
                {job.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10">
        <StyledButton text="Upload" onClick={uploadDescription} />
      </div>
    </div>
  );
};

export default Textbox;
