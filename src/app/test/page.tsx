"use client";
import axios from "axios";

import { useEffect, useState } from "react";
import { getFileUrl } from "../resume/analysis/[id]/actions";
import pdfToText from "react-pdftotext";

export default function Test() {
  const [pdfText, setPdfText] = useState("");

  useEffect(() => {
    const test = async () => {
      const fileUrl = await getFileUrl();

      const response = await axios.get(fileUrl, { responseType: "blob" });
      const pdfBlob = response.data;

      pdfToText(pdfBlob)
        .then((text) => {
          setPdfText(text);
        })
        .catch((error) => {
          console.error("Error extracting text from PDF:", error);
        })
        .finally(() => {
          // Revoke the object URL to free up memory
          URL.revokeObjectURL(pdfUrl);
        });
    };

    test();
  }, []);
  return (
    <div className="min-h-screen flex justify-center items-center">
      {pdfText}
    </div>
  );
}
