import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { scrapbookItems } from "../../lib/content";

export default function DigitalScrapbook() {
  const [active, setActive] = useState(null);

  return (
    <section
      id="scrapbook"
      data-testid="scrapbook-section"
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
          our messy little drawer
        </p>
        <h2 className="font-serif-display text-5xl sm:text-6xl" style={{ color: "#F8F8F8" }}>
          Scrapbook Desk
        </h2>
        <p className="mt-3 font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: "#D8D8D8" }}>
          drag, rotate, remember — everything is movable
        </p>
      </motion.div>

      {/* The desk */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4 }}
        className="relative max-w-5xl mx-auto"
        style={{
          aspectRatio: "16 / 10",
          borderRadius: 12,
          background:
            "radial-gradient(ellipse at 30% 20%, #4a3221 0%, #2d1d11 60%, #1d1209 100%)",
          boxShadow:
            "inset 0 0 120px rgba(0,0,0,0.55), 0 50px 100px -20px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}
        data-testid="scrapbook-desk"
      >
        {/* Wood grain hint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,0.012) 14px 15px)",
          }}
        />
        {/* Warm spotlight */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -100,
            left: "20%",
            right: "20%",
            height: "70%",
            background:
              "radial-gradient(ellipse at center, rgba(212,180,131,0.22), transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {scrapbookItems.map((it) => (
          <ScrapItem
            key={it.id}
            item={it}
            onOpen={() => setActive(it)}
          />
        ))}

        {/* Tiny hint */}
        <p
          className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-[9px] tracking-[0.4em] uppercase pointer-events-none"
          style={{ color: "rgba(212,180,131,0.5)" }}
        >
          ↟ click to read · drag to rearrange ↟
        </p>
      </motion.div>

      {/* Item modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setActive(null)}
            data-testid="scrapbook-modal"
            className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
            style={{ background: "rgba(15,15,16,0.85)", backdropFilter: "blur(14px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="paper-texture max-w-md w-full px-8 py-10"
              style={{ borderRadius: 6, boxShadow: "0 50px 100px -20px rgba(0,0,0,0.8)" }}
            >
              <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "#8A1E2A" }}>
                — from the desk —
              </p>
              <ScrapBody item={active} />
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); setActive(null); }}
              type="button"
              data-testid="scrapbook-modal-close"
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

function ScrapItem({ item, onOpen }) {
  const baseStyle = {
    position: "absolute",
    left: `${item.x}%`,
    top: `${item.y}%`,
    transform: `rotate(${item.rot}deg)`,
    cursor: "grab",
    willChange: "transform",
  };

  const common = {
    drag: true,
    dragMomentum: false,
    dragElastic: 0.18,
    whileHover: { scale: 1.04, rotate: 0, zIndex: 50 },
    whileTap: { cursor: "grabbing", scale: 1.02 },
    onClick: (e) => {
      // only open when click without drag (small movement)
      onOpen();
    },
    "data-testid": `scrap-${item.id}`,
  };

  if (item.type === "polaroid") {
    return (
      <motion.div {...common} style={{ ...baseStyle }}>
        <div className="polaroid" style={{ width: 160 }}>
          <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
            <img src={item.img} alt={item.caption} loading="lazy" className="w-full h-full object-cover" />
          </div>
          <p className="font-script text-base mt-2 text-center" style={{ color: "#3E2A1B" }}>
            {item.caption}
          </p>
        </div>
      </motion.div>
    );
  }

  if (item.type === "note") {
    return (
      <motion.div {...common} style={{ ...baseStyle }}>
        <div
          className="paper-texture px-5 py-5 font-script text-xl"
          style={{
            width: 200,
            background: item.color,
            color: "#5E1119",
            borderRadius: 3,
            boxShadow: "0 14px 30px -10px rgba(0,0,0,0.55)",
          }}
        >
          {item.text}
        </div>
      </motion.div>
    );
  }

  if (item.type === "ticket") {
    return (
      <motion.div {...common} style={{ ...baseStyle }}>
        <div
          className="px-5 py-4 font-body"
          style={{
            width: 230,
            background: "#F5E9DC",
            color: "#2C1810",
            borderRadius: 4,
            borderLeft: "3px dashed #8A1E2A",
            boxShadow: "0 16px 32px -12px rgba(0,0,0,0.55)",
          }}
        >
          <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "#8A1E2A" }}>
            {item.label}
          </p>
          <p className="font-serif-display italic text-base mt-2">{item.subtitle}</p>
        </div>
      </motion.div>
    );
  }

  // doodle
  return (
    <motion.div {...common} style={{ ...baseStyle }}>
      <div
        className="font-script text-3xl px-4 py-2"
        style={{ color: "#D4B483", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
      >
        {item.label}
      </div>
    </motion.div>
  );
}

function ScrapBody({ item }) {
  if (item.type === "polaroid") {
    return (
      <>
        <div className="polaroid w-full">
          <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
            <img src={item.img} alt={item.caption} className="w-full h-full object-cover" />
          </div>
        </div>
        <p className="font-script text-3xl text-center mt-4" style={{ color: "#5E1119" }}>{item.caption}</p>
      </>
    );
  }
  if (item.type === "note") {
    return (
      <p className="font-serif-display italic text-2xl leading-relaxed text-center" style={{ color: "#2C1810" }}>
        {item.text}
      </p>
    );
  }
  if (item.type === "ticket") {
    return (
      <>
        <p className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "#8A1E2A" }}>{item.label}</p>
        <p className="font-serif-display italic text-2xl mt-3" style={{ color: "#2C1810" }}>{item.subtitle}</p>
        <p className="font-body text-sm mt-4 leading-relaxed" style={{ color: "#3E2A1B" }}>
          some day, the in-between will be over. I keep this ticket here, like a quiet promise.
        </p>
      </>
    );
  }
  return (
    <p className="font-script text-4xl text-center" style={{ color: "#8A1E2A" }}>{item.label}</p>
  );
}
