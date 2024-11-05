"use client";

import React, { useState } from "react";
import Dropbox from "@/components/Dropbox";
import Textbox from "@/components/Textbox";

export default function Page() {
  const [uploaded, setUploaded] = useState<boolean>(false);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="p-10">
        <h1 className="text-4xl text-center mb-2 text-zinc-800">
          Upload Your Resume
        </h1>
        <p className="normal-case text-zinc-500">
          You are one step closer to elevating your career
        </p>
      </div>
      <div>
        {!uploaded ? <Dropbox setUploaded={setUploaded} /> : <Textbox />}
      </div>
    </div>
  );
}
