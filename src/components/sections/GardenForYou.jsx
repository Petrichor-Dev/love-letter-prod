import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { X } from "lucide-react";
import { gardenFlowers, gardenTree, gardenBench, couple } from "../../lib/content";

/**
 * Section 20 — The Garden I'd Build For You
 * Single-viewport (100vh) cinematic parallax garden.
 * 5 layers (sky / trees / fog / midground (Tree of Memories) / foreground flowers)
 * translate at different speeds via useScroll → useTransform as the section moves
 * through the viewport — simulating a slow night-walk through a moonlit garden.
 */
export default function GardenForYou() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 1 });

  // Per-layer translations (slow = sky, fast = foreground). Section is 1 viewport tall;
  // useScroll progress goes 0→1 as section moves from bottom of viewport to fully past top.
  const skyY        = useTransform(p, [0, 1], ["0%",  "-8%"]);
  const treesY      = useTransform(p, [0, 1], ["0%",  "-16%"]);
  const midY        = useTransform(p, [0, 1], ["0%",  "-22%"]);
  const foreY       = useTransform(p, [0, 1], ["0%",  "-32%"]);
  const fogY        = useTransform(p, [0, 1], ["0%",  "-10%"]);
  const titleOpacity= useTransform(p, [0.15, 0.35, 0.7, 0.85], [0, 1, 1, 0]);
  // Tree glow intensifies as user reaches middle of section
  const treeGlow    = useTransform(p, [0.2, 0.5, 0.85], [0.5, 1, 0.85]);
  const treeScale   = useTransform(p, [0.2, 0.6], [0.94, 1.0]);
  const benchOp     = useTransform(p, [0.25, 0.45, 0.85], [0, 1, 1]);

  const [activeFlower, setActiveFlower] = useState(null);
  const [showBench, setShowBench] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="garden"
      data-testid="garden-section"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: "#06070d" }}
    >
      {/* Single-viewport cinematic stage (no sticky — Lenis-safe) */}
      <div className="relative w-full h-full overflow-hidden">
        {/* ---------- LAYER 4 — SKY & MOON ---------- */}
        <motion.div
          style={{ y: skyY }}
          className="absolute inset-0 pointer-events-none"
          data-testid="garden-layer-sky"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 72% 18%, rgba(120, 100, 180, 0.65) 0%, rgba(48, 36, 78, 0.85) 35%, rgba(20, 14, 36, 0.95) 65%, #0a0814 100%)",
            }}
          />
          {/* Moon */}
          <div
            className="absolute"
            style={{
              right: "16%",
              top: "10%",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 38% 36%, #FFF7E0 0%, #F5E9DC 35%, #D4B483 70%, transparent 85%)",
              boxShadow:
                "0 0 60px rgba(245,233,220,0.45), 0 0 120px rgba(212,180,131,0.3)",
              filter: "blur(0.3px)",
            }}
          />
          {/* Stars */}
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.r,
                height: s.r,
                background: "white",
                opacity: s.o,
                animation: `gTwinkle 5s ease-in-out ${(i % 9) * 0.4}s infinite`,
              }}
            />
          ))}
        </motion.div>

        {/* ---------- LAYER 3 — BACKGROUND TREES ---------- */}
        <motion.div
          style={{ y: treesY }}
          className="absolute inset-0 pointer-events-none"
          data-testid="garden-layer-trees"
        >
          <svg
            viewBox="0 0 1440 900"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMax slice"
          >
            {/* Distant hills */}
            <path
              d="M0 720 C 220 660 360 700 540 680 C 740 660 880 720 1080 700 C 1260 685 1340 720 1440 705 L 1440 900 L 0 900 Z"
              fill="rgba(20, 15, 30, 0.85)"
            />
            {/* Tree silhouettes */}
            {TREE_SILHOUETTES.map((t, i) => (
              <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`} opacity={t.o}>
                <rect x="-4" y="60" width="8" height="60" fill="rgba(8,6,14,0.95)" />
                <ellipse cx="0" cy="40" rx="42" ry="48" fill="rgba(14,10,22,0.97)" />
                <ellipse cx="-22" cy="55" rx="28" ry="30" fill="rgba(14,10,22,0.92)" />
                <ellipse cx="22" cy="58" rx="26" ry="28" fill="rgba(14,10,22,0.92)" />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* ---------- FOG (atmospheric drift) ---------- */}
        <motion.div
          style={{ y: fogY }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute left-0 right-0"
            style={{
              top: "58%",
              height: "30%",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(180, 160, 200, 0.18) 0%, transparent 70%)",
              filter: "blur(30px)",
              animation: "gFogDrift 24s ease-in-out infinite alternate",
            }}
          />
        </motion.div>

        {/* ---------- LAYER 2 — MIDGROUND: TREE OF MEMORIES + PATH ---------- */}
        <motion.div
          style={{ y: midY }}
          className="absolute inset-0"
          data-testid="garden-layer-mid"
        >
          {/* Cinematic warm glow under the tree */}
          <motion.div
            style={{ opacity: treeGlow }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            transition={{ duration: 2 }}
            // glow positioned where tree sits
          >
            <div
              style={{
                position: "absolute",
                left: "-260px",
                top: "120px",
                width: 520,
                height: 520,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255, 196, 130, 0.45) 0%, rgba(212, 180, 131, 0.18) 35%, transparent 70%)",
                filter: "blur(28px)",
              }}
            />
          </motion.div>

          {/* The Tree of Memories - centered */}
          <motion.div
            style={{ scale: treeScale }}
            className="absolute left-1/2 -translate-x-1/2"
            data-testid="garden-tree"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
            // Position from top so it sits in lower middle
            // We use a translate via margin
            // (absolute + left-1/2 centers it)
            // top set via Tailwind below
          >
            <div style={{ marginTop: 140 }}>
              <TreeOfMemories
                initials={`${couple.initials.left} ♡ ${couple.initials.right}`}
                subline={gardenTree.subline}
                memories={gardenTree.memories}
              />
            </div>
          </motion.div>

          {/* Glowing path lights along the bottom */}
          <div className="absolute left-0 right-0 bottom-[12%] flex justify-around px-10 pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background:
                    "radial-gradient(circle, #F5E9DC 0%, #D4B483 50%, transparent 70%)",
                  boxShadow: "0 0 12px rgba(245,233,220,0.7), 0 0 28px rgba(212,180,131,0.4)",
                  opacity: 0.7,
                  animation: `gPathPulse 4s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Hidden bench beneath the tree (rendered OUTSIDE parallax layers so it stays in viewport) */}
        <motion.button
          type="button"
          data-testid="garden-bench"
          onClick={() => setShowBench(true)}
          style={{ opacity: benchOp, bottom: "10%" }}
          className="absolute left-1/2 -translate-x-1/2 z-[5]"
        >
          <div className="flex flex-col items-center">
            <BenchSVG />
            <p
              className="font-script text-base mt-3 text-center"
              style={{ color: "rgba(212,180,131,0.85)" }}
            >
              {gardenBench.hint}
            </p>
          </div>
        </motion.button>

        {/* ---------- LAYER 1 — FOREGROUND FLOWERS ---------- */}
        <motion.div
          style={{ y: foreY }}
          className="absolute inset-0"
          data-testid="garden-layer-foreground"
        >
          {gardenFlowers.map((f, i) => (
            <motion.button
              key={f.id}
              type="button"
              data-testid={`garden-flower-${f.id}`}
              onClick={() => setActiveFlower(f)}
              initial={{ opacity: 0, y: 30, scale: 0.7 }}
              whileInView={{ opacity: 1, y: 0, scale: f.scale }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 1.6,
                delay: 0.4 + i * 0.18,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              whileHover={{ scale: f.scale * 1.12, y: -8 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                filter: f.layer === 0 ? "drop-shadow(0 14px 22px rgba(0,0,0,0.55))" : "drop-shadow(0 8px 14px rgba(0,0,0,0.4))",
              }}
            >
              <FlowerSVG type={f.type} size={f.layer === 0 ? 130 : 80} />
              {/* Label tag on hover */}
              <p
                className="absolute left-1/2 -translate-x-1/2 font-body text-[9px] tracking-[0.35em] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  bottom: -22,
                  color: "#F5E9DC",
                  textShadow: "0 1px 3px rgba(0,0,0,0.85)",
                }}
              >
                · {f.meaning} ·
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* ---------- LAYER 0 — FLOATING PARTICLES (fireflies + petals) ---------- */}
        <Fireflies />
        <FallingPetals />

        {/* Title overlay (fades in/out with scroll progress) */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute inset-x-0 top-0 z-20 pt-12 sm:pt-16 text-center px-6 pointer-events-none"
        >
          <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
            a quiet little world
          </p>
          <h2
            className="font-serif-display text-5xl sm:text-6xl"
            style={{ color: "#F8F8F8", letterSpacing: "0.01em" }}
          >
            The Garden I’d Build For You
          </h2>
          <p
            className="mt-4 font-body text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "#D8D8D8" }}
          >
            walk slowly · every flower is a feeling
          </p>
        </motion.div>

        {/* Local keyframes */}
        <style>{`
          @keyframes gTwinkle { 0%,100%{opacity:.2} 50%{opacity:.95} }
          @keyframes gFogDrift { 0%{transform:translateX(-4%)} 100%{transform:translateX(6%)} }
          @keyframes gPathPulse {
            0%, 100% { opacity: 0.45; transform: scale(0.95); }
            50%      { opacity: 1;    transform: scale(1.15); }
          }
          @keyframes gFireflyFloat {
            0%   { transform: translate(0, 0) scale(1);   opacity: 0.2; }
            25%  { transform: translate(8px, -14px) scale(1.4); opacity: 1; }
            50%  { transform: translate(-6px, -28px) scale(0.9); opacity: 0.7; }
            75%  { transform: translate(10px, -40px) scale(1.2); opacity: 1; }
            100% { transform: translate(0, -54px) scale(0.85); opacity: 0; }
          }
          @keyframes gPetalDrift {
            0%   { transform: translate(0, -20px) rotate(0deg); opacity: 0; }
            10%  { opacity: 0.9; }
            100% { transform: translate(var(--driftX, 80px), 120vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
      </div>

      {/* ===== FLOWER MODAL ===== */}
      <AnimatePresence>
        {activeFlower && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setActiveFlower(null)}
            data-testid="garden-flower-modal"
            className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
            style={{
              background: "rgba(6,7,13,0.86)",
              backdropFilter: "blur(18px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full text-center px-8 py-10"
              style={{
                borderRadius: 14,
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(212,180,131,0.16), transparent 65%), rgba(15,15,16,0.9)",
                border: "1px solid rgba(212,180,131,0.3)",
              }}
            >
              <div className="mx-auto mb-4">
                <FlowerSVG type={activeFlower.type} size={110} />
              </div>
              <p
                className="font-body text-[10px] tracking-[0.45em] uppercase"
                style={{ color: "#D4B483" }}
              >
                {activeFlower.meaning}
              </p>
              <p
                className="font-serif-display italic text-2xl sm:text-3xl mt-4 leading-snug"
                style={{ color: "#F5E9DC" }}
              >
                “{activeFlower.message}”
              </p>
            </motion.div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveFlower(null); }}
              data-testid="garden-flower-modal-close"
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

      {/* ===== BENCH MODAL ===== */}
      <AnimatePresence>
        {showBench && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setShowBench(false)}
            data-testid="garden-bench-modal"
            className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
            style={{
              background: "rgba(6,7,13,0.92)",
              backdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full text-center px-8 py-12"
            >
              <BenchSVG large />
              <div className="mt-8 space-y-3">
                {gardenBench.body.map((l, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.7, duration: 1.4 }}
                    className="font-serif-display italic text-xl sm:text-2xl"
                    style={{ color: "#F5E9DC" }}
                  >
                    {l}
                  </motion.p>
                ))}
              </div>
            </motion.div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowBench(false); }}
              data-testid="garden-bench-modal-close"
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

/* ============================================================== */
/*                       SUBCOMPONENTS                            */
/* ============================================================== */

function TreeOfMemories({ initials, subline, memories }) {
  return (
    <div
      className="relative"
      style={{ width: 460, height: 520 }}
      data-testid="garden-tree-memories"
    >
      <svg viewBox="0 0 460 520" width="460" height="520" style={{ overflow: "visible" }}>
        {/* Glowing trunk */}
        <defs>
          <radialGradient id="treeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD9A0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFD9A0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#3a2b1f" />
            <stop offset="100%" stopColor="#1a120c" />
          </linearGradient>
        </defs>

        {/* Aura */}
        <circle cx="230" cy="200" r="200" fill="url(#treeGlow)" />

        {/* Trunk */}
        <path
          d="M222 520 Q220 400 226 320 Q224 270 230 230"
          stroke="url(#trunk)"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        {/* Roots hint */}
        <path d="M180 510 Q210 500 222 510" stroke="#1a120c" strokeWidth="6" fill="none" opacity="0.85" />
        <path d="M280 510 Q250 500 232 510" stroke="#1a120c" strokeWidth="6" fill="none" opacity="0.85" />

        {/* Branches */}
        {BRANCHES.map((b, i) => (
          <path
            key={i}
            d={b}
            stroke="#3a2b1f"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
        ))}

        {/* Canopy soft cloud */}
        <ellipse cx="230" cy="180" rx="170" ry="130" fill="rgba(20,16,30,0.55)" />
        <ellipse cx="180" cy="200" rx="120" ry="90"   fill="rgba(20,16,30,0.5)"  />
        <ellipse cx="290" cy="200" rx="120" ry="90"   fill="rgba(20,16,30,0.5)"  />

        {/* Hanging memory orbs */}
        {MEMORY_HANG.map((h, i) => (
          <g key={i}>
            <line x1={h.x} y1={h.fromY} x2={h.x} y2={h.toY} stroke="rgba(212,180,131,0.35)" strokeWidth="0.6" />
            <circle cx={h.x} cy={h.toY} r="6"
              fill="#F5E9DC"
              style={{
                filter: "drop-shadow(0 0 8px rgba(245,233,220,0.95)) drop-shadow(0 0 16px rgba(212,180,131,0.6))",
              }}
            />
          </g>
        ))}

        {/* Tiny ambient stars near canopy */}
        {[[160,110,1.2],[260,90,1],[320,140,1.4],[200,160,1],[280,170,1.2],[150,200,1]].map(([cx,cy,r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity="0.7" />
        ))}
      </svg>

      {/* Memory labels positioned over the orbs */}
      {MEMORY_HANG.map((h, i) => (
        <span
          key={i}
          className="absolute font-script whitespace-nowrap"
          style={{
            left: h.x,
            top: h.toY + (h.labelOffset || 10),
            transform: "translateX(-50%)",
            fontSize: 13,
            color: "rgba(245,233,220,0.9)",
            textShadow: "0 1px 3px rgba(0,0,0,0.95)",
            opacity: 0.9,
          }}
        >
          {memories[i % memories.length]}
        </span>
      ))}

      {/* Carved initials at the base of trunk */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center"
        style={{ top: 360 }}
      >
        <div
          className="font-serif-display"
          style={{
            fontSize: 24,
            color: "#F5E9DC",
            letterSpacing: "0.06em",
            textShadow: "0 0 12px rgba(245,233,220,0.65), 0 2px 4px rgba(0,0,0,0.9)",
          }}
        >
          {initials}
        </div>
        <div
          className="font-script mt-1"
          style={{
            fontSize: 22,
            color: "#D4B483",
            textShadow: "0 0 10px rgba(212,180,131,0.5)",
          }}
        >
          {subline}
        </div>
      </div>
    </div>
  );
}

function BenchSVG({ large = false }) {
  const w = large ? 280 : 160;
  const h = large ? 110 : 64;
  return (
    <svg
      width={w} height={h}
      viewBox="0 0 280 110"
      style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.6))" }}
    >
      {/* seat */}
      <rect x="22" y="46" width="236" height="10" rx="3" fill="#2d1f15" />
      <rect x="22" y="60" width="236" height="6"  rx="2" fill="#1f160e" />
      {/* legs */}
      <rect x="36" y="66" width="10" height="40" fill="#1f160e" />
      <rect x="234" y="66" width="10" height="40" fill="#1f160e" />
      {/* back */}
      <rect x="36" y="14" width="208" height="6" rx="2" fill="#2d1f15" />
      <rect x="36" y="24" width="208" height="6" rx="2" fill="#2d1f15" />
      <rect x="36" y="14" width="6" height="32" fill="#1f160e" />
      <rect x="238" y="14" width="6" height="32" fill="#1f160e" />
      {/* lantern glow under seat */}
      <ellipse cx="140" cy="106" rx="110" ry="6" fill="rgba(212,180,131,0.18)" />
    </svg>
  );
}

function FlowerSVG({ type, size = 80 }) {
  const props = { width: size, height: size, viewBox: "0 0 100 100" };
  if (type === "rose") {
    return (
      <svg {...props}>
        {/* stem */}
        <path d="M50 96 Q52 78 50 60" stroke="#3b5a2c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50 78 Q40 72 35 64" stroke="#4a7c34" strokeWidth="1.5" fill="none" />
        {/* layered petals */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse key={deg} cx="50" cy="40" rx="12" ry="18" fill="#8A1E2A" transform={`rotate(${deg} 50 50)`} opacity="0.95" />
        ))}
        {[30, 90, 150, 210, 270, 330].map((deg) => (
          <ellipse key={deg} cx="50" cy="44" rx="8" ry="12" fill="#A8243A" transform={`rotate(${deg} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="6" fill="#5E1119" />
        <circle cx="48" cy="48" r="2" fill="#F5E9DC" opacity="0.5" />
      </svg>
    );
  }
  if (type === "sunflower") {
    return (
      <svg {...props}>
        <path d="M50 96 Q50 80 50 60" stroke="#3b5a2c" strokeWidth="2" fill="none" />
        {Array.from({ length: 16 }).map((_, i) => {
          const deg = (360 / 16) * i;
          return <ellipse key={i} cx="50" cy="30" rx="6" ry="14" fill="#E8B045" transform={`rotate(${deg} 50 50)`} />;
        })}
        <circle cx="50" cy="50" r="11" fill="#5C3A12" />
        <circle cx="50" cy="50" r="6"  fill="#7A4B1A" />
      </svg>
    );
  }
  if (type === "lavender") {
    return (
      <svg {...props}>
        <path d="M50 96 Q50 70 50 40" stroke="#4a7c34" strokeWidth="2" fill="none" />
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 22 + i * 4;
          return <circle key={i} cx="50" cy={y} r={3.6 - i * 0.18} fill="#8E73C9" opacity={0.95 - i * 0.05} />;
        })}
        <circle cx="50" cy="18" r="3" fill="#A38FD8" />
      </svg>
    );
  }
  if (type === "lily") {
    return (
      <svg {...props}>
        <path d="M50 96 Q50 76 50 56" stroke="#3b5a2c" strokeWidth="2" fill="none" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="50" cy="36" rx="9" ry="20" fill="#F5E9DC" transform={`rotate(${deg} 50 50)`} opacity="0.95" />
        ))}
        <circle cx="50" cy="50" r="4" fill="#E8B045" />
        {/* stamen specks */}
        {[42, 50, 58].map((x) => <circle key={x} cx={x} cy="46" r="1.4" fill="#8A1E2A" />)}
      </svg>
    );
  }
  if (type === "babys") {
    return (
      <svg {...props}>
        <path d="M50 96 Q50 70 50 50" stroke="#4a7c34" strokeWidth="1.5" fill="none" />
        {[[40,30],[60,28],[34,46],[66,46],[50,22],[44,58],[58,58]].map(([x,y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill="#F8F8F8" opacity="0.95" />
            <circle cx={x} cy={y} r="1.4" fill="#F5E9DC" />
          </g>
        ))}
      </svg>
    );
  }
  // tulip
  return (
    <svg {...props}>
      <path d="M50 96 Q50 72 50 52" stroke="#3b5a2c" strokeWidth="2" fill="none" />
      <path
        d="M50 26 C40 26 32 40 34 56 C40 50 46 50 50 56 C54 50 60 50 66 56 C68 40 60 26 50 26 Z"
        fill="#B83A4A"
      />
      <path d="M50 30 C46 30 42 40 44 54 C47 50 50 50 50 56 Z" fill="#8A1E2A" opacity="0.7" />
      <path d="M34 64 Q42 70 50 64 Q58 70 66 64" stroke="#4a7c34" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/**
 * Floating fireflies — cheap CSS animation, 18 instances.
 */
function Fireflies() {
  const flies = React.useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 30 + Math.random() * 65,
        delay: Math.random() * 8,
        duration: 7 + Math.random() * 7,
        color: Math.random() < 0.65 ? "#FFE6A8" : "#F5E9DC",
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {flies.map((f) => (
        <span
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: 3,
            height: 3,
            background: f.color,
            boxShadow: `0 0 8px ${f.color}, 0 0 18px ${f.color}99`,
            animation: `gFireflyFloat ${f.duration}s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Drifting petals (organic).
 */
function FallingPetals() {
  const petals = React.useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 16 + Math.random() * 14,
        drift: (Math.random() * 160 - 80).toFixed(0) + "px",
        color: ["#8A1E2A", "#B83A4A", "#D4B483", "#F5E9DC"][i % 4],
        size: 4 + Math.random() * 5,
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: "-30px",
            width: p.size * 1.6,
            height: p.size,
            background: p.color,
            opacity: 0.85,
            borderRadius: "60% 40% 60% 40% / 60% 60% 40% 40%",
            "--driftX": p.drift,
            animation: `gPetalDrift ${p.duration}s linear ${p.delay}s infinite`,
            filter: "blur(0.3px)",
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================== */
/*                         STATIC DATA                            */
/* ============================================================== */

const STARS = Array.from({ length: 90 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 60,
  r: 1 + Math.random() * 1.6,
  o: 0.3 + Math.random() * 0.6,
}));

const TREE_SILHOUETTES = [
  { x: 120,  y: 660, s: 1.4, o: 0.95 },
  { x: 280,  y: 680, s: 1.1, o: 0.9  },
  { x: 1180, y: 670, s: 1.3, o: 0.95 },
  { x: 1340, y: 690, s: 1.0, o: 0.85 },
  { x: 60,   y: 690, s: 0.85,o: 0.8  },
  { x: 1410, y: 695, s: 0.85,o: 0.8  },
];

const BRANCHES = [
  "M230 240 Q200 200 170 180",
  "M230 240 Q260 200 295 180",
  "M230 230 Q210 190 175 160",
  "M230 230 Q252 190 280 160",
  "M230 220 Q220 180 200 150",
  "M230 220 Q244 184 268 152",
];

const MEMORY_HANG = [
  { x: 152, fromY: 184, toY: 232, labelOffset: 10 },
  { x: 200, fromY: 168, toY: 218, labelOffset: 38 },
  { x: 260, fromY: 168, toY: 222, labelOffset: 12 },
  { x: 308, fromY: 184, toY: 250, labelOffset: 36 },
  { x: 130, fromY: 220, toY: 280, labelOffset: 10 },
  { x: 332, fromY: 220, toY: 282, labelOffset: 32 },
];

