import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particles from "../custom/Particles";
import { distancePoints } from "../../lib/content";

// Haversine distance in km
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}

// Convert lat/lon to a sensible map coord (0..100 percent within our Asia-ish viewport)
// Map window covers roughly: lon 90..115, lat 8 ... -10
function project(p) {
  const x = ((p.lon - 90) / (115 - 90)) * 100;
  const y = ((8 - p.lat) / (8 - -10)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(4, Math.min(96, y)) };
}

function useLocalTime(tz) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  });
}

export default function DistanceBetweenUs() {
  const { me, her } = distancePoints;
  const km = haversineKm(me, her);
  const a = project(me);
  const b = project(her);
  const meTime = useLocalTime(me.tz);
  const herTime = useLocalTime(her.tz);

  return (
    <section
      id="distance"
      data-testid="distance-section"
      className="relative w-full py-28 px-4 sm:px-8 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(40, 22, 58, 0.45) 0%, rgba(10, 8, 18, 0.95) 70%, #07060c 100%)",
        }}
      />
      <Particles count={28} opacity={0.55} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4 }}
        className="text-center mb-12 relative z-10"
      >
        <p className="font-script text-3xl mb-3" style={{ color: "#D4B483" }}>
          the space between
        </p>
        <h2 className="font-serif-display text-5xl sm:text-6xl" style={{ color: "#F8F8F8" }}>
          The Distance Between Us
        </h2>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6 }}
        className="relative max-w-5xl mx-auto"
        style={{
          aspectRatio: "16 / 9",
          borderRadius: 16,
          background:
            "radial-gradient(ellipse at center, rgba(30, 26, 48, 0.7) 0%, rgba(8, 6, 14, 0.95) 75%)",
          border: "1px solid rgba(212,180,131,0.1)",
          boxShadow: "0 60px 120px -30px rgba(0,0,0,0.85), inset 0 0 100px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
        data-testid="distance-map"
      >
        {/* Faint background stars */}
        {Array.from({ length: 50 }).map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const o = 0.15 + Math.random() * 0.5;
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: 1.5,
                height: 1.5,
                background: "white",
                opacity: o,
                animation: `twinkle 4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          );
        })}

        {/* Faint grid (lat/lon hints) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[20, 40, 60, 80].map((p) => (
            <line key={`v${p}`} x1={p} y1="0" x2={p} y2="100" stroke="rgba(212,180,131,0.06)" strokeWidth="0.1" />
          ))}
          {[20, 40, 60, 80].map((p) => (
            <line key={`h${p}`} x1="0" y1={p} x2="100" y2={p} stroke="rgba(212,180,131,0.06)" strokeWidth="0.1" />
          ))}

          {/* Animated connection arc */}
          <motion.path
            d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 18} ${b.x} ${b.y}`}
            stroke="url(#distanceGradient)"
            strokeWidth="0.35"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 3.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="distanceGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4B483" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#F5E9DC" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#B83A4A" stopOpacity="0.85" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulsing endpoints */}
        <Endpoint x={a.x} y={a.y} color={me.color} testId="distance-point-me" />
        <Endpoint x={b.x} y={b.y} color={her.color} testId="distance-point-her" />

        {/* City labels */}
        <CityLabel x={a.x} y={a.y} city={me.city} region={me.region} time={meTime} align="left" />
        <CityLabel x={b.x} y={b.y} city={her.city} region={her.region} time={herTime} align="right" />

        <style>{`
          @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:.9} }
          @keyframes heartbeatPulse {
            0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.85; }
            22%  { transform: translate(-50%, -50%) scale(1.35); opacity: 1;    }
            33%  { transform: translate(-50%, -50%) scale(1.05); opacity: 0.85; }
            55%  { transform: translate(-50%, -50%) scale(1.6);  opacity: 0.95; }
            70%  { transform: translate(-50%, -50%) scale(1.0);  opacity: 0.85; }
            100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.85; }
          }
          @keyframes ringExpand {
            0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(3.4); opacity: 0; }
          }
        `}</style>
      </motion.div>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, delay: 0.4 }}
        className="text-center mt-12 relative z-10"
        data-testid="distance-counter"
      >
        <p
          className="font-serif-display text-5xl sm:text-6xl"
          style={{ color: "#F5E9DC", letterSpacing: "0.02em" }}
        >
          {km.toLocaleString()} <span className="text-3xl sm:text-4xl" style={{ color: "#D4B483" }}>KM</span>
        </p>
        <p className="font-script text-2xl mt-2" style={{ color: "#D4B483" }}>
          apart — but somehow still close.
        </p>
        <div className="mt-6 flex justify-center gap-6 sm:gap-12 font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "rgba(212,180,131,0.7)" }}>
          <span>· {me.city} {meTime} ·</span>
          <span>· {her.city} {herTime} ·</span>
        </div>
      </motion.div>
    </section>
  );
}

function Endpoint({ x, y, color, testId }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }} data-testid={testId}>
      {/* Expanding ring */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: 22,
          height: 22,
          background: "transparent",
          border: `1px solid ${color}`,
          animation: "ringExpand 2.6s ease-out infinite",
        }}
      />
      {/* Core dot */}
      <span
        className="absolute rounded-full"
        style={{
          left: 0,
          top: 0,
          width: 14,
          height: 14,
          background: `radial-gradient(circle, #F8F8F8 0%, ${color} 70%)`,
          boxShadow: `0 0 18px ${color}, 0 0 38px ${color}55`,
          animation: "heartbeatPulse 2.2s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function CityLabel({ x, y, city, region, time, align }) {
  const offsetX = align === "left" ? -10 : 10;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `calc(${x}% + ${offsetX}px)`,
        top: `calc(${y}% + 20px)`,
        transform: align === "left" ? "translateX(-100%)" : "translateX(0)",
        textAlign: align,
      }}
    >
      <p className="font-serif-display text-base sm:text-lg" style={{ color: "#F5E9DC" }}>
        {city}
      </p>
      <p className="font-body text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(212,180,131,0.75)" }}>
        {region} · {time}
      </p>
    </div>
  );
}
