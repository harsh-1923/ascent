"use client";

import React, { useId, useRef, useState, useEffect } from "react";
import CraftVideo from "./CraftVideo";
import { useDoubleTap } from "../lib/utils/useDoubleTap";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { craftLikesManager } from "../lib/db/craftLikes";

const CraftCard = ({
  playbackId,
  title,
  supabaseId,
}: {
  playbackId: string;
  title: string;
  supabaseId: string;
}) => {
  const uniqueId = useId();
  const AWAIT_TIME = 200;
  const doubleTapAreaRef = useRef<HTMLDivElement>(null);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showHeart, setShowHeart] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const overlayId = `overlay-${title}-${uniqueId}`;
  const placeholderId = `placeholder-${title}-${uniqueId}`;
  const layoutId = `heart-layout-${title}-${uniqueId}`;

  // Fetch initial like count on component mount
  useEffect(() => {
    const loadLikes = async () => {
      try {
        const likes = await craftLikesManager.getLikes(supabaseId);
        setLikeCount(likes || 0);
      } catch (error) {
        console.error("Error loading likes:", error);
        setLikeCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadLikes();
  }, [supabaseId]);

  useDoubleTap(doubleTapAreaRef as React.RefObject<HTMLElement>, (position) => {
    setShowHeart(false);
    setShowPlaceholder(false);

    setTimeout(() => {
      setTapPosition(position);
      setShowHeart(true);

      // Update like count locally and in database
      const newLikeCount = likeCount + 1;
      setLikeCount(newLikeCount);

      // Update in Supabase
      craftLikesManager
        .handleLikeInteraction(supabaseId, newLikeCount)
        .catch(console.error);

      setTimeout(() => {
        setShowPlaceholder(true);
        setShowHeart(false);
      }, AWAIT_TIME);
    }, 100);
  });

  return (
    <div className="w-full h-full space-y-4">
      <div className="relative" ref={doubleTapAreaRef}>
        <CraftVideo {...{ playbackId, title }} />
        {showHeart && (
          <motion.div
            key={`heart-overlay-${uniqueId}`}
            id={overlayId}
            layoutId={layoutId}
            className="absolute flex items-center justify-center pointer-events-none"
            initial={{ scale: 1 }}
            animate={{
              scale: 1.5,
              y: -50,
              rotate: Math.floor(Math.random() * 91) - 45,
            }}
            style={{
              left: tapPosition.x - 20,
              top: tapPosition.y - 20,
            }}
            transition={{
              type: "spring",
              stiffness: 550,
              damping: 30,
              mass: 1.2,
            }}
          >
            <Heart
              className="size-7"
              style={{ fill: "url(#heart-gradient)" }}
              stroke="none"
            />
          </motion.div>
        )}
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", visibility: "hidden" }}
        >
          <defs>
            <linearGradient
              id="heart-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ff8c42" />
              <stop offset="100%" stopColor="#ff4444" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-medium select-none">{title}</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-base">
            <div className="relative size-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Heart className="size-5" />
              </div>
              {showPlaceholder && (
                <motion.div
                  key={`heart-placeholder-${uniqueId}`}
                  id={placeholderId}
                  layoutId={layoutId}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Heart className="size-5 text-red-500" fill="currentColor" />
                </motion.div>
              )}
            </div>
            <div>{isLoading ? "..." : likeCount}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CraftCard;
