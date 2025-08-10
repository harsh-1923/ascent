import React from "react";
import CraftVideo from "../components/CraftVideo";
import CraftCard from "../components/CraftCard";

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
];

const page = () => {
  return (
    <main className="w-screen pb-40">
      <div className="w-full flex flex-col items-start max-w-2xl mx-auto px-4 space-y-25 py-8">
        {CRAFTS.map((craft) => (
          <CraftCard key={craft.playbackId} {...craft} />
        ))}
      </div>
    </main>
  );
};

export default page;
