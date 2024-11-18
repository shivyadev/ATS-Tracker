"use client";

import Link from "next/link";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import Image from "next/image";

export default function Footer() {
  const scrollToSection = useSmoothScroll();

  return (
    <footer id="contact-us" className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">About Us</h2>
            <p className="text-gray-400">
              Recruit-Radar is your essential tool for optimizing resumes and
              boosting job application success. Analyze, score, and refine your
              resume to stand out with personalized job matches and tailored
              insights.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <span
                  onClick={() => scrollToSection("features")}
                  className="text-gray-400 hover:text-white hover:cursor-pointer"
                >
                  Features
                </span>
              </li>
              <li>
                <span
                  onClick={() => scrollToSection("contact-us")}
                  className="text-gray-400 hover:text-white hover:cursor-pointer"
                >
                  Contact
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <div className="flex gap-2 mt-3 items-center">
              <span className="size-6 ">
                <Image
                  src="/LinkedIn.png"
                  alt="Resume Tracking"
                  width={360}
                  height={480}
                  className="mx-auto"
                />
              </span>
              <Link
                href="https://www.linkedin.com/in/shivansh-yadav-a8171b27b/"
                className="text-gray-400 hover:text-gray-200 duration-150"
              >
                Shivansh Yadav
              </Link>
            </div>
            <div className="flex gap-2 mt-3 items-center">
              <span className="size-6 ">
                <Image
                  src="/LinkedIn.png"
                  alt="Resume Tracking"
                  width={360}
                  height={480}
                  className="mx-auto"
                />
              </span>
              <Link
                href="https://www.linkedin.com/in/tanishq-verma-07011321a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                className="text-gray-400 hover:text-gray-200 duration-150"
              >
                Tanishq Verma
              </Link>
            </div>
            <div className="flex gap-2 mt-3 items-center">
              <span className="size-6 ">
                <Image
                  src="/Socials.png"
                  alt="Resume Tracking"
                  width={360}
                  height={480}
                  className="mx-auto"
                />
              </span>
              <p className="text-gray-400 hover:text-gray-200 duration-150">
                Uddeshya Barod
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Recruit-Radar. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
