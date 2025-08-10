import React from "react";
import CraftVideo from "../components/CraftVideo";
import CraftCard from "../components/CraftCard";

interface Craft {
  supabaseId: string;
  playbackId: string;
  title: string;
}

const CRAFTS = [
  {
    supabaseId: "glyph-inspector",
    playbackId: "s2YbON02H0200tIcmWwfWvAgT7D4vQhxDaZQZ3aIfGXxS00",
    title: "Glyph Inspector",
  },
];

const page = () => {
  return (
    <main className="w-screen min-h-screen pb-40">
      <div className="w-full min-h-screen flex flex-col items-start max-w-2xl mx-auto px-4 space-y-25">
        {CRAFTS.map((craft) => (
          <CraftCard key={craft.playbackId} {...craft} />
        ))}
      </div>
    </main>
  );
};

export default page;
