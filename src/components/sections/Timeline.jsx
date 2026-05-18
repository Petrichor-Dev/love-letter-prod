import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { timelineMilestones } from "../../lib/content";

export default function Timeline() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section
      id="journey"
      data-testid="journey-section"
      className="relative w-full py-28 px-4 sm:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="text-center mb-20"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          chapters of us
        </p>
        <h2
          className="font-serif-display text-5xl sm:text-6xl"
          style={{ color: "#F8F8F8", letterSpacing: "0.01em" }}
        >
          Our Journey
        </h2>
        <div
          className="mx-auto mt-6 h-px w-24"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,180,131,0.7), transparent)",
          }}
        />
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Glowing vertical line */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(212,180,131,0.55) 12%, rgba(138,30,42,0.6) 50%, rgba(212,180,131,0.55) 88%, transparent)",
            boxShadow: "0 0 14px rgba(212,180,131,0.35)",
          }}
        />

        {timelineMilestones.map((m, i) => {
          const isLeft = i % 2 === 0;
          const isExpanded = expandedId === m.id;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
              className={`relative mb-16 md:mb-24 flex ${
                isLeft ? "md:justify-start" : "md:justify-end"
              }`}
              data-testid={`timeline-milestone-${m.id}`}
            >
              {/* Node dot */}
              <div
                className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 w-3 h-3 rounded-full"
                style={{
                  background: "#D4B483",
                  boxShadow:
                    "0 0 0 4px rgba(15,15,16,1), 0 0 16px rgba(212,180,131,0.7)",
                }}
              />

              {/* Card */}
              <motion.button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
                whileHover={{ y: -4 }}
                className="ml-14 md:ml-0 md:w-[44%] text-left rounded-md overflow-hidden"
                style={{
                  background: "rgba(23, 23, 23, 0.7)",
                  border: "1px solid rgba(212, 180, 131, 0.18)",
                  backdropFilter: "blur(6px)",
                  boxShadow:
                    "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: 220 }}
                >
                  <img
                    src={m.image}
                    alt={m.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ filter: "saturate(0.92) brightness(0.85)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 30%, rgba(15,15,16,0.85) 100%)",
                    }}
                  />
                </div>
                <div className="p-6">
                  <p
                    className="font-body text-[10px] tracking-[0.35em] uppercase mb-2"
                    style={{ color: "#D4B483" }}
                  >
                    {m.date}
                  </p>
                  <h3
                    className="font-serif-display text-2xl leading-snug mb-2"
                    style={{ color: "#F8F8F8" }}
                  >
                    {m.title}
                  </h3>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                        className="font-body text-sm leading-relaxed overflow-hidden mt-2"
                        style={{ color: "#D8D8D8" }}
                      >
                        {m.description}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <span
                    className="inline-block mt-3 font-body text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(212,180,131,0.7)" }}
                  >
                    {isExpanded ? "— close" : "— tap to remember"}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
