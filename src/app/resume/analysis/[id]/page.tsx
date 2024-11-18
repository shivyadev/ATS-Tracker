"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronDown, Loader, Check, X } from "lucide-react";
import { getFileUrl, getJobDetails, resumeScoring } from "./actions";
import PdfViewer from "@/components/PDFViewer";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import DisplayScore from "@/components/DisplayScore";
import { cn } from "@/lib/utils";
import Searchability from "@/components/Searchability";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import JobDescription from "@/components/JobDescription";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Props {
  atsScore?: number;
}

const ATSResumeLayout = ({ atsScore }: Props) => {
  const { id } = useParams();
  const {
    data: record,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetch-resume", id],
    queryFn: () => getFileUrl(id),
    enabled: !!id, // Ensure query only runs when id is present
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch data on window focus
  });

  const { data: result, isLoading: isUploading } = useQuery({
    queryKey: ["score-resume", id],
    queryFn: () => resumeScoring(id),
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data: jobDetails, isLoading: isFetching } = useQuery({
    queryKey: ["get-job-keywords"],
    queryFn: () => getJobDetails(result?.all_resume_skills),
    enabled: !!result,
    retry: 5,
    retryDelay: 5000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch data on window focus
    refetchOnMount: true,
  });

  const [openSkill, setOpenSkill] = useState<boolean>(false);
  const [openSA, setOpenSA] = useState<boolean>(false);
  const [openExperience, setOpenExperience] = useState<boolean>(false);
  const [showResume, setShowResume] = useState<boolean>(true);
  const [showJD, setShowJD] = useState<boolean>(false);

  const renderPdfContent = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-full" />;
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load PDF"}
          </AlertDescription>
        </Alert>
      );
    }

    if (!record?.fileUrl) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No PDF URL available</AlertDescription>
        </Alert>
      );
    }

    return <PdfViewer fileUrl={record.fileUrl} />;
  };

  const searchAbilityResult = result?.search_ability_details
    ? result?.search_ability_details["emails"]?.length > 0 &&
      result?.search_ability_details["phones"]?.length > 0 &&
      result?.search_ability_details["social_media_handles"]?.length > 0
    : false;

  return (
    <div className="mt-16">
      {isLoading || isUploading || isFetching ? (
        <div className="min-h-screen flex col-span-2 w-full flex-col items-center justify-center gap-4">
          <Loader className="h-10 w-10 animate-spin text-blue-500" />
          <p className="tracking-normal">Analyzing your resume</p>
        </div>
      ) : (
        <div>
          <section className="grid grid-cols-7 min-h-[calc(100vh-4rem)]">
            {/* ATS Score Section */}

            <div className="col-span-2 bg-gray-50 p-6">
              <div className="px-2 h-[calc(100vh-8rem)] w-full overflow-auto">
                <DisplayScore score={result?.final_score} />
                <Separator className="mt-10 border-[1px] border-gray-300" />
                <Collapsible
                  open={openSA}
                  onOpenChange={setOpenSA}
                  className="my-5 w-full py-10 px-5 rounded-xl shadow-lg border-[1px] border-gray-200"
                >
                  <CollapsibleTrigger className="w-full grid grid-cols-3">
                    <div className="flex flex-col col-span-1 col-start-1 text-left">
                      <div className="text-xl">Searchability</div>
                      <span className="mt-2">
                        {searchAbilityResult ? (
                          <div className="flex items-center gap-2">
                            <Check className="size-3 bg-green-500 text-white rounded-full" />
                            <p className="text-xs text-green-500">Completed</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <X className="size-3 bg-red-500 text-white rounded-full" />
                              <p className="text-xs text-red-500">
                                Missing search details
                              </p>
                            </div>
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-center col-span-1 col-start-3 gap-5">
                      <Progress
                        value={result?.search_ability_score}
                        className="w-full"
                        indicatorColor={cn("bg-red-600", {
                          "bg-green-600": result?.search_ability_score >= 75,
                          "bg-blue-500":
                            result?.search_ability_score < 75 &&
                            result?.search_ability_score >= 25,
                        })}
                      />
                      {!openSA ? (
                        <ChevronDown className="size-10" />
                      ) : (
                        <ChevronDown className="-rotate-90 size-10" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Searchability
                      searchAbility={result?.search_ability_details}
                    />
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  open={openSkill}
                  onOpenChange={setOpenSkill}
                  className="my-5 w-full py-10 px-5 rounded-xl shadow-lg border-[1px] border-gray-200"
                >
                  <CollapsibleTrigger className="w-full grid grid-cols-3">
                    <div className="flex flex-col col-span-1 col-start-1 text-left">
                      <div className="text-xl">Skills</div>
                      <span className="mt-2">
                        {result?.skill_match_score === 100 ? (
                          <div className="flex items-center gap-2">
                            <Check className="size-3 bg-green-500 text-white rounded-full" />
                            <p className="text-xs text-green-500">Completed</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <X className="size-3 bg-red-500 text-white rounded-full" />
                            <p className="text-xs text-red-500">
                              Missing skills
                            </p>
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-center col-span-1 col-start-3 gap-5">
                      <Progress
                        value={result?.skill_match_score}
                        className="w-full"
                        indicatorColor={cn("bg-red-600", {
                          "bg-green-600": result?.skill_match_score >= 75,
                          "bg-blue-500":
                            result?.skill_match_score < 75 &&
                            result?.skill_match_score >= 25,
                        })}
                      />
                      {!openSkill ? (
                        <ChevronDown className="size-10" />
                      ) : (
                        <ChevronDown className="-rotate-90 size-10" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Skills
                      matchedSkills={result?.matched_skills}
                      missingSkills={result?.missing_skills}
                    />
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  open={openExperience}
                  onOpenChange={setOpenExperience}
                  className="my-5 w-full py-10 px-5 rounded-xl shadow-lg border-[1px] border-gray-200"
                >
                  <CollapsibleTrigger className="w-full grid grid-cols-3">
                    <div className="flex flex-col col-span-1 col-start-1 text-left">
                      <div className="text-xl">Experience</div>
                      <span className="mt-2">
                        {result?.experience_score ? (
                          <div className="flex items-center gap-2">
                            <Check className="size-3 bg-green-500 text-white rounded-full" />
                            <p className="text-xs text-green-500">Completed</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <X className="size-3 bg-red-500 text-white rounded-full" />
                            <p className="text-xs text-red-500">Unfulfilled</p>
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-center col-span-1 col-start-3 gap-5">
                      <Progress
                        value={result?.experience_score}
                        className="w-full"
                        indicatorColor={cn("bg-red-600", {
                          "bg-green-600": result?.experience_score >= 75,
                          "bg-blue-500":
                            result?.experience_score < 75 &&
                            result?.experience_score >= 25,
                        })}
                      />
                      {!openExperience ? (
                        <ChevronDown className="size-10" />
                      ) : (
                        <ChevronDown className="-rotate-90 size-10" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Experience experience={result?.experience} />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
            {/* Resume Section */}
            <div className="col-span-5 bg-gray-50 p-6">
              <Card className="h-[calc(100vh-8rem)] bg-gray-50 border-none">
                <CardHeader>
                  <CardTitle className="flex p-2 justify-center gap-2 ">
                    <Button
                      onClick={() => {
                        setShowJD(false);
                        setShowResume(true);
                      }}
                    >
                      Resume
                    </Button>
                    <Button
                      onClick={() => {
                        setShowJD(true);
                        setShowResume(false);
                      }}
                    >
                      Job Description
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto h-[calc(100%-5rem)] py-20 pl-32 pr-16 mx-auto">
                  {showResume && renderPdfContent()}
                  {showJD && (
                    <JobDescription jobDescription={record?.description} />
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Job Section */}

          <Separator className="border-gray-800 mx-10 my-10" />

          <section className="px-28">
            <h2 className="text-2xl font-bold mb-2">Suggested jobs</h2>
            <p className="text-gray-500 mb-6">
              Here are some job opportunities that match your resume
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobDetails?.data?.map((job, key) => (
                <Card key={key} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{job?.company?.display_name}</CardTitle>
                    <h3 className="text-lg font-semibold mt-2">{job?.title}</h3>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-2">
                      {job?.location?.display_name}
                    </p>
                    <p className="text-sm line-clamp-4">{job?.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => window.open(job?.redirect_url, "_blank")}
                    >
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="my-10 w-full flex justify-center items-center">
              <Link
                href={`/jobs?title=${jobDetails?.skills}`}
                className="text-lg text-zinc-950 hover:text-zinc-600"
              >
                View more
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ATSResumeLayout;
