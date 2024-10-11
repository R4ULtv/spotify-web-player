"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

// Create a context for Media-related data and functions
const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isOpenTrackDrawer, setIsOpenTrackDrawer] = useState(false);
  const [isOpenRotateDeviceDrawer, setIsOpenRotateDeviceDrawer] =
    useState(false);

  const checkOrientation = useCallback(() => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  }, []);

  // Toggle fullscreen mode on/off
  const toggleFullScreen = useCallback(() => {
    let html = document.documentElement;

    function openFullscreen() {
      if (html.requestFullscreen) {
        html.requestFullscreen();
      } else if (html.webkitRequestFullscreen) {
        html.webkitRequestFullscreen();
      } else if (html.msRequestFullscreen) {
        html.msRequestFullscreen();
      }
    }

    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    if (fullScreen) {
      closeFullscreen();
    } else {
      openFullscreen();
    }
    setFullScreen((prev) => !prev);
  }, [fullScreen]);

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, [checkOrientation]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        e.key === "p" &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        setIsOpenTrackDrawer((prev) => !prev);
      }
      if (
        (e.key === "f" || e.key === "F11") &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        toggleFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleFullScreen, setIsOpenTrackDrawer]);

  const value = useMemo(
    () => ({
      isOpenTrackDrawer,
      isOpenRotateDeviceDrawer,
      isPortrait,
      fullScreen,
      toggleFullScreen,
      setIsOpenTrackDrawer,
      setIsOpenRotateDeviceDrawer,
    }),
    [isOpenTrackDrawer, isOpenRotateDeviceDrawer, isPortrait, fullScreen]
  );

  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

// Custom hook to access Media context
export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
