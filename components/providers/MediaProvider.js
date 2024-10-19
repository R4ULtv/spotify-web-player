"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useMediaQuery } from "@/components/utils/hooks";

const MediaContext = createContext();

const FULLSCREEN_METHODS = {
  enter: [
    "requestFullscreen",
    "webkitRequestFullscreen",
    "msRequestFullscreen",
  ],
  exit: ["exitFullscreen", "webkitExitFullscreen", "msExitFullscreen"],
};

export const MediaProvider = ({ children }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isOpenTrackDrawer, setIsOpenTrackDrawer] = useState(false);
  const [selectedDrawerTab, setSelectedDrawerTab] = useState(0);
  const [isOpenRotateDeviceDrawer, setIsOpenRotateDeviceDrawer] =
    useState(false);
  const [tvMode, setTvMode] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  // Load TV mode setting from localStorage on initial render
  useEffect(() => {
    const storedTvMode = localStorage.getItem("tvMode");
    if (storedTvMode) {
      setTvMode((prev) => storedTvMode === "true");
    }
  }, []);

  useEffect(() => {
    console.log(isMobile, isPortrait);
    if (isMobile && !isPortrait) {
      setTvMode(true);
      localStorage.setItem("tvMode", "true");
    }
  }, [isMobile, isPortrait]);

  // Toggle TV mode on/off and save to localStorage
  const toggleTvMode = useCallback(() => {
    setTvMode((prev) => {
      const newTvMode = !prev;
      localStorage.setItem("tvMode", newTvMode);
      return newTvMode;
    });
  }, []);

  const checkOrientation = useCallback(() => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  }, []);

  const toggleFullScreen = useCallback(() => {
    const html = document.documentElement;
    const doc = document;

    const toggleFullScreenMode = (isEntering) => {
      const methodList = FULLSCREEN_METHODS[isEntering ? "enter" : "exit"];
      const element = isEntering ? html : doc;

      for (const method of methodList) {
        if (element[method]) {
          element[method]();
          break;
        }
      }
    };

    toggleFullScreenMode(!fullScreen);
    setFullScreen((prev) => !prev);
  }, [fullScreen]);

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, [checkOrientation]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;

      switch (e.key.toLowerCase()) {
        case "t":
          e.preventDefault();
          toggleTvMode();
          break;
        case "p":
          e.preventDefault();
          if (!isOpenTrackDrawer || selectedDrawerTab !== 1) {
            setIsOpenTrackDrawer(true);
            setSelectedDrawerTab(1);
          } else {
            setIsOpenTrackDrawer(false);
          }
          break;
        case "q":
          e.preventDefault();
          if (!isOpenTrackDrawer || selectedDrawerTab !== 0) {
            setIsOpenTrackDrawer(true);
            setSelectedDrawerTab(0);
          } else {
            setIsOpenTrackDrawer(false);
          }
          break;
        case "f":
        case "f11":
          e.preventDefault();
          toggleFullScreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleFullScreen, toggleTvMode, isOpenTrackDrawer, selectedDrawerTab]);

  const value = useMemo(
    () => ({
      isOpenTrackDrawer,
      isOpenRotateDeviceDrawer,
      isPortrait,
      fullScreen,
      selectedDrawerTab,
      setSelectedDrawerTab,
      tvMode,
      toggleTvMode,
      toggleFullScreen,
      setIsOpenTrackDrawer,
      setIsOpenRotateDeviceDrawer,
    }),
    [
      isOpenTrackDrawer,
      isOpenRotateDeviceDrawer,
      isPortrait,
      fullScreen,
      selectedDrawerTab,
      toggleFullScreen,
      tvMode,
      toggleTvMode,
    ],
  );

  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
