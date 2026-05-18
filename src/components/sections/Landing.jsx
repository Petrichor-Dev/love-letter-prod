import React from "react";
import { motion } from "framer-motion";
import Envelope from "../custom/Envelope";
import Particles from "../custom/Particles";
import { couple } from "../../lib/content";

export default function Landing({ onOpen }) {
  return (
    <motion.section
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6"
      data-testid="landing-section"
    >
      <Particles count={36} opacity={0.7} />

      {/* Soft red halo behind the envelope */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 720,
          height: 720,
          background:
            "radial-gradient(circle, rgba(138, 30, 42, 0.22) 0%, rgba(212, 180, 131, 0.06) 35%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="font-script text-3xl md:text-4xl mb-2"
        style={{ color: "#D4B483" }}
        data-testid="landing-script-line"
      >
        a quiet little something
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-center leading-[1.05]"
        style={{ color: "#F8F8F8", letterSpacing: "0.01em" }}
        data-testid="landing-title"
      >
        A Letter For You
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 1.2 }}
        className="mt-3 font-body text-sm md:text-base tracking-[0.3em] uppercase"
        style={{ color: "#D8D8D8" }}
      >
        open with love &nbsp;♡
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.5, duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="my-12 md:my-14"
      >
        <Envelope
          state="closed"
          initialLeft={couple.initials.left}
          initialRight={couple.initials.right}
          size={typeof window !== "undefined" && window.innerWidth < 640 ? 280 : 360}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 1.0 }}
        onClick={onOpen}
        data-testid="open-letter-btn"
        className="btn-elegant relative font-body uppercase tracking-[0.32em] text-xs sm:text-sm"
        style={{
          padding: "16px 38px",
          background: "transparent",
          color: "#F5E9DC",
          border: "1px solid rgba(212, 180, 131, 0.55)",
          borderRadius: 999,
        }}
      >
        Open Letter
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.4, duration: 1.4 }}
        className="absolute bottom-6 left-0 right-0 text-center font-body text-[10px] tracking-[0.4em] uppercase"
        style={{ color: "rgba(248,248,248,0.4)" }}
      >
        for {couple.recipientShort.toLowerCase()} &nbsp;·&nbsp; with all my heart
      </motion.p>
    </motion.section>
  );
}
