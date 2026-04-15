"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/thema.mp3";
/** HTMLMediaElement.volume is 0–1; 0.1 === 10% (quiet ambience) */
const VOLUME = 0.1;
const SESSION_KEY = "aurora-bg-music-paused";

export function SiteBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [paused, setPaused] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  });

  const syncPaused = useCallback((next: boolean) => {
    setPaused(next);
    try {
      window.sessionStorage.setItem(SESSION_KEY, next ? "1" : "0");
    } catch {
      /* private mode */
    }
  }, []);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = Math.min(1, Math.max(0, VOLUME));
    audio.loop = true;

    let removed = false;

    const tryPlay = async () => {
      if (removed || paused) return;
      try {
        await audio.play();
      } catch {
        /* autoplay policy — wait for gesture */
      }
    };

    const onGesture = () => {
      void tryPlay();
    };

    void tryPlay();
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);

    return () => {
      removed = true;
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [paused]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(1, Math.max(0, VOLUME));
    if (paused) {
      syncPaused(false);
      void audio.play();
    } else {
      audio.pause();
      syncPaused(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
      <button
        type="button"
        onClick={toggle}
        className="fixed z-[9999] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/90 shadow-lg backdrop-blur-md transition-[background-color,transform] hover:bg-black/70 active:scale-95 print:hidden max-[380px]:bottom-3 max-[380px]:right-3 bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]"
        aria-pressed={!paused}
        aria-label={paused ? "Play background music" : "Pause background music"}
        title={paused ? "Play music" : "Pause music"}
      >
        {paused ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </button>
    </>
  );
}
