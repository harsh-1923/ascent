"use client";
import React from "react";
import { CRAFTS } from "../craft/page";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CraftFooter = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const currCraftIdx = CRAFTS.findIndex((craft) => craft.supabaseId === slug);

  const prev = CRAFTS[currCraftIdx - 1];
  const next = CRAFTS[currCraftIdx + 1];
  return (
    <footer className="py-8 space-y-8 mt-8 text-sm">
      <hr className="border-[var(--colors-gray6)]" />
      <div className="flex items-center justify-between w-full">
        {prev ? (
          <Link href={prev.link} className="flex flex-col items-start p-2">
            <span className="text-[var(--colors-gray11)]">Prev</span>
            <span className="font-medium">{prev.title}</span>
          </Link>
        ) : (
          <div aria-hidden="true"></div>
        )}
        {next ? (
          <Link href={next.link} className="flex flex-col items-end p-2">
            <span className="text-[var(--colors-gray11)]">Next</span>
            <span className="font-medium">{next.title}</span>
          </Link>
        ) : (
          <></>
        )}
      </div>
    </footer>
  );
};

export default CraftFooter;
