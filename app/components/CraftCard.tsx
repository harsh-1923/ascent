"use client";

import React, { useId, useRef, useState, useEffect } from "react";
import CraftVideo from "./CraftVideo";
import { useDoubleTap } from "../lib/utils/useDoubleTap";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { craftLikesManager } from "../lib/db/craftLikes";
import { supabase } from "../lib/db/supabase";

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
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);

  const overlayId = `overlay-${title}-${uniqueId}`;
  const placeholderId = `placeholder-${title}-${uniqueId}`;
  const layoutId = `heart-layout-${title}-${uniqueId}`;

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Fetch initial like count and set up real-time subscription
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

    // Set up real-time subscription
    const channel = supabase
      .channel(`craft-likes-${supabaseId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "craft_likes",
          filter: `craft_id=eq.${supabaseId}`,
        },
        (payload) => {
          // Only update if we're not in the middle of an animation
          if (!isAnimatingRef.current) {
            const newLikes = (payload.new as any)?.like_count || 0;
            setLikeCount(newLikes);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabaseId]);

  useDoubleTap(
    doubleTapAreaRef as React.RefObject<HTMLElement>,
    async (position) => {
      // Set animation state to prevent real-time updates
      setIsAnimating(true);

      // First, update the like count in the database
      try {
        const newLikeCount = likeCount + 1;
        // Pass CURRENT likeCount to the updater so DB becomes current + 1 (not +2)
        await craftLikesManager.handleLikeInteraction(supabaseId, likeCount);

        // Update local state optimistically
        setLikeCount(newLikeCount);
      } catch (error) {
        console.error("Error updating likes:", error);
        // Reset animation state on error
        setIsAnimating(false);
        return;
      }

      // Reset heart and placeholder states
      setShowHeart(false);
      setShowPlaceholder(false);

      // Start animation after a brief delay
      setTimeout(() => {
        setTapPosition(position);
        setShowHeart(true);

        // Show placeholder after animation completes
        setTimeout(() => {
          setShowPlaceholder(true);
          setShowHeart(false);

          // Reset animation state after animation completes
          setTimeout(() => {
            setIsAnimating(false);
          }, 100);
        }, AWAIT_TIME);
      }, 100);
    }
  );

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
