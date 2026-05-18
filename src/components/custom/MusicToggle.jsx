import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { initAudio, setMuted, isMuted } from "../../lib/audio";

export default function MusicToggle() {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    initAudio();
    setMutedState(isMuted());
  }, []);

  const handleClick = () => {
    const next = !muted;
    setMuted(next ? false : true)  // if next=true (was muted, now unmute), pass false
    // Actually invert correctly:
  };

  // Cleaner toggle:
  const toggle = () => {
    const nextMuted = !muted;        // new desired state
    setMuted(nextMuted);             // tell audio system
    setMutedState(nextMuted);        // update UI
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-testid="music-toggle-btn"
      aria-label={muted ? "Play music" : "Pause music"}
      className="fixed top-5 right-5 z-[9999] h-11 w-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 hover:scale-105"
      style={{
        background: "rgba(15, 15, 16, 0.55)",
        border: "1px solid rgba(212, 180, 131, 0.35)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 18px rgba(212,180,131,0.15)",
        color: "#D4B483",
      }}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
