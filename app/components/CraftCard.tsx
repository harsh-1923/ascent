"use client";

import React, { useId, useRef, useState, useEffect, useCallback } from "react";
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
  const [isLocallyLiked, setIsLocallyLiked] = useState(false);
  const isAnimatingRef = useRef(false);

  const overlayId = `overlay-${title}-${uniqueId}`;
  const placeholderId = `placeholder-${title}-${uniqueId}`;
  const layoutId = `heart-layout-${title}-${uniqueId}`;

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Check local storage on component mount
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        const likedCrafts = JSON.parse(
          localStorage.getItem("likedCrafts") || "{}"
        );
        setIsLocallyLiked(!!likedCrafts[supabaseId]);
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        setIsLocallyLiked(false);
      }
    };

    checkLocalStorage();
  }, [supabaseId]);

  // Fetch initial like count and set up real-time subscription
  useEffect(() => {
    const loadLikes = async () => {
      try {
        const likes = await craftLikesManager.getLikes(supabaseId);
        setLikeCount(likes || 0);
      } catch (error) {
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

  // Mark this craft as liked in local storage.
  const markLikedInStorage = useCallback(() => {
    try {
      const likedCrafts = JSON.parse(localStorage.getItem("likedCrafts") || "{}");
      likedCrafts[supabaseId] = true;
      localStorage.setItem("likedCrafts", JSON.stringify(likedCrafts));
      setIsLocallyLiked(true);
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  }, [supabaseId]);

  // Core like: optimistic bump + atomic DB increment, reconciled to the
  // authoritative count. Returns whether the write succeeded.
  const commitLike = useCallback(async (): Promise<boolean> => {
    // Functional update so rapid taps don't collide on a stale value.
    setLikeCount((count) => count + 1);
    try {
      const newCount = await craftLikesManager.handleLikeInteraction(supabaseId);
      if (typeof newCount === "number") {
        setLikeCount(newCount);
      }
      return true;
    } catch (error) {
      // Roll back the optimistic bump on error.
      setLikeCount((count) => Math.max(0, count - 1));
      return false;
    }
  }, [supabaseId]);

  // Like triggered from the heart button (no flying-heart animation).
  const handleLikeButtonClick = useCallback(async () => {
    // Suppress realtime updates while the optimistic write settles.
    setIsAnimating(true);
    const ok = await commitLike();
    if (!ok) {
      setIsAnimating(false);
      return;
    }
    markLikedInStorage();
    setTimeout(() => setIsAnimating(false), AWAIT_TIME);
  }, [commitLike, markLikedInStorage]);

  const handleDoubleTap = useCallback(
    async (position: { x: number; y: number }) => {
      // Set animation state to prevent real-time updates
      setIsAnimating(true);

      // Atomically increment in the DB; sync to the authoritative count.
      const ok = await commitLike();
      if (!ok) {
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

        // Force cursor refresh
        if (doubleTapAreaRef.current) {
          doubleTapAreaRef.current.style.cursor = "default";
        }

        // Show placeholder after animation completes
        setTimeout(() => {
          setShowPlaceholder(true);
          setShowHeart(false);

          // Update local storage after animation completes
          setTimeout(() => {
            markLikedInStorage();

            // Reset animation state after local storage update
            setIsAnimating(false);
          }, 100);
        }, AWAIT_TIME);
      }, 100);
    },
    [commitLike, markLikedInStorage]
  );

  useDoubleTap(doubleTapAreaRef as React.RefObject<HTMLElement>, handleDoubleTap);

  return (
    <div className="w-full h-full space-y-2">
      <div className="relative cursor-default" ref={doubleTapAreaRef}>
        <CraftVideo {...{ playbackId, title }} />
        {showHeart && (
          <motion.div
            key={`heart-overlay-${uniqueId}`}
            id={overlayId}
            layoutId={layoutId}
            className="absolute flex items-center justify-center pointer-events-none z-10"
            initial={{ scale: 1 }}
            animate={{
              scale: 1.5,
              y: -50,
              rotate: Math.floor(Math.random() * 91) - 45,
            }}
            style={{
              left: tapPosition.x - 20,
              top: tapPosition.y - 20,
              pointerEvents: "none",
              cursor: "default",
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
      <div className="">
        <h2 className="text-base font-medium select-none">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLikeButtonClick}
            className="flex items-center gap-1 text-base"
          >
            <div className="relative size-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Heart
                  className="size-4"
                  fill={isLocallyLiked ? "url(#heart-gradient)" : "transparent"}
                  stroke={
                    isLocallyLiked ? "url(#heart-gradient)" : "currentColor"
                  }
                />
              </div>
              {showPlaceholder && (
                <motion.div
                  key={`heart-placeholder-${uniqueId}`}
                  id={placeholderId}
                  layoutId={layoutId}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Heart
                    className="size-4"
                    stroke="url(#heart-gradient)"
                    fill="url(#heart-gradient)"
                  />
                </motion.div>
              )}
            </div>
            <div>{isLoading ? "" : likeCount}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CraftCard;
