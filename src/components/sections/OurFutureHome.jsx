import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { futureHomeSpots } from "../../lib/content";

export default function OurFutureHome() {
  const [active, setActive] = useState(null);

  return (
    <section
      id="future-home"
      data-testid="future-home-section"
      className="relative w-full py-28 px-4 sm:px-8 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-12 relative z-10"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          a place we will call ours
        </p>
        <h2 className="font-serif-display text-5xl sm:text-6xl" style={{ color: "#F8F8F8" }}>
          Our Future Home
        </h2>
        <p
          className="mt-4 font-body text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "#D8D8D8" }}
        >
          tap anything you see — every corner is a dream
        </p>
      </motion.div>

      {/* The cozy room */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative max-w-5xl mx-auto"
        style={{
          aspectRatio: "16 / 10",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow:
            "0 60px 120px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,180,131,0.15), 0 0 60px rgba(212,180,131,0.10)",
        }}
        data-testid="future-home-scene"
      >
        {/* Cozy apartment image */}
        <img
          src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=70"
          alt="our future home"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.55) saturate(1.05) contrast(0.96)" }}
        />
        {/* Warm light overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 60% 35%, rgba(255, 196, 130, 0.30) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(138, 30, 42, 0.18) 0%, transparent 50%), linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Subtle rain hint on right edge */}
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-20"
          style={{ width: "22%", background: "linear-gradient(90deg, transparent, rgba(180, 200, 230, 0.18))" }}
        />

        {/* Hotspots */}
        {futureHomeSpots.map((spot, i) => (
          <motion.button
            key={spot.id}
            type="button"
            data-testid={`home-spot-${spot.id}`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.4 + i * 0.15 }}
            whileHover={{ scale: 1.25 }}
            onClick={() => setActive(spot)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            aria-label={spot.label}
          >
            <span className="relative flex items-center justify-center">
              <span
                className="absolute rounded-full"
                style={{
                  width: 30, height: 30,
                  border: "1px solid rgba(245,233,220,0.6)",
                  animation: `homePulse 2.6s ease-out ${i * 0.2}s infinite`,
                }}
              />
              <span
                className="rounded-full"
                style={{
                  width: 12, height: 12,
                  background: "radial-gradient(circle, #F5E9DC 0%, #D4B483 60%, transparent 100%)",
                  boxShadow: "0 0 14px rgba(245,233,220,0.85), 0 0 32px rgba(212,180,131,0.5)",
                }}
              />
              <span
                className="absolute font-body text-[9px] tracking-[0.3em] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  top: 22,
                  color: "#F5E9DC",
                  textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                }}
              >
                {spot.label}
              </span>
            </span>
          </motion.button>
        ))}

        <style>{`
          @keyframes homePulse {
            0%   { transform: scale(0.85); opacity: 0.85; }
            100% { transform: scale(2.4);  opacity: 0; }
          }
        `}</style>
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setActive(null)}
            data-testid="home-modal"
            className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
            style={{ background: "rgba(15,12,10,0.88)", backdropFilter: "blur(16px)" }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="paper-texture max-w-md w-full px-8 py-10 relative"
              style={{ borderRadius: 6, boxShadow: "0 50px 100px -20px rgba(0,0,0,0.85)" }}
            >
              <p
                className="font-body text-[10px] tracking-[0.4em] uppercase mb-3"
                style={{ color: "#8A1E2A" }}
              >
                — a corner of us —
              </p>
              <h3
                className="font-serif-display italic text-3xl mb-5"
                style={{ color: "#5E1119" }}
              >
                {active.title}
              </h3>
              <p
                className="font-serif-display text-lg leading-relaxed"
                style={{ color: "#2C1810" }}
              >
                {active.body}
              </p>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); setActive(null); }}
              type="button"
              data-testid="home-modal-close"
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
