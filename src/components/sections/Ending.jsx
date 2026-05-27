import React from "react";
import { motion } from "framer-motion";
import { endingQuote, couple } from "../../lib/content";
import Particles from "../custom/Particles";

export default function Ending({ onReplay }) {
  return (
    <section
      id="ending"
      data-testid="ending-section"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-28 overflow-hidden"
    >
      {/* Night sky background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(45, 25, 60, 0.5) 0%, rgba(15, 15, 16, 1) 70%), linear-gradient(180deg, #0a0510 0%, #0F0F10 100%)",
        }}
      />
      <Particles count={70} opacity={0.95} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 text-center max-w-3xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1.6 }}
          className="font-script text-3xl mb-8"
          style={{ color: "#D4B483" }}
        >
          one last thing, my love…
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 1.8 }}
          className="font-serif-display italic text-3xl sm:text-5xl lg:text-6xl leading-[1.2]"
          style={{ color: "#F8F8F8" }}
        >
          {endingQuote.line1}
          <br />
          {endingQuote.line2}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.0, duration: 1.4 }}
          className="mt-12 flex justify-center"
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.6, duration: 1.4 }}
          className="font-script text-2xl mt-8"
          style={{ color: "#D4B483" }}
        >
          — {couple.senderName}, forever yours
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 3.0, duration: 1.2 }}
          onClick={onReplay}
          data-testid="replay-btn"
          className="btn-elegant mt-14 font-body uppercase tracking-[0.32em] text-xs sm:text-sm"
          style={{
            padding: "16px 38px",
            background: "transparent",
            color: "#F5E9DC",
            border: "1px solid rgba(212, 180, 131, 0.55)",
            borderRadius: 999,
          }}
        >
          Replay Memories
        </motion.button>
      </motion.div>
    </section>
  );
}
