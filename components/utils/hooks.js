"use client";
import React from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const matchMedia = window.matchMedia(query);

    const updateMatches = (e) => {
      setMatches(e.matches);
    };

    // Set the initial value
    setMatches(matchMedia.matches);

    // Add the listener
    matchMedia.addEventListener("change", updateMatches);

    // Clean up
    return () => {
      matchMedia.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

export const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
