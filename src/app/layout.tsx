import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import axios from "axios";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RecruitRadar",
  description:
    "ATS Tracker helps job seekers optimize resumes, score them against job descriptions, and improve their chances of getting noticed.",
};

axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={recursive.className}>
          <Toaster />
          <Navbar />
          <Providers>{children}</Providers>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
