import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { voiceMemories } from "../../lib/content";
import Particles from "../custom/Particles";

const FAKE_DURATION_MS = 21000; // ~21s playthrough — paced to feel intimate

export default function VoiceMemoryRoom() {
  const memory = voiceMemories[0];
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0); // 0..1
  const tickRef = useRef(null);
  const startedAtRef = useRef(0);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(tickRef.current);
      return;
    }
    startedAtRef.current = performance.now() - accumulatedRef.current;
    const loop = (now) => {
      const ms = now - startedAtRef.current;
      accumulatedRef.current = ms;
      const p = Math.min(1, ms / FAKE_DURATION_MS);
      setElapsed(p);
      if (p >= 1) {
        setPlaying(false);
        accumulatedRef.current = 0;
        setElapsed(1);
        return;
      }
      tickRef.current = requestAnimationFrame(loop);
    };
    tickRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(tickRef.current);
  }, [playing]);

  const subtitleIndex = Math.min(
    memory.subtitle.length - 1,
    Math.floor(elapsed * memory.subtitle.length)
  );
  const activeLine = playing || elapsed > 0 ? memory.subtitle[subtitleIndex] : "";

  return (
    <section
      id="voice"
      data-testid="voice-memory-section"
      className="relative w-full py-28 px-4 sm:px-8 overflow-hidden"
    >
      {/* Spotlight + warm haze */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(212, 180, 131, 0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(138, 30, 42, 0.10) 0%, transparent 60%)",
        }}
      />
      <Particles count={18} opacity={0.45} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-14 relative z-10"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          a recording, just for you
        </p>
        <h2 className="font-serif-display text-5xl sm:text-6xl" style={{ color: "#F8F8F8" }}>
          Voice Memory Room
        </h2>
      </motion.div>

      {/* Cassette */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <div
          className="relative mx-auto"
          style={{
            width: "100%",
            maxWidth: 480,
            aspectRatio: "16 / 10",
            borderRadius: 14,
            background:
              "linear-gradient(180deg, #3a221a 0%, #2a1812 60%, #1d1009 100%)",
            border: "1px solid rgba(212, 180, 131, 0.25)",
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 50px rgba(212,180,131,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
          data-testid="cassette-player"
        >
          {/* Top label */}
          <div className="absolute left-6 right-6 top-5 flex items-center justify-between font-body text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(212,180,131,0.7)" }}>
            <span>· side a ·</span>
            <span>{memory.title}</span>
            <span>{memory.duration}</span>
          </div>

          {/* Reels */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-12 sm:gap-20">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                animate={{ rotate: playing ? 360 : 0 }}
                transition={{
                  duration: 4,
                  repeat: playing ? Infinity : 0,
                  ease: "linear",
                }}
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 30% 30%, #4a2a20 0%, #1d1009 70%)",
                  border: "1px solid rgba(212, 180, 131, 0.18)",
                  boxShadow:
                    "inset 0 0 20px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)",
                }}
                className="relative flex items-center justify-center"
              >
                {/* Spokes */}
                {[0, 60, 120].map((deg) => (
                  <div
                    key={deg}
                    className="absolute"
                    style={{
                      width: 2,
                      height: 56,
                      background:
                        "linear-gradient(180deg, rgba(212,180,131,0.5), rgba(212,180,131,0.05))",
                      transform: `rotate(${deg}deg)`,
                    }}
                  />
                ))}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#D4B483",
                    boxShadow: "0 0 0 3px #1d1009",
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Tape progress strip */}
          <div className="absolute left-6 right-6 bottom-5">
            <div
              className="h-[2px] w-full rounded-full overflow-hidden"
              style={{ background: "rgba(212,180,131,0.15)" }}
            >
              <div
                className="h-full"
                style={{
                  width: `${elapsed * 100}%`,
                  background:
                    "linear-gradient(90deg, rgba(212,180,131,0.9), rgba(138,30,42,0.9))",
                  transition: "width 120ms linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* Waveform */}
        <div className="mt-10 flex items-center justify-center gap-1 h-12" data-testid="voice-waveform">
          {Array.from({ length: 48 }).map((_, i) => {
            const seed = (i * 13) % 31;
            const baseH = 6 + (seed % 12);
            const reactive = playing ? 8 + ((i + Math.floor(elapsed * 100)) % 7) * 3 : 0;
            return (
              <span
                key={i}
                className="inline-block rounded-full"
                style={{
                  width: 3,
                  height: baseH + reactive,
                  background:
                    "linear-gradient(180deg, rgba(212,180,131,0.9), rgba(138,30,42,0.55))",
                  opacity: playing ? 0.9 : 0.3,
                  transition: "height 200ms ease, opacity 600ms ease",
                }}
              />
            );
          })}
        </div>

        {/* Play button */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            data-testid="voice-play-btn"
            onClick={() => setPlaying((v) => !v)}
            className="btn-elegant flex items-center gap-3 font-body uppercase tracking-[0.32em] text-xs"
            style={{
              padding: "14px 30px",
              background: "transparent",
              color: "#F5E9DC",
              border: "1px solid rgba(212,180,131,0.55)",
              borderRadius: 999,
            }}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "pause" : elapsed > 0 ? "resume" : "play voice note"}
          </button>
        </div>

        {/* Subtitle */}
        <div className="mt-10 min-h-[80px] flex items-center justify-center text-center px-4">
          <AnimatePresence mode="wait">
            {activeLine && (
              <motion.p
                key={activeLine}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                data-testid="voice-subtitle"
                className="font-serif-display italic text-xl sm:text-2xl leading-relaxed max-w-xl"
                style={{ color: "#F5E9DC" }}
              >
                “{activeLine}”
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
