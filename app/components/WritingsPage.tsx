"use client";
import React from "react";
import { Writing } from "../writings/utils/getWritings";
import { motion } from "motion/react";
import SMDX from "./SMDX";

const WritingsPage = ({ writing }: { writing: Writing }) => {
  return (
    <motion.div>
      <article className="debug bg-red-500/20">
        <SMDX content={writing.content || ""} />
      </article>
      <motion.div></motion.div>
    </motion.div>
  );
};

export default WritingsPage;
