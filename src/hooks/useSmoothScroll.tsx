"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useSmoothScroll() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToElement = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    // Check for hash in the URL when the component mounts or pathname changes
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (hash) {
        // Delay scrolling to ensure the DOM is fully loaded
        setTimeout(() => scrollToElement(hash), 100);
      }
    }
  }, [pathname, scrollToElement]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (typeof window !== "undefined") {
        const element = document.getElementById(sectionId);
        if (element) {
          scrollToElement(sectionId);
        } else {
          // If the element doesn't exist, navigate to the section
          router.push(`/#${sectionId}`);
          // After navigation, try to scroll
          setTimeout(() => scrollToElement(sectionId), 100);
        }
      }
    },
    [router, scrollToElement]
  );

  return scrollToSection;
}
