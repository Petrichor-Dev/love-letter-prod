import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { unsentLetters } from "../../lib/content";
import Particles from "../custom/Particles";

export default function ThingsINeverSaid() {
  const [active, setActive] = useState(null);

  return (
    <section
      id="unsent"
      data-testid="unsent-section"
      className="relative w-full py-28 px-4 sm:px-8 overflow-hidden"
    >
      {/* Soft spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(212,180,131,0.10) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(138,30,42,0.08) 0%, transparent 60%)",
        }}
      />
      <Particles count={16} opacity={0.4} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-16 relative z-10"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          a softer kind of brave
        </p>
        <h2 className="font-serif-display text-5xl sm:text-6xl" style={{ color: "#F8F8F8" }}>
          Things I Never Said
        </h2>
        <p
          className="mt-4 font-body text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "#D8D8D8" }}
        >
          — confessions kept inside, until now —
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
        {unsentLetters.map((l, i) => (
          <motion.button
            key={l.id}
            type="button"
            data-testid={`unsent-${l.id}`}
            initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -2 : 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
            whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
            onClick={() => setActive(l)}
            className="relative mx-auto group"
            style={{ width: "100%", maxWidth: 320 }}
          >
            {/* Folded letter */}
            <div
              className="paper-texture relative px-6 pt-7 pb-8"
              style={{
                borderRadius: 4,
                boxShadow:
                  "0 30px 60px -18px rgba(0,0,0,0.7), 0 12px 24px -8px rgba(0,0,0,0.4)",
              }}
            >
              {/* Fold crease */}
              <div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(138,30,42,0.18), transparent)",
                }}
              />
              {/* Wax dot */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: 18,
                  height: 18,
                  background:
                    "radial-gradient(circle at 35% 30%, #B83A4A 0%, #8A1E2A 60%, #5E1119 100%)",
                  boxShadow:
                    "inset 0 1px 2px rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.5)",
                }}
              />

              <p className="font-script text-3xl text-center" style={{ color: "#8A1E2A" }}>
                {l.preview}
              </p>
              <p
                className="font-serif-display italic text-center text-lg mt-3"
                style={{ color: "#2C1810" }}
              >
                {l.title}
              </p>
              <p
                className="font-body text-[10px] tracking-[0.35em] uppercase text-center mt-3"
                style={{ color: "rgba(138,30,42,0.65)" }}
              >
                — unfold to read —
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setActive(null)}
            data-testid="unsent-modal"
            className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
            style={{ background: "rgba(15,15,16,0.9)", backdropFilter: "blur(16px)" }}
          >
            <motion.div
              initial={{ scaleY: 0.05, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0.1, opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ transformOrigin: "center", borderRadius: 4, boxShadow: "0 60px 120px -30px rgba(0,0,0,0.9)" }}
              onClick={(e) => e.stopPropagation()}
              className="paper-texture max-w-xl w-full px-8 sm:px-12 py-12 relative"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1.2 }}
                className="font-body text-[10px] tracking-[0.4em] uppercase mb-6"
                style={{ color: "#8A1E2A" }}
              >
                — a letter I never sent —
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1.2 }}
                className="font-serif-display italic text-3xl"
                style={{ color: "#5E1119" }}
              >
                {active.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1.4 }}
                className="font-serif-display text-lg sm:text-xl leading-relaxed mt-7"
                style={{ color: "#2C1810" }}
              >
                {active.body}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 1.2 }}
                className="mt-10 flex justify-end font-script text-3xl"
                style={{ color: "#8A1E2A" }}
              >
                — yours, quietly
              </motion.div>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); setActive(null); }}
              type="button"
              data-testid="unsent-modal-close"
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
