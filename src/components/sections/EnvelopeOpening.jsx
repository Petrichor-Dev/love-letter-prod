import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Envelope from "../custom/Envelope";
import Particles from "../custom/Particles";
import { couple } from "../../lib/content";
import { playSfx } from "../../lib/audio";

/**
 * Cinematic envelope opening sequence (~7 seconds).
 * 0.0s : start - camera zoom + blur ramp up
 * 1.5s : wax seal glow & crack sfx
 * 3.0s : flap opens (handled by Envelope `state="opening"`)
 * 4.5s : warm light leak
 * 5.5s : letter slides upward
 * 7.0s : onComplete -> transition to experience
 */
export default function EnvelopeOpening({ onComplete }) {
  useEffect(() => {
    const t0 = setTimeout(() => playSfx("wax", 0.6), 1500);
    const t1 = setTimeout(() => playSfx("paper", 0.5), 3200);
    const done = setTimeout(() => onComplete?.(), 7000);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <motion.section
      key="opening"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0 }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      data-testid="envelope-opening-section"
    >
      <Particles count={28} opacity={0.8} />

      {/* Background blur ramp */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(138, 30, 42, 0.18) 0%, rgba(15, 15, 16, 0.0) 60%)",
        }}
      />

      {/* Warm light leak that grows */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0, 0.0, 0.45, 0.9, 1.0], scale: [0.6, 0.7, 0.85, 1.05, 1.4, 1.8] }}
        transition={{ duration: 7, times: [0, 0.3, 0.45, 0.62, 0.8, 1], ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(255, 232, 192, 0.7) 0%, rgba(212, 180, 131, 0.35) 30%, transparent 65%)",
          filter: "blur(28px)",
        }}
      />

      {/* Envelope cinematic camera zoom */}
      <motion.div
        initial={{ scale: 0.95, y: 0 }}
        animate={{ scale: [0.95, 1.15, 1.25, 1.3], y: [0, -8, -20, -50] }}
        transition={{ duration: 7, times: [0, 0.45, 0.7, 1], ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10"
      >
        {/* Switch envelope state at ~2.8s */}
        <EnvelopeStaged />
      </motion.div>

      {/* Letter peeking upward at end of sequence */}
      <motion.div
        initial={{ y: 220, opacity: 0 }}
        animate={{ y: [220, 220, 220, 80, -20], opacity: [0, 0, 0, 0.9, 1] }}
        transition={{ duration: 7, times: [0, 0.5, 0.62, 0.85, 1], ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 z-[5]"
        style={{ width: 280 }}
      >
        <div
          className="paper-texture font-script flex items-center justify-center"
          style={{
            width: 280,
            height: 200,
            borderRadius: 6,
            color: "#5E1119",
            fontSize: 28,
            transform: "rotate(-2deg)",
            boxShadow: "0 30px 70px -20px rgba(0,0,0,0.7)",
          }}
        >
          to my dearest…
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.6, 0] }}
        transition={{ duration: 7, times: [0, 0.15, 0.7, 1] }}
        className="absolute bottom-8 left-0 right-0 text-center font-script text-2xl"
        style={{ color: "#D4B483" }}
      >
        opening…
      </motion.p>
    </motion.section>
  );
}

function EnvelopeStaged() {
  const [state, setState] = React.useState("closed");
  useEffect(() => {
    const t = setTimeout(() => setState("opening"), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <Envelope
      state={state}
      initialLeft={couple.initials.left}
      initialRight={couple.initials.right}
      size={typeof window !== "undefined" && window.innerWidth < 640 ? 300 : 380}
    />
  );
}
