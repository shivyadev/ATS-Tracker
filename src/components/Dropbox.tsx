"use client";

import Image from "next/image";
import { Separator } from "./ui/separator";
import StyledButton from "./StyledButton";
import { Loader } from "lucide-react";
import { SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { cn } from "@/lib/utils";

const supportedFormats = "PDF";

type Props = {
  setUploaded: React.Dispatch<SetStateAction<boolean>>;
};

const Dropbox = ({ setUploaded }: Props) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      if (!file) throw new Error("Missing file");

      await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setUploading(false);
      setUploaded(true);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    maxFiles: 1,
    noClick: true,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDropAccepted: handleUpload,
    onDropRejected: () => {
      setDragging(false);
      toast({
        description: "Invalid File Format",
        variant: "destructive",
      });
    },
  });

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDragOver = () => {
    setDragging(true);
  };

  return (
    <div
      className="w-full max-w-2xl rounded-2xl bg-background p-3 shadow-md"
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
    >
      <div
        {...getRootProps({
          className: cn(
            "py-24 px-56 mb-3 border-2 border-blue-500  dark:border-gray-500 rounded-2xl  bg-gray-50 dark:bg-slate-900 flex justify-center items-center flex-col",
            dragging ? "bg-blue-100 dark:bg-gray-800" : "border-dashed "
          ),
        })}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Loader className="h-10 w-10 animate-spin text-blue-500" />
            <p className="tracking-normal">Uploading your resume</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Uploader Image */}
            <Image
              src="/svgs/upload.svg"
              alt="upload-icon"
              width={55}
              height={55}
            />

            {/* Description Text */}
            <p className="text-center">Drag your file here</p>

            {/* Separator Group */}
            <div className="flex w-full max-w-20 items-center justify-center gap-4">
              <Separator className="bg-gray-300 dark:bg-gray-500" />{" "}
              <p className="text-sm font-light text-gray-500">OR</p>{" "}
              <Separator className="bg-gray-300 dark:bg-gray-500" />
            </div>

            {/* CTA */}
            <StyledButton onClick={open} text="Browse files" size="small" />
          </div>
        )}
      </div>

      <p className="text-left text-xs tracking-normal text-gray-500">
        Supported formats: <span className="font-bold">{supportedFormats}</span>
      </p>
    </div>
  );
};

export default Dropbox;
