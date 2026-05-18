import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particles from "../custom/Particles";
import { welcomeLetter, couple } from "../../lib/content";

/**
 * Welcome letter card with cinematic typing animation.
 * Lines fade-up & type sequentially.
 */
export default function WelcomeLetter() {
  return (
    <section
      id="welcome"
      data-testid="welcome-letter-section"
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-24"
    >
      {/* Blurred romantic photo background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=70')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(28px) brightness(0.35) saturate(1.1)",
          transform: "scale(1.15)",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(15,15,16,0.85) 100%)",
        }}
      />

      <Particles count={20} opacity={0.5} />

      <motion.div
        initial={{ opacity: 0, y: 60, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="paper-texture relative max-w-2xl w-full px-8 sm:px-14 py-14 sm:py-16"
        style={{
          borderRadius: 4,
          boxShadow:
            "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,180,131,0.18)",
        }}
        data-testid="welcome-letter-card"
      >
        {/* Top date */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="font-body text-[10px] tracking-[0.4em] uppercase mb-8"
          style={{ color: "#8A1E2A" }}
        >
          {new Date(couple.anniversary).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}{" "}
          · letter no. 01
        </motion.div>

        <h2
          className="font-serif-display italic text-3xl sm:text-4xl mb-8"
          style={{ color: "#5E1119" }}
          data-testid="welcome-greeting"
        >
          {welcomeLetter.greeting}
        </h2>

        <div className="space-y-5">
          {welcomeLetter.body.map((line, i) => (
            <TypingLine key={i} text={line} delay={0.7 + i * 1.6} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 + welcomeLetter.body.length * 1.6 + 0.4, duration: 1.4 }}
          className="mt-12 flex flex-col items-end"
        >
          <span className="font-serif-display italic text-base" style={{ color: "#3E2A1B" }}>
            {welcomeLetter.signOff},
          </span>
          <span className="font-script text-5xl mt-1" style={{ color: "#8A1E2A" }}>
            {welcomeLetter.signature}
          </span>
        </motion.div>

        {/* Decorative corner ornament */}
        <div
          className="absolute -top-3 -left-3 w-10 h-10"
          style={{
            borderTop: "1px solid rgba(138,30,42,0.4)",
            borderLeft: "1px solid rgba(138,30,42,0.4)",
          }}
        />
        <div
          className="absolute -bottom-3 -right-3 w-10 h-10"
          style={{
            borderBottom: "1px solid rgba(138,30,42,0.4)",
            borderRight: "1px solid rgba(138,30,42,0.4)",
          }}
        />
      </motion.div>
    </section>
  );
}

function TypingLine({ text, delay = 0 }) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (shown >= text.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 18 + Math.random() * 24);
    return () => clearTimeout(t);
  }, [shown, started, text]);

  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay, duration: 0.9 }}
      onAnimationComplete={() => setStarted(true)}
      className="font-serif-display text-lg sm:text-xl leading-relaxed"
      style={{ color: "#2C1810" }}
    >
      {text.slice(0, shown)}
      {started && shown < text.length && (
        <span className="inline-block w-[2px] h-5 align-middle ml-0.5 animate-pulse" style={{ background: "#8A1E2A" }} />
      )}
    </motion.p>
  );
}
