"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Make sure you have these components
import { Button } from "@/components/ui/button"; // Assuming Button is imported from your UI library

interface JobsData {
  company: string;
  title: string;
  location: string;
  description: string;
  redirectUrl: string;
}

interface Props {
  jobs: JobsData[];
}

const LatestJobsList = ({ jobs }: Props) => {
  const router = useRouter();

  // Handle redirect to the job URL
  const handleRedirect = (redirectUrl: string) => {
    window.open(redirectUrl, "_blank");
  };

  // Only show the latest 5 jobs
  const latestJobs = [...jobs].slice(-5).reverse();

  return (
    <div className="my-10">
      {/* Message for the jobs the user has visited */}
      <div className="space-y-4">
        {latestJobs.map((job, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{job.company}</CardTitle>
              <h3 className="text-lg font-semibold mt-2">{job.title}</h3>
            </CardHeader>

            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-2">
                {job.location}
              </p>
              <p className="text-sm line-clamp-6">{job.description}</p>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                className="w-full sm:w-auto"
                onClick={() => handleRedirect(job.redirectUrl)}
              >
                Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LatestJobsList;
