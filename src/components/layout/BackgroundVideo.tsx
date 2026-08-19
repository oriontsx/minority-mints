"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const videoSrc =
  "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";
const posterUrl =
  "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080";

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
    }
  }, []);

  return (
    <>
      {/* Background video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster={posterUrl}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      {/* Decorative gradients */}
      <div
        className="absolute mix-blend-screen"
        style={{
          top: "-20%",
          left: "20%",
          width: "600px",
          height: "600px",
          background: "rgba(30, 58, 138, 0.2)",
          filter: "blur(120px)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute mix-blend-screen"
        style={{
          bottom: "-10%",
          right: "20%",
          width: "500px",
          height: "500px",
          background: "rgba(30, 27, 75, 0.2)",
          filter: "blur(120px)",
          borderRadius: "50%",
        }}
      />
    </>
  );
}
