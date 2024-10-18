"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

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
  }, [toggleFullScreen, isOpenTrackDrawer, selectedDrawerTab]);

  const value = useMemo(
    () => ({
      isOpenTrackDrawer,
      isOpenRotateDeviceDrawer,
      isPortrait,
      fullScreen,
      selectedDrawerTab,
      setSelectedDrawerTab,
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
    ]
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
