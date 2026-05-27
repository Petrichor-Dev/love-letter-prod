import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";

const QUIET_QUOTE = "If this moment could last forever,\nI think I'd be okay with that.";

export default function UnderSameStars() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 1 });

  // Detect mobile to reduce parallax intensity and keep couple grounded
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsMobile(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  // Parallax (slow = sky, fast = sand). Reduced on mobile to keep couple stable.
  const skyY    = useTransform(p, [0, 1], ["0%",  isMobile ? "-3%"  : "-6%"]);
  const moonY   = useTransform(p, [0, 1], ["0%",  isMobile ? "-5%"  : "-10%"]);
  const oceanY  = useTransform(p, [0, 1], ["0%",  isMobile ? "-7%"  : "-14%"]);
  const coupleY = useTransform(p, [0, 1], ["0%",  isMobile ? "-4%"  : "-10%"]);
  const sandY   = useTransform(p, [0, 1], ["0%",  isMobile ? "-8%"  : "-18%"]);

  // Title fades in/out as section moves
  const titleOpacity = useTransform(p, [0.15, 0.32, 0.7, 0.88], [0, 1, 1, 0]);

  // Shooting star + quote — fires periodically while section is visible
  const [shooting, setShooting] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const inViewRef = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { inViewRef.current = e.isIntersecting; },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    const loop = async () => {
      while (alive) {
        await wait(7000 + Math.random() * 5000);
        if (!alive || !inViewRef.current) continue;
        setShooting(true);
        setShowQuote(true);
        await wait(1800);
        setShooting(false);
        await wait(6000);
        setShowQuote(false);
      }
    };
    loop();
    return () => { alive = false; };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="same-stars"
      data-testid="same-stars-section"
      className="relative w-full overflow-hidden"
      style={{
        height: "100vh",
        background:
          "linear-gradient(180deg, #04060c 0%, #060a14 50%, #0a1020 100%)",
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* ===== LAYER 5 — DEEP SKY + STARS ===== */}
        <motion.div
          style={{ y: skyY }}
          className="absolute inset-0 pointer-events-none"
          data-testid="ss-layer-sky"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 90%, rgba(20, 38, 70, 0.55) 0%, rgba(4, 6, 12, 0.95) 60%), radial-gradient(ellipse at 70% 22%, rgba(70, 90, 140, 0.35) 0%, transparent 50%)",
            }}
          />
          {/* Static stars */}
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
                filter: s.r > 1.6 ? "blur(0.3px)" : "none",
                animation: `ssTwinkle ${4 + (i % 6)}s ease-in-out ${i * 0.18}s infinite`,
                boxShadow: s.r > 1.8 ? "0 0 6px rgba(255,255,255,0.8)" : "none",
              }}
            />
          ))}
          {/* Constellation hint lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {CONSTELLATION.map(([a, b], i) => (
              <line
                key={i}
                x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                stroke="rgba(180, 210, 255, 0.18)"
                strokeWidth="0.06"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </motion.div>

        {/* ===== LAYER 4 — MOON + SUBTLE FOG ===== */}
        <motion.div
          style={{ y: moonY }}
          className="absolute inset-0 pointer-events-none"
          data-testid="ss-layer-moon"
        >
          {/* Soft moon halo */}
          <div
            className="absolute"
            style={{
              left: "62%",
              top: "16%",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(220, 230, 255, 0.22) 0%, rgba(180, 200, 240, 0.08) 30%, transparent 65%)",
              filter: "blur(20px)",
            }}
          />
          {/* Moon */}
          <div
            className="absolute"
            style={{
              left: "62%",
              top: "16%",
              transform: "translate(60px, 60px)",
              width: 110,
              height: 110,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 38% 36%, #F5F1E0 0%, #D7D2C0 55%, #8E8978 85%, transparent 95%)",
              boxShadow:
                "0 0 60px rgba(220,225,240,0.55), 0 0 120px rgba(150,170,210,0.3)",
              filter: "blur(0.2px)",
            }}
          />
          {/* Drifting sea mist */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: "62%",
              height: "16%",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(120, 150, 200, 0.18) 0%, transparent 70%)",
              filter: "blur(28px)",
              animation: "ssFogDrift 30s ease-in-out infinite alternate",
            }}
          />
        </motion.div>

        {/* ===== LAYER 3 — OCEAN + MOON REFLECTION ===== */}
        <motion.div
          style={{ y: oceanY }}
          className="absolute inset-0 pointer-events-none"
          data-testid="ss-layer-ocean"
        >
          {/* Ocean — mobile: 42%-65%  desktop: 56%-78% */}
          <div
            className="absolute left-0 right-0 top-[42%] sm:top-[56%] h-[23%] sm:h-[22%]"
            style={{
              background:
                "linear-gradient(180deg, #0d1830 0%, #08101d 60%, #060c18 100%)",
              boxShadow: "inset 0 18px 40px rgba(0,0,0,0.5)",
            }}
          />
          {/* Horizon line glow */}
          <div
            className="absolute left-0 right-0 top-[42%] sm:top-[56%]"
            style={{
              height: 2,
              background:
                "linear-gradient(90deg, transparent 5%, rgba(200, 220, 255, 0.35) 30%, rgba(220, 230, 255, 0.55) 50%, rgba(200, 220, 255, 0.35) 70%, transparent 95%)",
              filter: "blur(0.5px)",
            }}
          />
          {/* Moon reflection on water */}
          <div
            className="absolute left-[58%] sm:left-[62%] top-[45%] sm:top-[58%]"
            style={{
              width: 200,
              height: 100,
              transform: "translateX(-30px)",
              background:
                "radial-gradient(ellipse at center, rgba(230, 235, 250, 0.4) 0%, rgba(180, 200, 240, 0.15) 35%, transparent 70%)",
              filter: "blur(8px)",
              animation: "ssReflectShimmer 7s ease-in-out infinite",
            }}
          />
          {/* Wave streaks (slow) */}
          {WAVES.map((w, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${w.x}%`,
                top: `${44 + (w.y - 62) * 0.65}%`,
                width: w.l * 0.7,
                height: 1.2,
                background:
                  "linear-gradient(90deg, transparent, rgba(200, 220, 255, 0.4), transparent)",
                animation: `ssWaveDrift ${10 + (i % 4) * 2}s linear ${i * 0.7}s infinite`,
                opacity: 0.7,
              }}
            />
          ))}
        </motion.div>

        {/* ===== LAYER 2 — COUPLE SILHOUETTES (from behind) =====
            Anchored to bottom so they always sit on the sand:
              Mobile: bottom 14% (sits within dry sand)
              Desktop: bottom 10% */}
        <motion.div
          style={{ y: coupleY }}
          className="absolute inset-x-0 bottom-[14%] sm:bottom-[10%] flex justify-center pointer-events-none z-[6]"
          data-testid="ss-couple"
        >
          <div className="relative">
            {/* Contact shadow under couple (grounds them to the sand) */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: -6,
                width: "82%",
                height: 18,
                background:
                  "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 55%, transparent 80%)",
                filter: "blur(6px)",
              }}
            />
            <CoupleSilhouette />
          </div>
        </motion.div>

        {/* Footprints overlay rendered ABOVE sand but BELOW couple. (Footprints stay inside sand layer.) */}

        {/* ===== LAYER 1 — SAND + FOOTPRINTS + SHELLS + FOAM =====
            Mobile: sand fills bottom 35% (65%–100%) so couple sits clearly on shore
            Desktop: sand fills bottom 22% (78%–100%) */}
        <motion.div
          style={{ y: sandY }}
          className="absolute inset-0 pointer-events-none"
          data-testid="ss-layer-sand"
        >
          {/* Shoreline blend — gradient that smoothly connects ocean (top) to wet sand (bottom). */}
          <div
            className="absolute left-0 right-0 top-[63%] sm:top-[76%] h-[5%] sm:h-[4%]"
            style={{
              background:
                "linear-gradient(180deg, rgba(13, 24, 48, 0) 0%, rgba(18, 28, 46, 0.95) 50%, rgba(28, 32, 46, 1) 100%)",
            }}
          />
          {/* Foam line (right at water-meets-sand) */}
          <div
            className="absolute left-0 right-0 top-[65%] sm:top-[77%]"
            style={{
              height: 2,
              background:
                "linear-gradient(90deg, transparent, rgba(220, 235, 255, 0.6), rgba(245, 248, 255, 0.85), rgba(220, 235, 255, 0.6), transparent)",
              filter: "blur(0.6px)",
              animation: "ssFoamPulse 5s ease-in-out infinite",
            }}
          />
          {/* Soft secondary foam below */}
          <div
            className="absolute left-0 right-0 top-[67%] sm:top-[78%]"
            style={{
              height: 1.5,
              background:
                "linear-gradient(90deg, transparent 15%, rgba(220, 235, 255, 0.4) 50%, transparent 85%)",
              filter: "blur(1.2px)",
              opacity: 0.7,
            }}
          />
          {/* Wet sand band — bridges shoreline to dry sand */}
          <div
            className="absolute left-0 right-0 top-[67%] sm:top-[78%] h-[6%] sm:h-[5%]"
            style={{
              background:
                "linear-gradient(180deg, rgba(28, 32, 46, 1) 0%, rgba(32, 34, 48, 1) 50%, rgba(34, 36, 50, 1) 100%)",
              boxShadow:
                "inset 0 2px 6px rgba(180, 200, 240, 0.10), inset 0 -2px 6px rgba(0,0,0,0.4)",
            }}
          />
          {/* Dry sand — anchored to bottom of viewport */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[27%] sm:h-[18%]"
            style={{
              background:
                "linear-gradient(180deg, rgba(34, 36, 50, 1) 0%, rgba(24, 24, 34, 1) 100%)",
            }}
          />
          {/* Sand grain texture overlay */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[27%] sm:h-[18%] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(180, 190, 215, 0.06) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              opacity: 0.7,
            }}
          />
          {/* Footprints — sit in dry sand area */}
          <Footprints />
          {/* Tiny shells */}
          {SHELLS.map((s, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${s.x}%`,
                bottom: `${s.b}%`,
                width: s.r,
                height: s.r * 0.7,
                background:
                  "radial-gradient(ellipse at 30% 30%, rgba(220, 215, 200, 0.75), rgba(140, 135, 120, 0.3))",
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                opacity: 0.85,
                transform: `rotate(${s.rot}deg)`,
              }}
            />
          ))}
        </motion.div>

        {/* ===== DRIFTING SEA-MIST PARTICLES (LAYER 0) ===== */}
        <SeaMist />

        {/* ===== SHOOTING STAR ===== */}
        <AnimatePresence>
          {shooting && (
            <motion.div
              key="shoot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 pointer-events-none"
              data-testid="ss-shooting-star"
            >
              <span
                className="absolute"
                style={{
                  left: "10%",
                  top: "12%",
                  width: 180,
                  height: 2,
                  background:
                    "linear-gradient(90deg, transparent, rgba(245, 245, 255, 0.95), rgba(220, 230, 255, 0.4), transparent)",
                  transform: "rotate(18deg)",
                  filter: "blur(0.6px)",
                  animation: "ssShoot 1.6s ease-out forwards",
                  boxShadow: "0 0 12px rgba(245,245,255,0.7)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== TITLE ===== */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute inset-x-0 top-0 z-20 pt-12 sm:pt-16 text-center px-6 pointer-events-none"
        >
          {/* <p className="font-script text-3xl mb-3" style={{ color: "rgba(212,180,131,0.85)" }}>
            tonight, just for us
          </p> */}
          <h2
            className="font-serif-display text-5xl sm:text-6xl"
            style={{ color: "#F5E9DC", letterSpacing: "0.01em" }}
          >
            Under The Same Stars
          </h2>
          <p
            className="mt-3 font-body text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "rgba(220, 225, 240, 0.65)" }}
          >
            913 km apart · one sky · one heartbeat
          </p>
        </motion.div>

        {/* ===== QUIET QUOTE (only when shooting star passes) ===== */}
        {/* <AnimatePresence>
          {showQuote && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.95, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
              data-testid="ss-quiet-quote"
              className="absolute inset-x-0 z-10 px-6 text-center pointer-events-none top-[44%] sm:top-[30%]"
            >
              {QUIET_QUOTE.split("\n").map((line, i) => (
                <p
                  key={i}
                  className="font-serif-display italic text-lg sm:text-2xl"
                  style={{
                    color: "rgba(245, 245, 255, 0.92)",
                    textShadow: "0 1px 6px rgba(0, 0, 0, 0.9)",
                  }}
                >
                  {line}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Local keyframes */}
        <style>{`
          @keyframes ssTwinkle    { 0%,100%{opacity:.25} 50%{opacity:.95} }
          @keyframes ssFogDrift   { 0%{transform:translateX(-4%)} 100%{transform:translateX(6%)} }
          @keyframes ssReflectShimmer {
            0%,100% { opacity: 0.85; transform: translateX(-30px) scaleX(1); }
            50%     { opacity: 1;    transform: translateX(-30px) scaleX(1.08); }
          }
          @keyframes ssWaveDrift  {
            0%   { transform: translateX(-30px); opacity: 0;   }
            20%  { opacity: 0.7; }
            100% { transform: translateX(80px);  opacity: 0;   }
          }
          @keyframes ssFoamPulse  {
            0%,100% { opacity: 0.8; transform: scaleY(1); }
            50%     { opacity: 1;   transform: scaleY(1.4); }
          }
          @keyframes ssShoot {
            0%   { transform: translate(0, 0) rotate(18deg); opacity: 0; }
            10%  { opacity: 1; }
            100% { transform: translate(900px, 280px) rotate(18deg); opacity: 0; }
          }
          @keyframes ssMistDrift {
            0%   { transform: translate(0, 0);   opacity: 0; }
            20%  { opacity: 0.6; }
            100% { transform: translate(var(--mx), -40px); opacity: 0; }
          }
          @keyframes ssBreathe {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-1.5px); }
          }
          @keyframes ssHairSway {
            0%, 100% { transform: rotate(-1deg) translateX(-0.4px); }
            50%      { transform: rotate( 1deg) translateX( 0.4px); }
          }
          @keyframes ssFootprintFade {
            0%, 100% { opacity: 0.85; }
            50%      { opacity: 0.55; }
          }
        `}</style>
      </div>
    </section>
  );
}

/* ============================================================== */
/*                       SUBCOMPONENTS                            */
/* ============================================================== */

function CoupleSilhouette() {
  return (
    <div
      className="relative w-[200px] sm:w-[280px] md:w-[320px]"
      style={{ aspectRatio: "320 / 200" }}
      data-testid="ss-couple-svg"
    >
      <svg
        viewBox="0 0 320 200"
        width="100%"
        height="100%"
        style={{
          overflow: "visible",
          filter:
            "drop-shadow(0 6px 14px rgba(0,0,0,0.65)) drop-shadow(-12px 0 18px rgba(180, 200, 240, 0.12))",
        }}
      >
        <defs>
          <linearGradient id="silBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0d121e" />
            <stop offset="100%" stopColor="#04060c" />
          </linearGradient>
          {/* Subtle moonlight rim — from the right (moon is upper-right of scene) */}
          <linearGradient id="silRim" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%"  stopColor="rgba(220, 232, 255, 0.55)" />
            <stop offset="22%" stopColor="rgba(220, 232, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Shared blanket / hoodie pooling around them */}
        <path
          d="M50 198 C 80 165 110 158 160 158 C 210 158 240 165 270 198 Z"
          fill="#080a14"
          opacity="0.95"
        />

        {/* === LEFT figure (broader shoulders) — sitting === */}
        <g style={{ animation: "ssBreathe 5.5s ease-in-out infinite" }}>
          {/* Shoulders */}
          <path
            d="M70 198 C 78 152 105 132 130 130 C 150 130 158 158 158 198 Z"
            fill="url(#silBody)"
          />
          {/* Head */}
          <ellipse cx="116" cy="112" rx="22" ry="26" fill="#06080f" />
          {/* Hair (short, slightly tousled) */}
          <path
            d="M94 110 C 96 92 108 84 118 84 C 130 84 140 92 140 110 C 134 100 124 100 116 102 C 108 100 102 100 94 110 Z"
            fill="#04060a"
          />
          {/* Rim light */}
          <path
            d="M134 96 C 138 104 138 116 134 122 L 132 122 C 134 114 134 104 132 96 Z"
            fill="url(#silRim)"
            opacity="0.75"
          />
        </g>

        {/* === RIGHT figure (slightly smaller, leaning into left) === */}
        <g
          style={{
            transformOrigin: "188px 198px",
            animation: "ssBreathe 6.5s ease-in-out 0.4s infinite",
          }}
        >
          {/* Shoulders */}
          <path
            d="M170 198 C 174 158 182 138 198 132 C 220 132 240 154 248 198 Z"
            fill="url(#silBody)"
          />
          {/* Head (tilted left — leaning on partner) */}
          <g transform="rotate(-12 200 122)">
            <ellipse cx="200" cy="120" rx="19" ry="23" fill="#06080f" />
            {/* Long flowing hair behind */}
            <g style={{ transformOrigin: "200px 130px", animation: "ssHairSway 7s ease-in-out infinite" }}>
              <path
                d="M182 116 C 178 110 178 100 188 96 C 200 92 214 96 220 110 C 224 130 220 156 214 174 C 208 162 200 154 192 152 C 186 150 180 138 182 116 Z"
                fill="#03050a"
              />
              {/* hair strand falling toward shoulder */}
              <path
                d="M214 152 C 218 162 220 174 218 190"
                stroke="#03050a"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.95"
              />
            </g>
            {/* Rim light */}
            <path
              d="M216 108 C 220 116 220 128 216 134 L 214 134 C 216 126 216 116 214 108 Z"
              fill="url(#silRim)"
              opacity="0.65"
            />
          </g>
        </g>

        {/* Connection — left figure's tilted shoulder reaches right figure */}
        <path
          d="M150 162 C 168 152 178 152 188 156"
          stroke="#04060a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Subtle warm spot at the base — implied small lantern/glow between them (optional) */}
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: -2,
          transform: "translateX(-50%)",
          width: 140,
          height: 12,
          background:
            "radial-gradient(ellipse at center, rgba(214, 178, 122, 0.22), transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}

function Footprints() {
  // Two pairs of small footprint indents in sand, partly under foam
  // Use SVG paths
  return (
    <svg
      className="absolute left-0 right-0"
      style={{ top: "84%", width: "100%", height: "10%" }}
      viewBox="0 0 1440 120"
      preserveAspectRatio="xMidYMid slice"
      data-testid="ss-footprints"
    >
      {FOOTPRINTS.map((f, i) => (
        <ellipse
          key={i}
          cx={f.x}
          cy={f.y}
          rx={f.rx}
          ry={f.ry}
          fill="rgba(8, 10, 18, 0.85)"
          opacity={0.6}
          transform={`rotate(${f.rot} ${f.x} ${f.y})`}
          style={{
            animation: `ssFootprintFade ${6 + (i % 3) * 2}s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
    </svg>
  );
}

function SeaMist() {
  const mists = React.useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 50 + Math.random() * 25,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 10,
        mx: ((Math.random() - 0.5) * 220).toFixed(0) + "px",
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {mists.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: 4,
            height: 4,
            background:
              "radial-gradient(circle, rgba(200, 220, 255, 0.55), transparent 70%)",
            filter: "blur(2px)",
            "--mx": m.mx,
            animation: `ssMistDrift ${m.duration}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ============================================================== */
/*                        STATIC DATA                             */
/* ============================================================== */

const STARS = Array.from({ length: 130 }).map((_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 55,
  r: 0.8 + Math.random() * 1.6,
  o: 0.35 + Math.random() * 0.55,
}));

// Constellation lines (in 0..100 viewBox) — three small "groups"
const CONSTELLATION = [
  [[14, 18], [22, 12]], [[22, 12], [28, 20]], [[28, 20], [18, 28]],
  [[78, 14], [84, 22]], [[84, 22], [78, 30]], [[78, 30], [70, 24]],
  [[44, 8],  [52, 14]], [[52, 14], [56, 6]],
];

const WAVES = Array.from({ length: 16 }).map((_, i) => ({
  x: (i * 8 + Math.random() * 6) % 100,
  y: 62 + Math.random() * 18,
  l: 40 + Math.random() * 80,
}));

const SHELLS = Array.from({ length: 8 }).map(() => ({
  x: Math.random() * 100,
  b: 2 + Math.random() * 6,
  r: 4 + Math.random() * 3,
  rot: Math.random() * 360,
}));

// Footprints — two pairs walking toward the couple (centered),
// partially fading where foam approaches
const FOOTPRINTS = [
  { x: 540, y: 70, rx: 7,  ry: 4, rot: -12 },
  { x: 580, y: 82, rx: 7,  ry: 4, rot: -12 },
  { x: 620, y: 64, rx: 7,  ry: 4, rot: -8  },
  { x: 660, y: 78, rx: 7,  ry: 4, rot: -8  },
  { x: 700, y: 58, rx: 6.5,ry: 3.8, rot: -4 },
  { x: 740, y: 72, rx: 6.5,ry: 3.8, rot: -4 },
  { x: 780, y: 54, rx: 6,  ry: 3.6, rot: 0  },
  { x: 820, y: 66, rx: 6,  ry: 3.6, rot: 0  },
];
