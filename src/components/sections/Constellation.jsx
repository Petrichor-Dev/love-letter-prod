import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { constellationStars, constellationLines } from "../../lib/content";

export default function Constellation() {
  const [active, setActive] = useState(null);

  // Generate faint background stars (decorative)
  const backgroundStars = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 0.4 + Math.random() * 1.1,
        o: 0.2 + Math.random() * 0.55,
        delay: Math.random() * 6,
      })),
    []
  );

  const starById = (id) => constellationStars.find((s) => s.id === id);

  return (
    <section
      id="constellation"
      data-testid="constellation-section"
      className="relative w-full py-28 px-4 sm:px-8 overflow-hidden"
    >
      {/* Deep night sky */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(40, 22, 58, 0.55) 0%, rgba(10, 8, 18, 0.95) 60%, #07060c 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-12 relative z-10"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          our little universe
        </p>
        <h2 className="font-serif-display text-5xl sm:text-6xl" style={{ color: "#F8F8F8" }}>
          Constellation of Us
        </h2>
        <p className="mt-3 font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: "#D8D8D8" }}>
          every star is a memory · tap to remember
        </p>
      </motion.div>

      {/* Sky */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2 }}
        className="relative mx-auto"
        style={{
          maxWidth: 960,
          aspectRatio: "16 / 9",
          borderRadius: 14,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(40, 22, 58, 0.45) 0%, rgba(10, 8, 18, 0.7) 70%)",
          border: "1px solid rgba(212, 180, 131, 0.10)",
          boxShadow:
            "0 60px 120px -30px rgba(0,0,0,0.8), inset 0 0 120px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}
      >
        {/* Background twinkling stars */}
        {backgroundStars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.r * 2,
              height: s.r * 2,
              background: "white",
              opacity: s.o,
              filter: "blur(0.4px)",
              animation: `twinkle 4s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {/* Constellation lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {constellationLines.map(([a, b], i) => {
            const A = starById(a);
            const B = starById(b);
            if (!A || !B) return null;
            return (
              <motion.line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="rgba(212, 180, 131, 0.45)"
                strokeWidth="0.18"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 2.2, delay: 0.6 + i * 0.18, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        {/* Memory stars */}
        {constellationStars.map((star, i) => (
          <motion.button
            key={star.id}
            type="button"
            data-testid={`star-${star.id}`}
            onClick={() => setActive(star)}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.15 }}
            whileHover={{ scale: 1.4 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 6,
              height: star.size * 6,
              borderRadius: "50%",
              background: "radial-gradient(circle, #F8F8F8 0%, rgba(212,180,131,0.85) 40%, transparent 70%)",
              boxShadow:
                "0 0 18px rgba(255,255,255,0.6), 0 0 38px rgba(212,180,131,0.4)",
              cursor: "pointer",
              animation: `starPulse 3.5s ease-in-out ${i * 0.3}s infinite`,
            }}
            aria-label={star.label}
          />
        ))}

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 0.95; }
          }
          @keyframes starPulse {
            0%, 100% { filter: brightness(1); }
            50%      { filter: brightness(1.4); }
          }
        `}</style>
      </motion.div>

      {/* Star modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setActive(null)}
            data-testid="constellation-modal"
            className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
            style={{ background: "rgba(7,6,12,0.88)", backdropFilter: "blur(18px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full px-8 py-10 text-center"
              style={{
                borderRadius: 14,
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(212,180,131,0.18), transparent 60%), rgba(15,15,16,0.9)",
                border: "1px solid rgba(212,180,131,0.3)",
              }}
            >
              <span
                className="inline-block mx-auto mb-6"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #F8F8F8 0%, rgba(212,180,131,0.85) 50%, transparent 75%)",
                  boxShadow: "0 0 36px rgba(255,255,255,0.7)",
                }}
              />
              <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "#D4B483" }}>
                {active.label}
              </p>
              <p className="font-serif-display italic text-2xl sm:text-3xl leading-snug" style={{ color: "#F5E9DC" }}>
                {active.quote}
              </p>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); setActive(null); }}
              type="button"
              data-testid="constellation-modal-close"
              className="absolute top-6 left-6 h-11 w-11 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(15,15,16,0.7)",
                border: "1px solid rgba(212,180,131,0.4)",
                color: "#D4B483",
                zIndex: 10001,
              }}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
