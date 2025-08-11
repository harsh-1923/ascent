"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// Configuration: tweak these to control behavior and feel
const MIN_HEIGHT_TOP_SECTION = 160; // px
const MIN_HEIGHT_BOTTOM_SECTION = 100; // px (threshold for auto-hide)
const DEFAULT_SHOW_BOTTOM_PERCENT = 40; // % bottom when showing via button
const HANDLE_GAP_PX = 10; // px subtracted in calc() to account for handle gap
const EPSILON_EXTRA_PERCENT = 0.5; // extra percent guard to avoid negative calc

const Underlay = () => {
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const topDivRef = useRef<HTMLDivElement>(null);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const prevHandlePositionRef = useRef<number>(50);

  // Position as percentage of available height (0-100)
  const [handlePosition, setHandlePosition] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastHandlePosition, setLastHandlePosition] = useState(60);
  const [topDimensions, setTopDimensions] = useState({ width: 0, height: 0 });
  const [bottomDimensions, setBottomDimensions] = useState({
    width: 0,
    height: 0,
  });

  const updateDimensions = useCallback(() => {
    if (topDivRef.current) {
      const topRect = topDivRef.current.getBoundingClientRect();
      setTopDimensions({
        width: Math.round(topRect.width),
        height: Math.round(topRect.height),
      });
    }
    if (bottomDivRef.current) {
      const bottomRect = bottomDivRef.current.getBoundingClientRect();
      setBottomDimensions({
        width: Math.round(bottomRect.width),
        height: Math.round(bottomRect.height),
      });
    }
  }, []);

  // Smoothly animate the handle position to a target percent and then hide
  const triggerHide = useCallback(() => {
    if (isHidden) return;
    if (!containerRef.current) {
      setIsHidden(true);
      return;
    }
    setIsDragging(false);
    setLastHandlePosition(handlePosition);

    // Hide both handle and bottom section immediately
    setIsHidden(true);
  }, [handlePosition, isHidden]);

  // Animate from collapsed state back to a default split (bottom at 40%) and fade-in
  const triggerShow = useCallback(() => {
    if (!isHidden) return;
    if (!containerRef.current) {
      setIsHidden(false);
      return;
    }
    setIsHidden(false);
    setIsDragging(false);

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const epsilonPercent =
      (HANDLE_GAP_PX / Math.max(containerHeight, 1)) * 100 +
      EPSILON_EXTRA_PERCENT;
    const startPercent = Math.min(100 - epsilonPercent, 100);

    // Target: bottom 40% -> top 60%, respecting min top height
    const desiredTopPercent = 100 - DEFAULT_SHOW_BOTTOM_PERCENT;
    const MIN_TOP_PX = MIN_HEIGHT_TOP_SECTION; // keep consistent with drag logic
    const minTopPercent =
      ((MIN_TOP_PX + HANDLE_GAP_PX) / Math.max(containerRect.height, 1)) * 100;
    const targetPercent = Math.max(
      minTopPercent,
      Math.min(100, desiredTopPercent)
    );

    setHandlePosition(startPercent);

    // Animate to target position with longer delay for smoother transition
    setTimeout(() => {
      setHandlePosition(targetPercent);
      setLastHandlePosition(targetPercent);
    }, 100);
  }, [isHidden]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isHidden) return;
      setIsDragging(true);
      prevHandlePositionRef.current = handlePosition;
      e.preventDefault();
      e.stopPropagation();
    },
    [isHidden, handlePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !dragHandleRef.current)
        return;

      e.preventDefault();
      e.stopPropagation();

      const containerRect = containerRef.current.getBoundingClientRect();
      const handleHeight = dragHandleRef.current.getBoundingClientRect().height;

      // Calculate available height (container height minus handle height)
      const availableHeight = containerRect.height - handleHeight;

      // Calculate mouse position relative to container
      const mouseY = e.clientY - containerRect.top;

      // Calculate position as percentage of available height
      // Constrain the handle to stay within bounds
      const minY = 0;
      const maxY = availableHeight;
      const constrainedY = Math.max(
        minY,
        Math.min(maxY, mouseY - handleHeight / 2)
      );

      let percentage = (constrainedY / availableHeight) * 100;

      // Enforce a minimum top height (in px) by clamping the percent
      const MIN_TOP_PX = MIN_HEIGHT_TOP_SECTION; // configurable
      const minTopPercent =
        ((MIN_TOP_PX + HANDLE_GAP_PX) / Math.max(containerRect.height, 1)) *
        100;
      percentage = Math.max(minTopPercent, Math.min(100, percentage));

      setHandlePosition(percentage);
      prevHandlePositionRef.current = percentage;
    },
    [isDragging]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current || !dragHandleRef.current)
        return;

      e.preventDefault();
      e.stopPropagation();

      const containerRect = containerRef.current.getBoundingClientRect();
      const handleHeight = dragHandleRef.current.getBoundingClientRect().height;

      // Calculate available height (container height minus handle height)
      const availableHeight = containerRect.height - handleHeight;

      // Calculate touch position relative to container
      const touchY = e.touches[0].clientY - containerRect.top;

      // Calculate position as percentage of available height
      // Constrain the handle to stay within bounds
      const minY = 0;
      const maxY = availableHeight;
      const constrainedY = Math.max(
        minY,
        Math.min(maxY, touchY - handleHeight / 2)
      );

      let percentage = (constrainedY / availableHeight) * 100;
      const MIN_TOP_PX = MIN_HEIGHT_TOP_SECTION; // configurable
      const minTopPercent =
        ((MIN_TOP_PX + HANDLE_GAP_PX) / Math.max(containerRect.height, 1)) *
        100;
      percentage = Math.max(minTopPercent, Math.min(100, percentage));

      setHandlePosition(percentage);
      prevHandlePositionRef.current = percentage;
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(
    (e?: MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Check if we should hide the bottom section after dragging stops
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const bottomPercent = 100 - handlePosition;
        const bottomCssPx =
          (bottomPercent / 100) * containerRect.height - HANDLE_GAP_PX;

        if (bottomCssPx <= MIN_HEIGHT_BOTTOM_SECTION) {
          triggerHide();
        }
      }

      setIsDragging(false);
    },
    [isDragging, handlePosition, triggerHide]
  );

  const handleTouchEnd = useCallback(
    (e?: TouchEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Check if we should hide the bottom section after touch ends
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const bottomPercent = 100 - handlePosition;
        const bottomCssPx =
          (bottomPercent / 100) * containerRect.height - HANDLE_GAP_PX;

        if (bottomCssPx <= MIN_HEIGHT_BOTTOM_SECTION) {
          triggerHide();
        }
      }

      setIsDragging(false);
    },
    [isDragging, handlePosition, triggerHide]
  );

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Update dimensions when handle position changes or on mount
  useEffect(() => {
    updateDimensions();
  }, [handlePosition, updateDimensions]);

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateDimensions]);

  // Add touch event listeners directly to drag handle
  useEffect(() => {
    const handle = dragHandleRef.current;
    if (!handle) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isHidden) return;
      setIsDragging(true);
      prevHandlePositionRef.current = handlePosition;
      e.preventDefault();
      e.stopPropagation();
    };

    handle.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      handle.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isHidden, handlePosition]);

  // ResizeObserver to update dimensions continuously during CSS transitions
  useEffect(() => {
    if (!topDivRef.current && !bottomDivRef.current) return;
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    if (topDivRef.current) observer.observe(topDivRef.current);
    if (bottomDivRef.current) observer.observe(bottomDivRef.current);
    return () => observer.disconnect();
  }, [updateDimensions]);

  // Calculate heights for top and bottom divs
  // Use calc() to subtract handle height from the percentage-based heights
  const topHeight = isHidden
    ? "100%"
    : `calc(${handlePosition}% - ${HANDLE_GAP_PX / 2}px)`;
  const bottomHeight = `calc(${100 - handlePosition}% - ${
    HANDLE_GAP_PX / 2
  }px)`;

  return (
    <div
      ref={containerRef}
      className="max-w-120 h-dvh w-screen overflow-hidden"
    >
      <motion.div
        key="top"
        data-underlay-section="top"
        ref={topDivRef}
        className="w-full bg-neutral-900 flex items-center justify-center text-lg font-mono overflow-clip rounded-b-3xl"
        style={{
          height: topHeight,
        }}
        animate={{ height: topHeight }}
        transition={{
          duration: isDragging ? 0 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="text-center">
          <div className="font-semibold text-white">Upper Layer</div>
          <div className="text-sm mt-2 bg-white/20 px-2 py-1 rounded">
            {topDimensions.width}px × {topDimensions.height}px
          </div>
          <AnimatePresence>
            {isHidden && (
              <motion.button
                type="button"
                onClick={triggerShow}
                className="mt-3 text-xs px-3 py-1.5 rounded border border-white/30 text-white/80 hover:text-white hover:bg-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                Show
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {!isHidden && (
          <motion.div
            ref={dragHandleRef}
            className="w-full bg-black/40 cursor-grab select-none flex items-center justify-center text-white font-semibold relative"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-10 h-1 my-2 bg-white rounded-full"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isHidden && (
          <motion.div
            key="bottom"
            data-underlay-section="bottom"
            ref={bottomDivRef}
            className="w-full bg-neutral-900 flex items-center justify-center text-lg font-mono overflow-clip rounded-b-3xl"
            style={{
              height: bottomHeight,
            }}
            animate={{ height: bottomHeight, opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              height: {
                duration: isDragging ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: { duration: 0.3 },
              y: { duration: 0.3 },
            }}
          >
            <div className="font-semibold text-white">Lower Layer</div>
            <div className="text-sm mt-2 bg-white/20 px-2 py-1 rounded">
              {bottomDimensions.width}px × {bottomDimensions.height}px
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Underlay;
