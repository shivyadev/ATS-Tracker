"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getFileUrl } from "./actions";
import PdfViewer from "@/components/PDFViewer";
import { useQuery } from "@tanstack/react-query";

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
      <div className="grid grid-cols-3 min-h-[calc(100vh-4rem)]">
        {/* ATS Score Section */}
        <div className="col-span-1 bg-gray-50 p-6">
          <Card className="sticky top-20 h-[calc(100vh-8rem)]">
            <CardHeader>
              <CardTitle>ATS Score Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <p>Score: {atsScore ?? "Analyzing..."}</p>
                )}
                {/* Add more ATS analysis components here */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Section */}
        <div className="col-span-2 bg-gray-50 p-6">
          <Card className="h-[calc(100vh-8rem)]">
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto h-[calc(100%-5rem)]">
              {renderPdfContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ATSResumeLayout;
