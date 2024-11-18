"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [title, setTitle] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

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

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <main className="flex-grow">
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Find Your Dream Job
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Enter the job title you're looking for and start your journey to a
              better career.
            </p>
            <div className="mt-8 sm:flex sm:justify-center">
              <Input
                type="text"
                placeholder="Enter job title or keywords"
                className="w-full sm:w-96"
                aria-label="Job search input"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
              />
              <Button
                type="submit"
                className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto"
                onClick={handleClick}
              >
                Search Jobs
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
