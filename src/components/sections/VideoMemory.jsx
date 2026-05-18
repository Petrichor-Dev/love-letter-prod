import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { videoMemory } from "../../lib/content";

export default function VideoMemory() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      id="video"
      data-testid="video-memory-section"
      className="relative w-full py-28 px-4 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-12"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          press play, love
        </p>
        <h2
          className="font-serif-display text-5xl sm:text-6xl"
          style={{ color: "#F8F8F8" }}
        >
          {videoMemory.title}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative max-w-5xl mx-auto"
      >
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 18,
            boxShadow:
              "0 50px 100px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,180,131,0.18), 0 0 60px rgba(138,30,42,0.18)",
            background: "#0a0a0a",
          }}
        >
          <video
            ref={ref}
            src={videoMemory.videoSrc}
            poster={videoMemory.poster}
            loop
            playsInline
            preload="metadata"
            data-testid="video-element"
            className="w-full block"
            style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          />

          {/* Overlay controls */}
          <button
            type="button"
            onClick={toggle}
            data-testid="video-play-btn"
            className="absolute inset-0 flex items-center justify-center group"
            style={{
              background: playing
                ? "transparent"
                : "linear-gradient(180deg, rgba(15,15,16,0.15) 0%, rgba(15,15,16,0.55) 100%)",
              transition: "background 600ms ease",
            }}
          >
            <span
              className="flex items-center justify-center rounded-full transition-all duration-700"
              style={{
                width: 88,
                height: 88,
                background: "rgba(245, 233, 220, 0.92)",
                color: "#8A1E2A",
                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212,180,131,0.5)",
                opacity: playing ? 0 : 1,
                transform: playing ? "scale(0.7)" : "scale(1)",
              }}
            >
              {playing ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </span>
          </button>

          {/* Subtitle */}
          <div
            className="absolute left-0 right-0 bottom-0 px-6 pb-5 pt-12 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(15,15,16,0.85) 80%)",
            }}
          >
            <p
              className="font-serif-display italic text-sm sm:text-base text-center"
              style={{ color: "#F5E9DC" }}
            >
              {videoMemory.caption}
            </p>
          </div>
        </div>

        {/* Soft glow under the player */}
        <div
          aria-hidden="true"
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "70%",
            height: 30,
            background:
              "radial-gradient(ellipse at center, rgba(212,180,131,0.4), transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </motion.div>
    </section>
  );
}
