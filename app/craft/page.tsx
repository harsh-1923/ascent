"use client";
import React from "react";
import CraftVideo from "../components/CraftVideo";
import CraftCard from "../components/CraftCard";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";

interface CraftType {
  supabaseId: string;
  playbackId: string;
  title: string;
}

const CRAFTS: CraftType[] = [
  {
    supabaseId: "glyph-inspector",
    playbackId: "s2YbON02H0200tIcmWwfWvAgT7D4vQhxDaZQZ3aIfGXxS00",
    title: "Glyph Inspector",
  },
  {
    supabaseId: "focus-accordion",
    playbackId: "7iGDHA1X8lCUQnbQmV2iJXqHcxBattZAgUqqHVHMyMc",
    title: "Focus Accordion",
  },
  {
    supabaseId: "through-tabs",
    playbackId: "9Fv1MJVBFvGf7TpPEqi4MLhQk1F4qaRgYBBB9pzZw88",
    title: "Tabs",
  },
  {
    supabaseId: "chat-input-gpt",
    playbackId: "mZFjlI5rsikbmphS01cXXsI29HJ86tQNU3GfmZA9577M",
    title: "Chat Input",
  },
];

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
