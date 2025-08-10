"use client";

import React, { useRef, useState, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";

const CraftVideo = ({
  playbackId,
  title,
}: {
  playbackId: string;
  title: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Lazy load trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting ||
            entry.boundingClientRect.top < window.innerHeight + 200
          ) {
            setShouldLoad(true);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.01 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Fetch thumbnail to determine aspect ratio
  useEffect(() => {
    const img = new Image();
    img.src = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    console.log(aspectRatio);
  }, [playbackId]);

  return (
    <div
      ref={ref}
      style={
        aspectRatio
          ? { aspectRatio: `${aspectRatio}`, width: "100%" }
          : { width: "100%" }
      }
    >
      {shouldLoad ? (
        <MuxPlayer
          playbackId={playbackId}
          metadata={{
            video_title: title || "Video",
            player_name: "Lazy Mux Player",
          }}
          style={{
            width: "100%",
            height: "100%",
            "--controls": "none",
          }}
          className="rounded-lg overflow-clip"
          autoPlay="muted"
          loop
          playsInline
          muted
          preload="auto"
          disablePictureInPicture
          nohotkeys
        />
      ) : (
        <img
          src={`https://image.mux.com/${playbackId}/thumbnail.png?time=1&fit_mode=preserve`}
          alt={title}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default CraftVideo;
