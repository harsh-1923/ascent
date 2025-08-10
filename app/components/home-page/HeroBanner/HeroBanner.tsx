"use client";
import React from "react";
import "./HeroBanner.css";
import Mel from "../Mel/Mel";
import { motion } from "motion/react";

const HeroBanner = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-full relative h-[240px] overflow-hidden select-none ${className}`}
    >
      <small className="absolute left-0 top-6 z-10 font-[family-name:var(--font-geist-mono)] text-neutral-600 select-none font-medium">
        12° 58' 17.7564'' N
      </small>
      <small className="absolute right-0 top-6 z-10 font-[family-name:var(--font-geist-mono)] text-neutral-600 select-none font-medium">
        77° 35' 40.4376'' E
      </small>
      {/* CENTER CIRCLE  */}
      <div className="absolute left-0 right-0 top-1/2 flex items-center justify-center">
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ delay: 2, bounce: 0.3, type: "spring" }}
          className="w-1/3 min-w-[300px] aspect-square rounded-full bg-[var(--background)] z-10 p-4 shadow-xl"
        ></motion.div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Mel />
      </div>
    </div>
  );
};

export default HeroBanner;
