import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chatScript } from "../../lib/content";

export default function LateNightChat() {
  const [visible, setVisible] = useState(0); // how many messages shown
  const [typing, setTyping] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const startedRef = useRef(false);

  // Start when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          runScript();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runScript = async () => {
    for (let i = 0; i < chatScript.length; i++) {
      const msg = chatScript[i];
      // Show typing indicator for "me" replies briefly
      if (msg.from === "me") {
        setTyping(true);
        await wait(1100 + Math.random() * 500);
        setTyping(false);
      } else {
        await wait(700);
      }
      setVisible((v) => v + 1);
      // After each message, auto-scroll
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
      await wait(450);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="chat"
      data-testid="late-night-chat-section"
      className="relative w-full py-28 px-4 sm:px-8 overflow-hidden"
    >
      {/* Rainy night background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1493514789931-586cb221d7a7?auto=format&fit=crop&w=1800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(22px) brightness(0.35) saturate(1.1)",
          transform: "scale(1.1)",
          opacity: 0.6,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,15,16,0.6) 0%, rgba(15,15,16,0.85) 100%)",
        }}
      />
      {/* Subtle rain streaks */}
      <RainStreaks />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-12 relative z-10"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          late nights, only us
        </p>
        <h2
          className="font-serif-display text-5xl sm:text-6xl"
          style={{ color: "#F8F8F8" }}
        >
          02:17 AM
        </h2>
        <p
          className="mt-3 font-body text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "#D8D8D8" }}
        >
          rain. her name. and quiet hours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4 }}
        className="relative z-10 mx-auto w-full max-w-md"
        style={{
          borderRadius: 22,
          background: "rgba(20, 18, 22, 0.55)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(212, 180, 131, 0.18)",
          boxShadow:
            "0 50px 120px -30px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(212,180,131,0.12)" }}
        >
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-serif-display text-lg"
              style={{
                background: "linear-gradient(135deg, #8A1E2A, #5E1119)",
                color: "#F5E9DC",
              }}
            >
              I
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
              style={{
                background: "#6FCF97",
                boxShadow: "0 0 0 2px rgba(20,18,22,1)",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-serif-display text-base leading-tight"
              style={{ color: "#F5E9DC" }}
            >
              Ismi ♡
            </p>
            <p
              className="font-body text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(111, 207, 151, 0.85)" }}
            >
              online
            </p>
          </div>
          <span
            className="font-body text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(212,180,131,0.55)" }}
          >
            🌧 1.2°
          </span>
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          className="px-4 py-5 space-y-3 overflow-y-auto"
          style={{ maxHeight: 460 }}
          data-testid="chat-messages"
        >
          <AnimatePresence initial={false}>
            {chatScript.slice(0, visible).map((m, i) => (
              <MessageBubble key={i} msg={m} />
            ))}
            {typing && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </div>

        {/* Fake input bar */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(212,180,131,0.12)" }}
        >
          <div
            className="flex-1 px-4 py-2 rounded-full font-body text-xs"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(248,248,248,0.5)",
              border: "1px solid rgba(212,180,131,0.12)",
            }}
          >
            type something soft…
          </div>
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #8A1E2A, #5E1119)",
              color: "#F5E9DC",
            }}
          >
            ♡
          </span>
        </div>
      </motion.div>
    </section>
  );
}

function MessageBubble({ msg }) {
  if (msg.from === "system") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center py-2"
      >
        <p
          className="font-body text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(212,180,131,0.55)" }}
        >
          ☎ {msg.text} · {msg.time}
        </p>
      </motion.div>
    );
  }
  const isMe = msg.from === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[78%]">
        <div
          className="px-4 py-2.5 font-body text-[13px] leading-snug"
          style={{
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMe
              ? "linear-gradient(135deg, #8A1E2A 0%, #6B1622 100%)"
              : "rgba(245, 233, 220, 0.10)",
            color: isMe ? "#F5E9DC" : "#F5E9DC",
            border: isMe ? "none" : "1px solid rgba(212,180,131,0.15)",
            boxShadow: isMe
              ? "0 6px 20px rgba(138,30,42,0.35)"
              : "0 4px 14px rgba(0,0,0,0.3)",
          }}
        >
          {msg.text}
        </div>
        <p
          className={`mt-1 font-body text-[9px] tracking-[0.2em] uppercase ${
            isMe ? "text-right" : "text-left"
          }`}
          style={{ color: "rgba(212,180,131,0.45)" }}
        >
          {msg.time}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.4 }}
      className="flex justify-end"
      data-testid="chat-typing"
    >
      <div
        className="px-4 py-3 flex gap-1.5"
        style={{
          borderRadius: "18px 18px 4px 18px",
          background: "linear-gradient(135deg, #8A1E2A 0%, #6B1622 100%)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#F5E9DC",
              animation: `chatPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes chatPulse {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </motion.div>
  );
}

function RainStreaks() {
  const streaks = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 0.9 + Math.random() * 0.6,
    height: 50 + Math.random() * 60,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
      {streaks.map((s) => (
        <span
          key={s.id}
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: -80,
            width: 1,
            height: s.height,
            background:
              "linear-gradient(180deg, transparent, rgba(212,180,131,0.5))",
            animation: `rainFall ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes rainFall {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
