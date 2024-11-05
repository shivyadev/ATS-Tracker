"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowBigDown,
  ArrowDown,
  ChevronDown,
  Loader,
} from "lucide-react";
import { getFileUrl, resumeScoring } from "./actions";
import PdfViewer from "@/components/PDFViewer";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Props {
  atsScore?: number;
}

const ATSResumeLayout = ({ atsScore }: Props) => {
  const {
    data: fileUrl,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetch-resume"],
    queryFn: getFileUrl,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Consider the data fresh for 5 minutes
  });

  const { data: result, isLoading: isUploading } = useQuery({
    queryKey: ["score-resume"],
    queryFn: resumeScoring,
    retry: 2,
    staleTime: 5 * 6 * 1000,
  });

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

    if (!fileUrl) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No PDF URL available</AlertDescription>
        </Alert>
      );
    }

    return <PdfViewer fileUrl={fileUrl} />;
  };

  return (
    <div className="mt-16">
      <div className="grid grid-cols-7 min-h-[calc(100vh-4rem)]">
        {/* ATS Score Section */}
        {false ? (
          <div className="flex col-span-2 w-full flex-col items-center justify-center gap-4">
            <Loader className="h-10 w-10 animate-spin text-blue-500" />
            <p className="tracking-normal">Analyzing your resume</p>
          </div>
        ) : (
          <div className="col-span-2 bg-gray-50 p-6">
            <div className="p-2 h-[calc(100vh-8rem)] w-full">
              <div className="my-5 w-full py-16 px-5 rounded-xl shadow-lg border-[1px] border-gray-200">
                <div className="text-lg">ATS Score: {result?.final_score}</div>
                <p className="text-sm">Low resume score</p>
              </div>
              <Separator className="mt-10 border-[1px] border-gray-300" />
              <Collapsible className="my-5 w-full py-10 px-5 rounded-xl shadow-lg border-[1px] border-gray-200">
                <CollapsibleTrigger className="w-full grid grid-cols-3">
                  <div className="flex flex-col col-span-1 col-start-1 text-left">
                    <div className="text-xl">Skills</div>
                    <p className="text-sm">Skills here</p>
                  </div>
                  <div className="flex items-center justify-center col-span-1 col-start-3 gap-5">
                    <Progress value={30} className="text-green-400 w-full" />
                    <ChevronDown className="size-10" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent></CollapsibleContent>
              </Collapsible>
              <Collapsible className="my-5 w-full py-10 px-5 rounded-xl shadow-lg border-[1px] border-gray-200">
                <CollapsibleTrigger className="w-full grid grid-cols-3">
                  <div className="flex flex-col col-span-1 col-start-1 text-left">
                    <div className="text-xl">Experience</div>
                    <p className="text-sm">Experience here</p>
                  </div>
                  <div className="flex items-center justify-center col-span-1 col-start-3 gap-5">
                    <Progress value={30} className="text-green-400 w-full" />
                    <ChevronDown className="size-10" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent></CollapsibleContent>
              </Collapsible>
              <Collapsible className="my-5 w-full py-10 px-5 rounded-xl shadow-lg border-[1px] border-gray-200">
                <CollapsibleTrigger className="w-full grid grid-cols-3">
                  <div className="flex flex-col col-span-1 col-start-1 text-left">
                    <div className="text-xl">Education</div>
                    <p className="text-sm">Education here</p>
                  </div>
                  <div className="flex items-center justify-center col-span-1 col-start-3 gap-5">
                    <Progress value={30} className="text-green-400 w-full" />
                    <ChevronDown className="size-10" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent></CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        )}

        {/* Resume Section */}
        <div className="col-span-5 bg-gray-50 p-6">
          <Card className="h-[calc(100vh-8rem)] bg-gray-50 border-none">
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto h-[calc(100%-5rem)] py-20 pl-32 pr-16 mx-auto">
              {renderPdfContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ATSResumeLayout;
