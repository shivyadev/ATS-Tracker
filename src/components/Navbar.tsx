"use client";

import Link from "next/link";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useAuth, UserButton } from "@clerk/nextjs";

function Navbar() {
  const scrollToSection = useSmoothScroll();

  const { isSignedIn } = useAuth();

  return (
    <section className="fixed top-0 z-50 w-full px-8 text-gray-700 bg-white">
      <div className="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
        <div className="relative flex flex-col md:flex-row">
          <Link
            href="/"
            className="flex items-center mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0"
          >
            <span className="mx-auto text-xl font-black leading-none text-gray-900 select-none">
              Recruit-Radar<span className="text-indigo-600">.</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center mb-5 text-base md:mb-0 md:pl-8 md:ml-8 md:border-l md:border-gray-200">
            <Link
              href="/"
              className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <span
              onClick={() => scrollToSection("features")}
              className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900 hover:cursor-pointer"
            >
              Features
            </span>
            <span
              onClick={() => scrollToSection("contact-us")}
              className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900 hover:cursor-pointer"
            >
              Contact Us
            </span>
            <Link
              href="/search"
              className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900 hover:cursor-pointer"
            >
              Jobs
            </Link>
          </nav>
        </div>

        {isSignedIn ? (
          <div className="flex items-center justify-center gap-10">
            <Link
              href="/dashboard"
              className="font-semibold py-2 px-4 border-[1px] rounded-xl bg-zinc-200 text-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 duration-300"
            >
              Dashboard
            </Link>
            <UserButton />
          </div>
        ) : (
          <div className="inline-flex items-center ml-5 space-x-6 lg:justify-end">
            <Link
              href="/auth/sign-in"
              className="text-base font-medium leading-6 text-gray-600 whitespace-no-wrap transition duration-150 ease-in-out hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Navbar;
