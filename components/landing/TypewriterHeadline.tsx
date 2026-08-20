"use client";

import { useState, useEffect } from "react";

const WORDS = [
  "engineers.",
  "builders.",
  "designers.",
  "tech leads.",
  "high performers.",
];

export function TypewriterHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) {
      const timeout = setTimeout(() => {
        setPause(false);
        setIsDeleting(true);
      }, 1600); // Time to read the completed word
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (subIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        return;
      }
      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev - 1);
      }, 45); // Deleting speed
      return () => clearTimeout(timeout);
    }

    // Typing
    const currentWord = WORDS[wordIndex];
    if (subIndex === currentWord.length) {
      setPause(true);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + 1);
    }, 90); // Typing speed

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, pause, wordIndex]);

  const currentText = WORDS[wordIndex].substring(0, subIndex);

  return (
    <span className="inline-block text-foreground font-black underline decoration-foreground/40 underline-offset-4 sm:underline-offset-8 transition-colors">
      <span>{currentText}</span>
      <span className="inline-block w-2.5 sm:w-3.5 h-8 sm:h-10 md:h-12 bg-foreground ml-1.5 translate-y-1 animate-pulse" />
    </span>
  );
}
