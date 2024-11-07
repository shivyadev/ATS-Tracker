"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import StyledButton from "./StyledButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jobDescriptions } from "@/lib/descriptions";

const Textbox = () => {
  const [desc, setDesc] = useState<string>("");
  const router = useRouter();

  const uploadDescription = async () => {
    const { data } = await axios.post("/api/resume/upload/description", {
      desc,
    });
    if (data) {
      router.push(`/resume/analysis/${data.fileName}`);
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
                onClick={() => setDesc(job.text)}
                className=" text-center cursor-pointer text-zinc-400 hover:text-zinc-800 mb-2"
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
