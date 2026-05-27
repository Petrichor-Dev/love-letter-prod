import React from "react";

/**
 * Reusable envelope SVG with wax seal and elegant initials.
 * Use `state`:
 *   - "closed"  : default
 *   - "opening" : flap rotates up, seal cracks
 *   - "open"    : letter slides out (handled by parent)
 */
export default function Envelope({
  state = "closed",
  initialLeft = "I",
  initialRight = "I",
  size = 360,
}) {
  const flapRotate = state === "closed" ? 0 : -178;
  const sealOpacity = state === "closed" ? 1 : 0;
  const sealCrack = state !== "closed";

  return (
    <div
      data-testid="envelope-svg"
      className="relative breathe"
      style={{
        width: size,
        height: size * 0.7,
        perspective: "1400px",
      }}
    >
      {/* Envelope body */}
      <div
        className="absolute inset-0 envelope-paper warm-glow"
        style={{
          borderRadius: 8,
          transform: "rotateX(2deg)",
        }}
      >
        {/* Inner cream lining */}
        <div
          className="absolute inset-2 paper-texture"
          style={{
            borderRadius: 6,
            opacity: 0.92,
          }}
        />

        {/* Bottom flap shadow detail */}
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: "55%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0.12) 100%)",
            borderRadius: "0 0 8px 8px",
            pointerEvents: "none",
          }}
        />

        {/* Side fold lines (V shape from bottom corners) */}
        <svg
          viewBox="0 0 360 252"
          width="100%"
          height="100%"
          className="absolute inset-0"
          preserveAspectRatio="none"
          style={{ pointerEvents: "none" }}
        >
          <line x1="0" y1="252" x2="180" y2="120" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
          <line x1="360" y1="252" x2="180" y2="120" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Top flap - rotates open */}
      <div
        className="absolute left-0 right-0 top-0 origin-top"
        style={{
          height: "55%",
          transform: `rotateX(${flapRotate}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 2200ms cubic-bezier(.22,.61,.36,1)",
          zIndex: state === "closed" ? 3 : 1,
        }}
      >
        <div
          className="w-full h-full envelope-paper"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            borderRadius: "8px 8px 0 0",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.18)",
          }}
        />
      </div>

      {/* Wax seal */}
      <div
        className={`absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 ${
          state === "closed" ? "seal-pulse" : ""
        }`}
        style={{
          width: size * 0.22,
          height: size * 0.22,
          opacity: sealOpacity,
          transition: "opacity 900ms ease 600ms, transform 1200ms cubic-bezier(.22,.61,.36,1)",
          transform: sealCrack
            ? "translate(-50%, -50%) scale(1.05) rotate(-6deg)"
            : "translate(-50%, -50%) scale(1)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <div className="wax-seal rounded-full w-full h-full flex items-center justify-center relative overflow-hidden">
          <span
            className="font-serif-display text-[#F5E9DC]"
            style={{
              fontSize: size * 0.07,
              letterSpacing: "0.04em",
              textShadow: "0 1px 2px rgba(0,0,0,0.45)",
            }}
          >
            {initialLeft}
            <span className="mx-1 text-[#F5E9DC]">♡</span>
            {initialRight}
          </span>
          {/* Crack line */}
          {sealCrack && (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0"
              style={{ opacity: 0.85 }}
            >
              <path
                d="M50 8 L46 35 L54 50 L42 70 L52 92"
                stroke="#2D0608"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
