import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import "@/App.css";

import Landing from "./components/sections/Landing";
import EnvelopeOpening from "./components/sections/EnvelopeOpening";
import WelcomeLetter from "./components/sections/WelcomeLetter";
import Timeline from "./components/sections/Timeline";
import PolaroidWall from "./components/sections/PolaroidWall";
import VideoMemory from "./components/sections/VideoMemory";
import SecretMessages from "./components/sections/SecretMessages";
import FutureTogether from "./components/sections/FutureTogether";
import Ending from "./components/sections/Ending";
import MusicToggle from "./components/custom/MusicToggle";
import { initAudio, setMuted } from "./lib/audio";

const STAGES = {
  LANDING: "landing",
  OPENING: "opening",
  EXPERIENCE: "experience",
};

function App() {
  const [stage, setStage] = useState(STAGES.LANDING);
  const lenisRef = useRef(null);

  // Init Lenis smooth scroll only during EXPERIENCE stage
  useEffect(() => {
    if (stage !== STAGES.EXPERIENCE) return;
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Scroll to top of experience
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [stage]);

  const handleOpen = () => {
    // Try start ambient music on user gesture
    try {
      initAudio();
      setMuted(false);
    } catch (e) {
      /* ignore */
    }
    setStage(STAGES.OPENING);
  };

  const handleOpeningComplete = () => {
    setStage(STAGES.EXPERIENCE);
  };

  const handleReplay = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    setStage(STAGES.LANDING);
  };

  return (
    <div className="App relative">
      {/* Global cinematic overlays */}
      <div className="grain-overlay" />
      <div className="vignette" />

      <MusicToggle />

      <AnimatePresence mode="wait">
        {stage === STAGES.LANDING && (
          <Landing key="landing" onOpen={handleOpen} />
        )}
        {stage === STAGES.OPENING && (
          <EnvelopeOpening key="opening" onComplete={handleOpeningComplete} />
        )}
        {stage === STAGES.EXPERIENCE && (
          <main key="experience" data-testid="experience-root">
            <WelcomeLetter />
            <Timeline />
            <PolaroidWall />
            <VideoMemory />
            <SecretMessages />
            <FutureTogether />
            <Ending onReplay={handleReplay} />
          </main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
