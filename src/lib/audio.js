import { Howl } from "howler";

// Lightweight audio manager.
// Audio is OPTIONAL by design — UI must continue to work even if no audio loads.
// We keep ambient + SFX as silent no-ops by default to avoid 403/CORS noise.
// To enable: drop self-hosted .mp3 files into /public/audio/ and set ENABLE_AUDIO=true.

const ENABLE_AUDIO = false;

const SOURCES = {
  ambient: ["/audio/ambient-piano.mp3"],
  paper: ["/audio/paper.mp3"],
  wax: ["/audio/wax-crack.mp3"],
  camera: ["/audio/camera-click.mp3"],
};

let ambient = null;
let muted = true;

export function initAudio() {
  if (!ENABLE_AUDIO) return null;
  if (ambient) return ambient;
  try {
    ambient = new Howl({
      src: SOURCES.ambient,
      loop: true,
      volume: 0,
      html5: true,
      preload: true,
      onloaderror: () => { ambient = null; },
      onplayerror: () => {},
    });
  } catch (e) {
    ambient = null;
  }
  return ambient;
}

export function setMuted(value) {
  muted = value;
  if (!ENABLE_AUDIO) return;
  const a = initAudio();
  if (!a) return;
  try {
    if (muted) {
      a.fade(a.volume(), 0, 800);
      setTimeout(() => { try { a.pause(); } catch (e) {} }, 850);
    } else {
      if (!a.playing()) a.play();
      a.fade(a.volume(), 0.35, 1400);
    }
  } catch (e) {}
}

export function isMuted() {
  return muted;
}

export function playSfx(name, volume = 0.5) {
  if (!ENABLE_AUDIO || muted) return;
  try {
    const src = SOURCES[name];
    if (!src) return;
    const s = new Howl({
      src,
      volume,
      html5: true,
      onloaderror: () => {},
      onplayerror: () => {},
    });
    s.play();
  } catch (e) {}
}
