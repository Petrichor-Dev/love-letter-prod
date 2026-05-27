import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "../custom/Particles";
import { flowerScene } from "../../lib/content";

/**
 * Section 20 — The Final Flower Surprise
 * Stages:
 *   dark     : almost-black screen, single hint of warmth, hint text fades in
 *   blooming : rose grows from a tiny light into full bloom (~4s)
 *   bloomed  : flower ready, "tap the rose" prompt
 *   revealed : tap → petals glow, message1+message2 appear sequentially
 *   hidden   : longer hidden letter reveals after a beat
 *   final    : screen fades to black, "Forever Yours." remains
 */
export default function FinalFlowerSurprise() {
  const [stage, setStage] = useState("dark");

  useEffect(() => {
    if (stage === "dark") {
      const t = setTimeout(() => setStage("blooming"), 2200);
      return () => clearTimeout(t);
    }
    if (stage === "blooming") {
      const t = setTimeout(() => setStage("bloomed"), 4800);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleTap = () => {
    if (stage !== "bloomed") return;
    setStage("revealed");
    setTimeout(() => setStage("hidden"), 6200);
    setTimeout(() => setStage("final"), 14000);
  };

  return (
    <section
      id="final-flower"
      data-testid="final-flower-section"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
    >
      {/* Slowly darkening background */}
      <motion.div
        animate={{
          opacity:
            stage === "dark" ? 1 :
            stage === "blooming" ? 0.85 :
            stage === "bloomed" || stage === "revealed" ? 0.7 :
            stage === "hidden" ? 0.85 : 1,
        }}
        transition={{ duration: 3.6 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20, 12, 14, 0.4) 0%, rgba(7, 5, 7, 1) 70%), #000",
        }}
      />

      {/* Particles slowly fading as we approach final */}
      <motion.div
        animate={{ opacity: stage === "final" ? 0 : stage === "dark" ? 0.25 : 0.6 }}
        transition={{ duration: 2.4 }}
      >
        <Particles count={stage === "final" ? 10 : 50} opacity={0.7} />
      </motion.div>

      {/* Hint text in 'dark' */}
      <AnimatePresence>
        {stage === "dark" && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }}
            className="absolute font-script text-2xl"
            style={{ color: "rgba(212,180,131,0.55)" }}
          >
            wait…
          </motion.p>
        )}
      </AnimatePresence>

      {/* The rose */}
      <AnimatePresence>
        {(stage === "blooming" || stage === "bloomed" || stage === "revealed" || stage === "hidden") && (
          <motion.button
            key="rose"
            type="button"
            data-testid="final-flower-btn"
            onClick={handleTap}
            initial={{ opacity: 0, scale: 0.05, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              scale: stage === "blooming" ? [0.05, 0.4, 0.8, 1] : 1,
              filter: stage === "blooming" ? ["blur(6px)", "blur(2px)", "blur(0px)"] : "blur(0px)",
            }}
            transition={{ duration: stage === "blooming" ? 4.6 : 1.6, ease: [0.22, 0.61, 0.36, 1] }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={stage === "bloomed" ? { scale: 1.04 } : {}}
            whileTap={stage === "bloomed" ? { scale: 0.97 } : {}}
            className="relative z-10 group cursor-pointer"
            style={{ background: "transparent", border: "none" }}
            aria-label="tap the rose"
          >
            {/* Warm halo */}
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 380,
                height: 380,
                background:
                  "radial-gradient(circle, rgba(255, 196, 130, 0.35) 0%, rgba(212, 180, 131, 0.12) 35%, transparent 70%)",
                filter: "blur(20px)",
                animation: stage === "revealed" || stage === "hidden" ? "glowSurge 2.4s ease-out forwards" : "glowBreath 5s ease-in-out infinite",
              }}
            />
            <RoseSVG size={260} stage={stage} />

            {stage === "bloomed" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ delay: 0.8, duration: 1.4 }}
                className="absolute left-1/2 -translate-x-1/2 font-script text-2xl whitespace-nowrap"
                style={{ bottom: -50, color: "#D4B483" }}
              >
                {flowerScene.hint} ♡
              </motion.p>
            )}

            <style>{`
              @keyframes glowBreath {
                0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                50%      { opacity: 0.9; transform: translate(-50%, -50%) scale(1.06); }
              }
              @keyframes glowSurge {
                0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                60%  { opacity: 1;   transform: translate(-50%, -50%) scale(1.4); }
                100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.15); }
              }
            `}</style>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stage messages */}
      <div className="relative z-10 w-full max-w-2xl text-center" style={{ marginTop: 60 }}>
        <AnimatePresence mode="wait">
          {stage === "revealed" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 2.0 }}
              data-testid="final-flower-message"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.6 }}
                className="font-script text-3xl mb-6"
                style={{ color: "#D4B483" }}
              >
                “{flowerScene.shortVoice}”
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1.8 }}
                className="font-serif-display italic text-2xl sm:text-3xl leading-snug"
                style={{ color: "#F5E9DC" }}
              >
                {flowerScene.message1}
              </motion.h3>
              <motion.h3
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.6, duration: 1.8 }}
                className="font-serif-display italic text-3xl sm:text-4xl leading-snug mt-4"
                style={{ color: "#F8F8F8" }}
              >
                {flowerScene.message2}
              </motion.h3>
            </motion.div>
          )}

          {stage === "hidden" && (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.4 }}
              data-testid="final-flower-hidden"
              className="space-y-2"
            >
              {flowerScene.hidden.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: line === "" ? 0 : 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.8, duration: 1.2 }}
                  className="font-serif-display italic text-lg sm:text-2xl leading-relaxed"
                  style={{ color: "#F5E9DC" }}
                >
                  {line || "\u00A0"}
                </motion.p>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: flowerScene.hidden.length * 0.8 + 1.4, duration: 1.4 }}
                className="font-body text-[10px] tracking-[0.45em] uppercase mt-8"
                style={{ color: "#D4B483" }}
              >
                {flowerScene.timestamp}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Final fade */}
      <AnimatePresence>
        {stage === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3.4 }}
            className="absolute inset-0 z-[20] flex items-center justify-center"
            style={{ background: "rgba(0, 0, 0, 0.96)" }}
            data-testid="final-flower-end"
          >
            <motion.h2
              initial={{ opacity: 0, letterSpacing: "0.04em" }}
              animate={{ opacity: 1, letterSpacing: "0.18em" }}
              transition={{ duration: 4.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-serif-display italic text-5xl sm:text-7xl text-center"
              style={{ color: "#F5E9DC" }}
            >
              {flowerScene.finalLine}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * Procedural rose SVG that "blooms":
 * - stem & leaves fade in early
 * - petals scale & open via animated transforms
 */
function RoseSVG({ size = 260, stage }) {
  const bloomT =
    stage === "blooming" ? 1 :
    stage === "bloomed" || stage === "revealed" || stage === "hidden" ? 1 : 0;

  const petalAnim = (delay, rotate, scaleFrom = 0.05) => ({
    initial: { opacity: 0, scale: scaleFrom, rotate },
    animate: { opacity: bloomT, scale: bloomT === 1 ? 1 : scaleFrom, rotate },
    transition: { duration: 3.6, delay, ease: [0.22, 0.61, 0.36, 1] },
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        filter:
          "drop-shadow(0 14px 30px rgba(138, 30, 42, 0.45)) drop-shadow(0 0 18px rgba(212, 180, 131, 0.4))",
      }}
    >
      {/* Stem */}
      <motion.path
        d="M100 188 Q 102 160 100 130 Q 98 110 100 92"
        stroke="#3b5a2c"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      />
      {/* Leaves */}
      <motion.path
        d="M100 150 Q 80 142 70 124 Q 86 124 100 146"
        fill="#3e6b2a"
        opacity={0.85}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: bloomT, opacity: bloomT * 0.85 }}
        style={{ transformOrigin: "100px 150px" }}
        transition={{ duration: 2.4, delay: 0.6 }}
      />
      <motion.path
        d="M100 162 Q 120 156 132 138 Q 116 138 100 158"
        fill="#4a7c34"
        opacity={0.85}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: bloomT, opacity: bloomT * 0.85 }}
        style={{ transformOrigin: "100px 162px" }}
        transition={{ duration: 2.4, delay: 0.9 }}
      />

      {/* Outer petals (5) */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <motion.ellipse
          key={`outer-${i}`}
          cx="100" cy="78" rx="22" ry="34"
          fill="#8A1E2A"
          opacity="0.92"
          style={{ transformOrigin: "100px 100px" }}
          {...petalAnim(1.0 + i * 0.18, deg)}
        />
      ))}

      {/* Mid petals (5) */}
      {[36, 108, 180, 252, 324].map((deg, i) => (
        <motion.ellipse
          key={`mid-${i}`}
          cx="100" cy="86" rx="16" ry="24"
          fill="#A8243A"
          opacity="0.97"
          style={{ transformOrigin: "100px 100px" }}
          {...petalAnim(1.8 + i * 0.18, deg)}
        />
      ))}

      {/* Inner petals (5) */}
      {[18, 90, 162, 234, 306].map((deg, i) => (
        <motion.ellipse
          key={`inner-${i}`}
          cx="100" cy="92" rx="10" ry="15"
          fill="#C03C4E"
          style={{ transformOrigin: "100px 100px" }}
          {...petalAnim(2.6 + i * 0.16, deg)}
        />
      ))}

      {/* Center bud */}
      <motion.circle
        cx="100" cy="100" r="8"
        fill="#5E1119"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: bloomT, opacity: bloomT }}
        transition={{ duration: 2.0, delay: 3.2 }}
        style={{ transformOrigin: "100px 100px" }}
      />
      {/* Subtle highlight */}
      <motion.circle
        cx="96" cy="96" r="3"
        fill="#F5E9DC"
        opacity="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: bloomT }}
        transition={{ duration: 2.0, delay: 3.6 }}
      />
    </svg>
  );
}
