"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="flex items-center justify-center px-2 py-32 bg-white md:px-0 min-h-screen">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5 ">
          <div className="flex flex-wrap items-center sm:-mx-3">
            <div className="w-full md:w-1/2 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="block xl:inline">Simplify the ATS,</span>{" "}
                  <span className="block text-indigo-600 xl:inline">
                    Amplify your Job Hunt.
                  </span>
                </h1>
                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-lg md:max-w-3xl">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  It's never been easier to track your ATS applications, analyze
                  your performance, and land your dream job.
                </p>
                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                  <Link
                    href="/resume/upload"
                    className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                  >
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Let's Track It
                    <ArrowRight className="ml-1 size-5" />
                  </Link>
                  <a
                    href="#_"
                    className="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                <Image
                  src="/landing-page.png"
                  alt="Example Image"
                  width={1050}
                  height={700}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="pb-8 bg-gray-100 text-gray-800">
        <div className="container max-w-xl p-6 py-12 mx-auto space-y-24 lg:px-8 lg:max-w-7xl">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-5xl text-gray-900">
              Features
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-xl text-center text-gray-600">
              Your personalized path to better job applications and smarter
              career opportunities.
            </p>
          </div>

          {/* Resume and Resume Tracking Features */}
          <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-900">
                Optimize and Track Your Resume
              </h3>
              <p className="mt-3 text-lg text-gray-600">
                Enhance your resume with detailed feedback and tracking tools.
                Receive personalized suggestions to improve your ATS score and
                stand out in job applications.
              </p>
              <div className="mt-12 space-y-12">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                      <Check className="size-7" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium leading-6 text-gray-900">
                      ATS Compatibility Check
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Get insights on how well your resume performs with ATS
                      systems and receive feedback to improve its score and
                      compatibility.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                      <Check className="size-7" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium leading-6 text-gray-900">
                      Resume Tracking and Progress
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Keep track of your resume improvements over time. Compare
                      your current resume score with previous versions and
                      monitor your progress.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                      <Check className="size-7" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium leading-6 text-gray-900">
                      Personalized Resume Tips
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Receive expert tips on optimizing your resume for better
                      performance in job applications, ensuring you highlight
                      your strengths.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="mt-10 lg:mt-0">
              <Image
                src="/features-section-1.jpeg"
                alt="Resume Tracking"
                width={360}
                height={480}
                className="mx-auto rounded-lg shadow-lg bg-gray-500"
              />
            </div>
          </div>

          {/* Job Search Features */}
          <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
            <div className="lg:col-start-2">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-900">
                Find Your Ideal Job
              </h3>
              <p className="mt-3 text-lg text-gray-600">
                Search and apply for jobs that match your skills and experience.
                Leverage our platform to discover opportunities and apply with
                confidence.
              </p>
              <div className="mt-12 space-y-12">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                      <Check className="size-7" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium leading-6 text-gray-900">
                      Smart Job Recommendations
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Our system offers personalized job suggestions based on
                      your resume and preferences, helping you find the
                      best-fitting roles.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                      <Check className="size-7" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium leading-6 text-gray-900">
                      Filtered Job Search
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Use advanced filters to refine your job search based on
                      location, industry, and other preferences, ensuring you
                      find the perfect fit.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-violet-600 text-gray-50">
                      <Check className="size-7" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium leading-6 text-gray-900">
                      Track Applications
                    </h4>
                    <p className="mt-2 text-gray-600">
                      Keep track of all your job applications and stay updated
                      on your application status, making it easier to manage
                      multiple job prospects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1">
              <Image
                src="/features-section-2.webp"
                alt="Job Search"
                width={360}
                height={480}
                className="mx-auto rounded-lg shadow-lg bg-gray-500"
              />
            </div>
          </div>
        </div>
      </section>{" "}
      <section id="contact-us" className="bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
          <div className="text-center">
            <p className="font-medium text-blue-500 text-blue-400">
              Contact us
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl text-white">
              Get in touch
            </h1>
            <p className="mt-3 text-gray-500 text-gray-400">
              Our friendly team is always here to chat.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 mt-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="size-10 text-blue-500 rounded-full bg-gray-800">
                <Image
                  src="/Google.png"
                  alt="Resume Tracking"
                  width={360}
                  height={480}
                  className="mx-auto"
                />
              </span>
              <h2 className="mt-4 text-lg font-medium text-white">Gmail </h2>
              {/* <p className="mt-2 text-blue-500 text-blue-400">{contact}</p> */}
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="size-10 text-blue-500 rounded-full bg-gray-800">
                <Image
                  src="/LinkedIn.png"
                  alt="Resume Tracking"
                  width={360}
                  height={480}
                  className="mx-auto"
                />
              </span>
              <h2 className="mt-4 text-lg font-medium text-white">LinkedIn </h2>
              {/* <p className="mt-2 text-blue-500 text-blue-400">{contact}</p> */}
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="size-10 rounded-full bg-gray-800">
                <Image
                  src="/Socials.png"
                  alt="Resume Tracking"
                  width={360}
                  height={480}
                  className="mx-auto rounded-full"
                />
              </span>
              <h2 className="mt-4 text-lg font-medium text-white">
                Instagram{" "}
              </h2>
              {/* <p className="mt-2 text-blue-500 text-blue-400">{contact}</p> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
