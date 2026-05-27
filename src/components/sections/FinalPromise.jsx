import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Envelope from "../custom/Envelope";
import Particles from "../custom/Particles";
import { couple, finalPromise } from "../../lib/content";
import { setMuted } from "../../lib/audio";

/**
 * Section 15 — Final Promise Scene
 * Slow cinematic closure:
 *   stage 'idle'   : promise text + CTA visible
 *   stage 'sealing': envelope re-closes, particles fade, music fades out
 *   stage 'sealed' : final words "Forever Yours." revealed
 */
export default function FinalPromise({ onReplay }) {
  const [stage, setStage] = useState("idle");

  const handleSeal = () => {
    setStage("sealing");
    try { setMuted(true); } catch (e) {}
    setTimeout(() => setStage("sealed"), 4800);
  };

  return (
    <section
      id="final-promise"
      data-testid="final-promise-section"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-28 overflow-hidden"
    >
      {/* Slowly darkening background */}
      <motion.div
        animate={{
          opacity:
            stage === "idle" ? 1 : stage === "sealing" ? 0.6 : 0.15,
        }}
        transition={{ duration: 3.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(45, 25, 60, 0.5) 0%, rgba(15, 15, 16, 1) 70%), linear-gradient(180deg, #0a0510 0%, #0F0F10 100%)",
        }}
      />
      <motion.div
        animate={{ opacity: stage === "sealed" ? 0 : 1 }}
        transition={{ duration: 2.4 }}
      >
        <Particles count={70} opacity={stage === "idle" ? 0.95 : 0.5} />
      </motion.div>

      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative z-10 text-center max-w-3xl"
          >
            <p
              className="font-script text-3xl mb-8"
              style={{ color: "#D4B483" }}
              data-testid="final-intro"
            >
              {finalPromise.intro}
            </p>

            <h2
              className="font-serif-display italic text-3xl sm:text-5xl lg:text-6xl leading-[1.25]"
              style={{ color: "#F8F8F8" }}
            >
              {finalPromise.lines.map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 1.4 }}
              className="mt-10 flex justify-center"
            >
              <span
                className="inline-block text-5xl"
                style={{
                  color: "#8A1E2A",
                  filter: "drop-shadow(0 0 24px rgba(184,58,74,0.55))",
                }}
              >
                ♡
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 1.2 }}
              type="button"
              onClick={handleSeal}
              data-testid="seal-memory-btn"
              className="btn-elegant mt-14 font-body uppercase tracking-[0.32em] text-xs sm:text-sm"
              style={{
                padding: "16px 38px",
                background: "transparent",
                color: "#F5E9DC",
                border: "1px solid rgba(212, 180, 131, 0.55)",
                borderRadius: 999,
              }}
            >
              {finalPromise.ctaLabel}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2.6, duration: 1.4 }}
              className="font-body text-[10px] tracking-[0.4em] uppercase mt-10"
              style={{ color: "rgba(248,248,248,0.45)" }}
            >
              for {couple.recipientShort.toLowerCase()} · with all of me
            </motion.p>
          </motion.div>
        )}

        {stage === "sealing" && (
          <motion.div
            key="sealing"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="relative z-10 flex flex-col items-center"
            data-testid="final-sealing"
          >
            {/* Envelope re-closing — opening sequence played in reverse via animated state */}
            <SealingEnvelope />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1.4 }}
              className="font-script text-2xl mt-12"
              style={{ color: "#D4B483" }}
            >
              sealing…
            </motion.p>
          </motion.div>
        )}

        {stage === "sealed" && (
          <motion.div
            key="sealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative z-10 text-center"
            data-testid="final-sealed"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20, letterSpacing: "0.04em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
              transition={{ duration: 3.0, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-serif-display italic text-5xl sm:text-7xl"
              style={{ color: "#F5E9DC" }}
            >
              {finalPromise.closing}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.6 }}
              className="font-script text-2xl mt-10"
              style={{ color: "#D4B483" }}
            >
              — {couple.senderName}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 3.6, duration: 1.4 }}
              type="button"
              onClick={onReplay}
              data-testid="replay-btn"
              className="btn-elegant mt-16 font-body uppercase tracking-[0.32em] text-[11px]"
              style={{
                padding: "14px 30px",
                background: "transparent",
                color: "rgba(245,233,220,0.85)",
                border: "1px solid rgba(212, 180, 131, 0.3)",
                borderRadius: 999,
              }}
            >
              replay our memories
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SealingEnvelope() {
  // Reverse opening: start "opening" (open) then go to "closed" after a tick.
  const [state, setState] = useState("opening");
  React.useEffect(() => {
    const t = setTimeout(() => setState("closed"), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      animate={{ scale: [1.05, 1.0, 0.92], y: [0, 6, 20] }}
      transition={{ duration: 4.5, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <Envelope state={state} initialLeft={couple.initials.left} initialRight={couple.initials.right} size={340} />
    </motion.div>
  );
}
