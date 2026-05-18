import React, { useMemo } from "react";

/**
 * Floating dust particles overlay (cinematic ambience).
 * Lightweight CSS-only — no canvas, no heavy libs.
 */
export default function Particles({ count = 28, opacity = 0.6, className = "" }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 1 + Math.random() * 3.5;
        return {
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 8,
          duration: 6 + Math.random() * 8,
          size,
          opacity: 0.25 + Math.random() * 0.55,
        };
      }),
    [count]
  );

  return (
    <div
      aria-hidden="true"
      data-testid="particles-layer"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
