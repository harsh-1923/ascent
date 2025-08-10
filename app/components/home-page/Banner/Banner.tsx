import React, { useState, useEffect } from "react";
import "./Banner.css";

const Banner = () => {
  const lineWidth = 2; // Width of each line in pixels
  const minGap = 8; // Minimum gap between lines in pixels

  const [numberOfLines, setNumberOfLines] = useState(() =>
    Math.floor(window.innerWidth / (lineWidth + minGap))
  );

  useEffect(() => {
    const handleResize = () => {
      const updatedLineCount = Math.floor(
        window.innerWidth / (lineWidth + minGap)
      );
      setNumberOfLines(updatedLineCount);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="banner-container w-full flex justify-between items-start">
      {Array(numberOfLines)
        .fill(0)
        .map((_, index) => {
          const randomHeight =
            Math.floor(Math.random() * (200 - 100 + 1)) + 100;
          return (
            <div
              key={index}
              className="bg-neutral-400"
              style={{
                width: `${lineWidth}px`,
                height: `${randomHeight}px`,
              }}
            ></div>
          );
        })}
    </div>
  );
};

export default Banner;
