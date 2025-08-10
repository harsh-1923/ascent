"use client";
import React, { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

const WindowDimensions: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set dimensions once component mounts (client-side)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Don't show dimensions until they're available
  // if (dimensions.width === 0) return null;

  return (
    <small className="font-[family-name:var(--font-geist-mono)] text-neutral-600 select-none">
      [<NumberFlow value={dimensions.width} /> x{" "}
      <NumberFlow value={dimensions.height} />]
    </small>
  );
};

export default WindowDimensions;
