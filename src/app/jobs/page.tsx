"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getJobDetails, saveJobDetails } from "./actions";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["get-job-details", title],
    queryFn: () => getJobDetails(title),
    retry: 5,
    retryDelay: 5000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch data on window focus
    refetchOnMount: true,
  });

  const useSaveJobDetailsMutation = () => {
    return useMutation({
      mutationKey: ["save-job-details"],
      mutationFn: (job: {
        company: string;
        title: string;
        location: string;
        description: string;
        redirectUrl: string;
      }) => saveJobDetails(job),
    });
  };

  const { mutate } = useMutation({
    mutationKey: ["save-job-details"],
    mutationFn: (job: {
      company: string;
      title: string;
      location: string;
      description: string;
      redirectUrl: string;
    }) => saveJobDetails(job),
    onSuccess: (_, variables) => {
      // Open the redirect URL in a new tab if the job is successfully saved
      if (variables?.redirectUrl) {
        window.open(variables.redirectUrl, "_blank");
      }
    },
    onError: (error) => {
      console.error("Failed to save job:", error);
      // Optional: display an error message to the user
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12; // Number of jobs per page

  // Calculate the current jobs to display based on pagination
  const totalPages = Math.ceil(jobs?.length / jobsPerPage);

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs?.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleClick = (job) => {
    if (job) {
      mutate({
        company: job.company?.display_name,
        title: job.title,
        location: job.location?.display_name,
        description: job.description,
        redirectUrl: job.redirect_url,
      });
    } else {
      toast({
        title: "Missing job details",
        description: "Unable to save data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      {isLoading ? (
        <div className="flex col-span-2 w-full flex-col items-center justify-center gap-4">
          <Loader className="h-10 w-10 animate-spin text-blue-500" />
          <p className="tracking-normal">Searching</p>
        </div>
      ) : (
        <div className="container mx-auto px-28 py-8 pt-32">
          <h1 className="text-2xl font-bold mb-10">
            Job search results for &quot;{title}&quot;
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs?.map((job, key) => (
              <Card key={key} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{job?.company?.display_name}</CardTitle>
                  <h3 className="text-lg font-semibold mt-2">{job?.title}</h3>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-2">
                    {job?.location?.display_name}
                  </p>
                  <p className="text-sm line-clamp-6">{job?.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleClick(job)}>
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) paginate(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(index + 1);
                      }}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) paginate(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
