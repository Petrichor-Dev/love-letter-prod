import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { secretMessages } from "../../lib/content";
import { playSfx } from "../../lib/audio";

export default function SecretMessages() {
  const [active, setActive] = useState(null);

  return (
    <section
      id="secrets"
      data-testid="secret-messages-section"
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
          only for you
        </p>
        <h2
          className="font-serif-display text-5xl sm:text-6xl"
          style={{ color: "#F8F8F8" }}
        >
          Open When…
        </h2>
        <p
          className="mt-4 font-body text-sm tracking-[0.18em] uppercase"
          style={{ color: "#D8D8D8" }}
        >
          small letters, hidden for the right moment
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {secretMessages.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: i * 0.1 }}
            whileHover={{ y: -6, scale: 1.015 }}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setActive(s);
              playSfx("paper", 0.4);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActive(s);
              }
            }}
            data-testid={`secret-card-${s.id}`}
            className="relative text-left p-8 sm:p-10 group overflow-hidden cursor-pointer"
            style={{
              borderRadius: 6,
              background:
                "linear-gradient(135deg, rgba(245, 233, 220, 0.06) 0%, rgba(245, 233, 220, 0.03) 100%)",
              border: "1px solid rgba(212, 180, 131, 0.22)",
              backdropFilter: "blur(6px)",
              transition: "all 500ms ease",
            }}
          >
            {/* Top corner stamp */}
            <div
              className="absolute top-4 right-4 font-body text-[9px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(212,180,131,0.55)" }}
            >
              · sealed ·
            </div>

            <div
              className="w-12 h-12 rounded-full mb-6 flex items-center justify-center font-serif-display text-xl"
              style={{
                background: "rgba(138, 30, 42, 0.85)",
                color: "#F5E9DC",
                boxShadow:
                  "0 4px 12px rgba(138,30,42,0.4), inset 0 -3px 6px rgba(0,0,0,0.3)",
              }}
            >
              ♡
            </div>

            <p className="font-serif-display italic text-2xl sm:text-3xl leading-tight" style={{ color: "#F5E9DC" }}>
              {s.label}
            </p>

            <p
              className="mt-6 font-body text-[10px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(212,180,131,0.7)" }}
            >
              — tap to unseal
            </p>
          </motion.div>
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
            style={{ background: "rgba(15,15,16,0.88)", backdropFilter: "blur(16px)" }}
            onClick={() => setActive(null)}
            data-testid="secret-modal"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="paper-texture relative max-w-xl w-full px-8 sm:px-12 py-12"
              style={{
                borderRadius: 4,
                boxShadow: "0 50px 100px -20px rgba(0,0,0,0.8)",
              }}
            >
              <p
                className="font-body text-[10px] tracking-[0.4em] uppercase mb-6"
                style={{ color: "#8A1E2A" }}
              >
                — a small letter —
              </p>
              <h3
                className="font-serif-display italic text-3xl mb-6"
                style={{ color: "#5E1119" }}
              >
                {active.title}
              </h3>
              <p
                className="font-serif-display text-lg sm:text-xl leading-relaxed"
                style={{ color: "#2C1810" }}
              >
                {active.body}
              </p>
              <div
                className="mt-10 flex justify-end font-script text-3xl"
                style={{ color: "#8A1E2A" }}
              >
                — Isan
              </div>
            </motion.div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive(null);
              }}
              type="button"
              data-testid="secret-modal-close"
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
