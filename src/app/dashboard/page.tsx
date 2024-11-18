"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardDetails } from "./action";
import { Loader } from "lucide-react";
import Graph from "@/components/Graph";
import StatsDisplay from "@/components/StatsDisplay";
import { Separator } from "@/components/ui/separator";
import Dropbox from "@/components/Dropbox";
import Textbox from "@/components/Textbox";
import { useState } from "react";
import LatestResumesList from "@/components/ResumesList";
import { randomUUID } from "crypto";

export default function Dashboard() {
  const {
    data: record,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["get-user-data", randomUUID],
    queryFn: getDashboardDetails,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch data on window focus
    refetchOnMount: true,
  });

  const [uploaded, setUploaded] = useState<boolean>(false);

  return isLoading ? (
    <div className="custom-gradient w-full min-h-screen flex justify-center items-center">
      <div className="flex col-span-2 w-full flex-col items-center justify-center gap-4">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
        <p className="tracking-normal">Fetching your data</p>
      </div>
    </div>
  ) : (
    <div className="custom-gradient w-full min-h-screen px-[19.5rem] pt-40">
      <h1 className="text-4xl font-semibold">Welcome, {record?.userName}!</h1>
      <section className="py-20 w-full flex items-center justify-center space-x-4 gap-2">
        {/* First div */}
        <div className="flex justify-center w-1/3 aspect-[1] border-[1px] border-gray-200 rounded-xl shadow-md bg-purple-50">
          <Graph resumeData={record["resumes"]} />
        </div>

        {/* Second div */}
        <div className="w-1/3 aspect-[1] bg-purple-50 rounded-2xl">
          <StatsDisplay resumeData={record["resumes"]} />
        </div>

        {/* Third div */}
        <div className="flex items-center justify-center w-1/3 aspect-[1] border-[1px] border-gray-200 rounded-xl shadow-md bg-purple-50">
          {/* Content for the third div */}
        </div>
      </section>
      <Separator className="border-[1px] border-gray-300 mb-20" />
      <section className="">
        <h2 className="text-2xl font-semibold">Create new scan</h2>
        <p className="mt-2 mb-10 font-light">
          Upload your resume and job description now to get an instant ATS score
          analysis and boost your chances!
        </p>
        <div className="flex items-center justify-center w-full">
          {!uploaded ? <Dropbox setUploaded={setUploaded} /> : <Textbox />}
        </div>
      </section>
      <Separator className="mt-24 border-[1px] border-gray-300 mb-20" />
      <section>
        <h2 className="text-2xl font-semibold">Previous Scans</h2>
        <p className="mt-2 mb-2 font-light">
          Check out the resumes you've analyzed and see how they stack up!
        </p>
        <div className="p-2">
          <LatestResumesList resumes={record["resumes"]} />
        </div>
      </section>
    </div>
  );
}
