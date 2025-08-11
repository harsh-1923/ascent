"use client";
import { Check, Link, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type CraftHeaderProps = {
  header: string;
  date: string;
};

const CraftHeader = ({ header, date }: CraftHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    // Check if referrer exists and is from the same origin (our app)
    if (referrer && referrer.startsWith(currentOrigin)) {
      router.back();
    } else {
      router.push("/craft");
    }
  };

  return (
    <div className="space-y-8 mb-8">
      <div className="flex items-center justify-between w-full gap-3">
        <button
          aria-label="Back"
          onClick={handleBackClick}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--colors-gray1)] hover:bg-[var(--colors-gray2)] dark:bg-[var(--colors-gray3)] outline-none border-none focus-visible:ring-2 focus-visible:ring-[var(--colors-focus)] focus-visible:ring-offset-0 active:ring-0 active:outline-none"
        >
          <Undo2 size={16} className="text-[var(--colors-gray11)]" />
        </button>
      </div>
      <div className="flex gap-3 items-center justify-between w-full">
        <div>
          <h1
            aria-label={`${header} - Published on ${date}`}
            className="text-[16px] font-medium leading-relaxed"
          >
            {header}
          </h1>
          <p className="text-sm text-[var(--colors-gray11)] leading-[20px]">
            {date}
          </p>
        </div>
        <CraftLinkButton />
      </div>
    </div>
  );
};

const CraftLinkButton = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <button
      className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--colors-gray1)] hover:bg-[var(--colors-gray2)] dark:bg-[var(--colors-gray3)] outline-none border-none focus-visible:ring-2 focus-visible:ring-[var(--colors-focus)] focus-visible:ring-offset-0 active:ring-0 active:outline-none"
      onClick={handleClick}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            transition={{ duration: 0.1 }}
          >
            <Check
              size={14}
              className="text-[var(--colors-teal11)]"
              strokeWidth={3}
            />
          </motion.div>
        ) : (
          <motion.div
            key="link"
            initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            transition={{ duration: 0.1 }}
          >
            <Link size={14} className="text-[var(--colors-gray11)] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CraftHeader;
