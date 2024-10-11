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
  const [isPortrait, setIsPortrait] = useState(false);
  const [isOpenTrackDrawer, setIsOpenTrackDrawer] = useState(false);
  const [isOpenRotateDeviceDrawer, setIsOpenRotateDeviceDrawer] =
    useState(false);

  const checkOrientation = useCallback(() => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  }, []);

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
        setIsOpenTrackDrawer((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const value = useMemo(
    () => ({
      isOpenTrackDrawer,
      isOpenRotateDeviceDrawer,
      isPortrait,
      setIsOpenTrackDrawer,
      setIsOpenRotateDeviceDrawer,
    }),
    [isOpenTrackDrawer, isOpenRotateDeviceDrawer, isPortrait]
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
