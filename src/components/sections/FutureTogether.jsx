import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { couple, futureDreams } from "../../lib/content";
import Particles from "../custom/Particles";

function useCountdown(targetIso) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function FutureTogether() {
  const { days, hours, minutes, seconds } = useCountdown(couple.nextMeeting);

  return (
    <section
      id="future"
      data-testid="future-section"
      className="relative w-full py-28 px-4 sm:px-8 overflow-hidden"
    >
      {/* Warmer atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(212, 180, 131, 0.12), transparent 60%), radial-gradient(ellipse at bottom, rgba(138, 30, 42, 0.08), transparent 55%)",
        }}
      />
      <Particles count={26} opacity={0.7} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-16 relative z-10"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          ahead of us
        </p>
        <h2
          className="font-serif-display text-5xl sm:text-6xl"
          style={{ color: "#F8F8F8" }}
        >
          Future, Together
        </h2>
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="relative z-10 max-w-3xl mx-auto mb-20 px-6 py-10 text-center"
        style={{
          borderRadius: 8,
          background:
            "linear-gradient(135deg, rgba(245,233,220,0.06), rgba(245,233,220,0.02))",
          border: "1px solid rgba(212, 180, 131, 0.22)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p
          className="font-body text-[10px] tracking-[0.45em] uppercase mb-6"
          style={{ color: "#D4B483" }}
        >
          next meeting in
        </p>
        <div
          className="grid grid-cols-4 gap-3 sm:gap-6"
          data-testid="countdown-grid"
        >
          {[
            { label: "Days", value: days },
            { label: "Hours", value: hours },
            { label: "Min", value: minutes },
            { label: "Sec", value: seconds },
          ].map((c) => (
            <div key={c.label} className="flex flex-col items-center">
              <span
                className="font-serif-display text-4xl sm:text-6xl"
                style={{ color: "#F5E9DC" }}
              >
                {String(c.value).padStart(2, "0")}
              </span>
              <span
                className="font-body text-[9px] tracking-[0.4em] uppercase mt-1"
                style={{ color: "rgba(212,180,131,0.75)" }}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>
        <p
          className="font-serif-display italic text-sm sm:text-base mt-8"
          style={{ color: "#D8D8D8" }}
        >
          until I get to hold you again.
        </p>
      </motion.div>

      {/* Dreams list */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <p
          className="font-body text-[10px] tracking-[0.4em] uppercase mb-6 text-center"
          style={{ color: "#D4B483" }}
        >
          things i want with you
        </p>
        <ul className="space-y-4">
          {futureDreams.map((d, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.9 }}
              className="flex items-start gap-4 px-5 py-4"
              style={{
                borderBottom: "1px solid rgba(212,180,131,0.14)",
              }}
              data-testid={`dream-${i}`}
            >
              <span
                className="font-serif-display text-xl"
                style={{ color: "#8A1E2A" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="font-serif-display italic text-lg sm:text-xl leading-snug"
                style={{ color: "#F5E9DC" }}
              >
                {d}
              </p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
