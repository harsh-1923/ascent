"use client";
import React from "react";
import CraftVideo from "../components/CraftVideo";
import CraftCard from "../components/CraftCard";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CRAFTS } from "./utils/craftsData";

const page = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <main className="w-screen pb-40">
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto px-4 gap-3">
        <button
          aria-label="Back"
          onClick={handleBackClick}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--colors-gray1)] hover:bg-[var(--colors-gray2)] dark:bg-[var(--colors-gray3)] outline-none border-none focus-visible:ring-2 focus-visible:ring-[var(--colors-focus)] focus-visible:ring-offset-0 active:ring-0 active:outline-none"
        >
          <Undo2 size={16} className="text-[var(--colors-gray11)]" />
        </button>
      </div>
      <div className="w-full flex flex-col items-start max-w-2xl mx-auto px-4 space-y-25 py-8">
        {CRAFTS.map((craft) => (
          <CraftCard key={craft.playbackId} {...craft} />
        ))}
      </div>
    </main>
  );
};

export default page;
