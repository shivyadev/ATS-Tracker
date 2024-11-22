"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardDetails } from "./action";
import { Loader } from "lucide-react";
import Graph from "@/components/Graph";
import StatsDisplay from "@/components/StatsDisplay";
import { Separator } from "@/components/ui/separator";
import Dropbox from "@/components/Dropbox";
import Textbox from "@/components/Textbox";
import { useState, useEffect } from "react";
import LatestResumesList from "@/components/ResumesList";
import { randomUUID } from "crypto";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import LatestJobsList from "@/components/JobsList";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const [title, setTitle] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const user = useUser();

  const handleClick = () => {
    if (title === "") {
      toast({
        title: "Missing job title",
        description: "Please provide the job title to perform the search",
        variant: "destructive",
      });
    } else {
      router.push(`/jobs?title=${title}`);
    }
  };

  const { data: record, isLoading } = useQuery({
    queryKey: ["get-user-data", user.user?.id],
    queryFn: getDashboardDetails,
    retry: 2,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: false, // Avoid duplicate fetch on window focus
  });

  const [uploaded, setUploaded] = useState<boolean>(false);

  return isLoading ? (
    <div className="custom-gradient bg-blue-100 w-full min-h-screen flex justify-center items-center">
      <div className="flex col-span-2 w-full flex-col items-center justify-center gap-4">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
        <p className="tracking-normal">Fetching your data</p>
      </div>
    </div>
  ) : (
    <div className="custom-gradient bg-blue-100 w-full min-h-screen px-[19.5rem] pt-40">
      <h1 className="text-4xl font-semibold">Welcome, {record?.userName}!</h1>
      <section className="py-20 w-full flex items-center justify-center space-x-4 gap-2">
        {/* First div */}
        <div className="flex justify-center w-2/4 aspect-[1] border-[1px] border-gray-200 rounded-xl shadow-md bg-purple-50">
          <Graph resumeData={record["resumes"]} />
        </div>

        {/* Second div */}
        <div className="flex flex-col w-2/4 aspect-[1] bg-purple-50 rounded-2xl shadow-md border-[1px] border-gray-200">
          <StatsDisplay
            resumeData={record["resumes"]}
            totalJobs={record["jobs"]?.length}
          />
          <Separator className="mb-2 mx-6 bg-gray-300 w-4/4" />
          <div className="mx-6 flex flex-col items-center justify-center mt-5">
            <h2 className="mx-6 text-lg font-light text-center">
              Search for jobs
            </h2>
            <p className="mt-2 mb-10 text-sm">
              Search by keyword to get tailored job matches
            </p>
            <Input
              className=""
              placeholder="Enter job title or keyword"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <Button className="mt-8" onClick={handleClick}>
              Search
            </Button>
          </div>
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
        {record["resumes"].length === 0 ? (
          <div className="p-10 py-20 text-center">
            <h2 className="text-lg text-gray-500">No resumes scanned</h2>
          </div>
        ) : (
          <div className="p-2">
            <LatestResumesList resumes={record["resumes"]} />
          </div>
        )}
      </section>
      <Separator className="mt-24 border-[1px] border-gray-300 mb-20" />
      <section>
        <h2 className="text-2xl font-semibold">Previously Visited Jobs</h2>
        <p className="mt-2 mb-2 font-light">
          Check out the jobs you've explored and see how they match your skills!{" "}
        </p>
        {record["jobs"].length === 0 ? (
          <div className="p-10 py-20 text-center">
            <h2 className="text-lg text-gray-500">No jobs visited</h2>
          </div>
        ) : (
          <div className="p-2">
            <LatestJobsList jobs={record["jobs"]} />
          </div>
        )}
      </section>
    </div>
  );
}
