export interface CraftType {
  supabaseId: string;
  playbackId: string;
  title: string;
  link: string;
}

export const CRAFTS: CraftType[] = [
  {
    supabaseId: "glyph-inspector",
    link: "/craft/glyph-inspector",
    playbackId: "s2YbON02H0200tIcmWwfWvAgT7D4vQhxDaZQZ3aIfGXxS00",
    title: "Glyph Inspector",
  },
  {
    supabaseId: "heat-map",
    link: "/craft/heat-map",
    playbackId: "MtHKc3bkZ00pIWXHYJXb6uOCFf00NkSPjPIjjKqqnVEUA",
    title: "Heat Map",
  },
  {
    supabaseId: "focus-accordion",
    link: "/craft/focus-accordion",
    playbackId: "7iGDHA1X8lCUQnbQmV2iJXqHcxBattZAgUqqHVHMyMc",
    title: "Focus Accordion",
  },
  {
    supabaseId: "through-tabs",
    link: "/craft/through-tabs",
    playbackId: "9Fv1MJVBFvGf7TpPEqi4MLhQk1F4qaRgYBBB9pzZw88",
    title: "Tabs",
  },
  {
    supabaseId: "chat-input-gpt",
    link: "/craft/chat-input-gpt",
    playbackId: "mZFjlI5rsikbmphS01cXXsI29HJ86tQNU3GfmZA9577M",
    title: "Chat Input",
  },
];
