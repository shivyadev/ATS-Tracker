"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import useSound from "use-sound";

type Props = {
  size?: "default" | "small";
  text: string;
  onClick?: () => void;
};

function StyledButton({ size = "default", text, onClick }: Props) {
  const [play] = useSound("/sounds/click.mp3", {
    volume: 0.25,
  });

  const sizes = {
    default: "px-5 py-3",
    small: "px-3 py-1",
  };

  function handleOnClick() {
    const isSoundEnabled = localStorage.getItem("isSoundEnabled") === "true";

    if (isSoundEnabled) {
      play();
    }

    if (onClick) {
      onClick();
    }
  }

  return (
    <motion.button
      onClick={handleOnClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative inline-block cursor-pointer",
        size === "small" ? "text-sm" : "text-base"
      )}
    >
      <span
        className={cn(
          "relative z-10 block overflow-hidden rounded-lg border-2 border-gray-900 font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out group-hover:text-gray-100 dark:border-gray-100 dark:text-gray-100 dark:group-hover:text-gray-900",
          sizes[size]
        )}
      >
        <span className="absolute inset-0 h-full w-full rounded-lg bg-gray-100 px-5 py-3 dark:bg-gray-900"></span>
        <span className="ease absolute left-0 -ml-2 h-48 w-48 origin-top-right -translate-x-full translate-y-12 -rotate-90 bg-gray-900 transition-all duration-300 group-hover:-rotate-180 dark:bg-gray-100"></span>
        <span className="relative">{text}</span>
      </span>
      <span
        className={cn(
          "absolute bottom-0 right-0 w-full rounded-lg bg-gray-900 transition-all duration-200 ease-linear group-hover:mb-0 group-hover:mr-0 dark:bg-gray-100",
          size === "small" ? "-mb-[3px] -mr-[3px] h-7" : "-mb-1 -mr-1 h-12"
        )}
        data-rounded="rounded-lg"
      ></span>
    </motion.button>
  );
}

export default StyledButton;
