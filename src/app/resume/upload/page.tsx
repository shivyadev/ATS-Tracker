"use client";

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const [files, setFiles] = useState<File | undefined>(undefined);
  const [desc, setDesc] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleUpload = async (acceptedFiles: File[]) => {
    setError("");
    const file = acceptedFiles[0];
    setFiles(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("desc", desc);

    try {
      if (!file) throw new Error("Missing file");

      await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/resume/analysis");
    } catch (err) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h2 className="text-2xl font-light mb-3">
        Upload Your Resume and Job Description to Receive an Accurate ATS Score
      </h2>
      <div className="flex gap-4 w-full justify-center px-44">
        <div className="flex-1">
          <Dropzone
            accept={{
              "application/pdf": [".pdf"],
            }}
            maxSize={10485760} // 10MB
            multiple={false}
            onDropRejected={() =>
              setError("Please upload a valid PDF file (max 10MB)")
            }
            onDropAccepted={handleUpload}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg py-40 px-24 text-center cursor-pointer transition-all
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                  ${error ? "border-red-500 bg-red-50" : ""}
                  ${
                    files !== undefined && !error
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  {files != undefined && !error ? (
                    <>
                      <FileCheck className="mx-auto h-12 w-12 text-green-500" />
                      <p className="text-green-600 font-medium">
                        {files.name} uploaded successfully!
                      </p>
                    </>
                  ) : error ? (
                    <>
                      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                      <p className="text-red-500">{error}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-600">
                          {isDragActive
                            ? "Drop your PDF here ..."
                            : "Drop your PDF here or click to select"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Only PDF files up to 10MB are accepted
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </Dropzone>
        </div>
        <div className="my-6 w-1 bg-gray-100 rounded-2xl" />
        <div className="flex-1">
          <div className="relative h-full border rounded-md">
            <Textarea
              value={desc}
              onChange={(ev) => setDesc(ev.target.value)}
              placeholder="Insert your job requirements here..."
              className="border-none shadow-none focus-visible:ring-0 text-lg h-full"
            />
          </div>
        </div>
      </div>
      <Button className="mt-20 py-7 px-10 text-lg">Upload</Button>
    </div>
  );
}
