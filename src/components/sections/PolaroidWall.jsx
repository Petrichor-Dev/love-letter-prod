import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { polaroids } from "../../lib/content";
import { playSfx } from "../../lib/audio";

export default function PolaroidWall() {
  const [active, setActive] = useState(null);

  // Random rotations - stable across renders
  const rotations = useMemo(
    () => polaroids.map(() => Math.random() * 14 - 7),
    []
  );

  return (
    <section
      id="memories"
      data-testid="polaroid-section"
      className="relative w-full py-28 px-4 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-16"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          little keepsakes
        </p>
        <h2
          className="font-serif-display text-5xl sm:text-6xl"
          style={{ color: "#F8F8F8" }}
        >
          Polaroid Memories
        </h2>
        <p
          className="mt-4 font-body text-sm tracking-[0.18em] uppercase"
          style={{ color: "#D8D8D8" }}
        >
          tap a photo to relive a moment
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 px-2">
        {polaroids.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            initial={{ opacity: 0, y: 40, rotate: rotations[i] }}
            whileInView={{ opacity: 1, y: 0, rotate: rotations[i] }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.0,
              delay: i * 0.08,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            whileHover={{ y: -10, rotate: 0, scale: 1.03 }}
            onClick={() => {
              playSfx("camera", 0.4);
              setActive(p);
            }}
            className="polaroid mx-auto cursor-romantic"
            style={{ width: "100%", maxWidth: 240 }}
            data-testid={`polaroid-${p.id}`}
          >
            <div
              className="overflow-hidden"
              style={{ width: "100%", aspectRatio: "1 / 1" }}
            >
              <img
                src={p.image}
                alt={p.caption}
                loading="lazy"
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.85) contrast(0.95)" }}
              />
            </div>
            <p
              className="font-script text-xl mt-3 text-center"
              style={{ color: "#3E2A1B" }}
            >
              {p.caption}
            </p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
            style={{ background: "rgba(15,15,16,0.85)", backdropFilter: "blur(14px)" }}
            onClick={() => setActive(null)}
            data-testid="polaroid-modal"
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="polaroid w-full max-w-md"
            >
              <div className="overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                <img
                  src={active.image}
                  alt={active.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              <p
                className="font-serif-display italic text-xl text-center mt-4"
                style={{ color: "#2C1810" }}
              >
                {active.caption}
              </p>
              <p
                className="font-body text-[10px] tracking-[0.4em] uppercase text-center mt-1"
                style={{ color: "#8A1E2A" }}
              >
                {active.date}
              </p>
            </motion.div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive(null);
              }}
              type="button"
              data-testid="polaroid-modal-close"
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
