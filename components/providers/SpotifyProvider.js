"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { extractColors } from "extract-colors";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
  const { data: session } = useSession();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPalette, setCurrentPalette] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [tvMode, setTvMode] = useState(false);

  const toggleShuffle = useCallback(async () => {
    if (!currentTrack) return;
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${!currentTrack.shuffleState}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (res.status === 403) {
        throw new Error("Spotify Premium is REQUIRED to toggle shuffle");
      }
      if (!res.ok) {
        throw new Error("Failed to toggle shuffle");
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      toast.error("Failed to toggle shuffle:", { description: error.message });
      console.error("Error toggling shuffle:", error);
    }
  }, [currentTrack, isPlaying]);

  const rotateRepeateState = useCallback(async () => {
    if (!currentTrack) return;
    const state = ["off", "context", "track"];
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/repeat?state=${
          state[(state.indexOf(currentTrack.repeatState) + 1) % state.length]
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (res.status === 403) {
        throw new Error("Spotify Premium is REQUIRED to change repeat state");
      }
      if (!res.ok) {
        throw new Error("Failed to change repeat state");
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      toast.error("Failed to change repeat state:", {
        description: error.message,
      });
      console.error("Error changing repeat state:", error);
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = useCallback(async () => {
    if (!currentTrack) return;
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (res.status === 403) {
        throw new Error("Spotify Premium is REQUIRED to toggle play/pause");
      }
      if (!res.ok) {
        throw new Error("Failed to toggle play");
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      toast.error("Failed to toggle play:", { description: error.message });
      console.error("Error toggling play/pause:", error);
    }
  }, [currentTrack, isPlaying]);

  const skipToPrevious = useCallback(async () => {
    if (!currentTrack) return;
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player/previous", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.status === 403) {
        throw new Error("Spotify Premium is REQUIRED to skip to previous.");
      }
      if (!res.ok) {
        throw new Error("Failed to skip to previous.");
      }
    } catch (error) {
      toast.error("Failed to skip to previous:", {
        description: error.message,
      });
      console.error("Error skipping to previous:", error);
    }
  }, [currentTrack]);

  const skipToNext = useCallback(async () => {
    if (!currentTrack) return;
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.status === 403) {
        throw new Error("Spotify Premium is REQUIRED to skip to next.");
      }
      if (!res.ok) {
        throw new Error("Failed to skip to next");
      }
    } catch (error) {
      toast.error("Failed to skip to next:", { description: error.message });
      console.error("Error skipping to next:", error);
    }
  }, [currentTrack]);

  const fetchCurrentTrack = useCallback(async () => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (res.status === 204) {
        setCurrentTrack(null);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch current track");
      }

      const data = await res.json();

      if (data?.currently_playing_type === "track") {
        const track = {
          name: data.item.name,
          link: data.item.external_urls.spotify,
          artists: data.item.artists.map((artist) => ({
            name: artist.name,
            link: artist.external_urls.spotify,
          })),
          album: {
            name: data.item.album.name,
            images: data.item.album.images,
            link: data.item.album.external_urls.spotify,
          },
          isPlaying: data.is_playing,
          repeatState: data.repeat_state,
          shuffleState: data.shuffle_state,
          progressMs: data.progress_ms,
          durationMs: data.item.duration_ms,
          explicit: data.item.explicit,
          popularity: data.item.popularity,
        };

        setCurrentTrack(track);
        setProgress(track.progressMs);
        setIsPlaying(track.isPlaying);
      }
    } catch (error) {
      console.error("Error fetching current track:", error);
    }
  }, [session]);

  const fetchCurrentPalette = useCallback(async () => {
    if (!currentTrack?.album?.images[2]?.url) return;
    document.title = `${currentTrack.name} - Spotify Web Player`;
    try {
      const colors = await extractColors(currentTrack.album.images[2].url, {
        crossOrigin: "Anonymous",
        // You can add more options here as needed
      });
      setCurrentPalette(colors);
    } catch (error) {
      console.error("Error extracting colors:", error);
      setCurrentPalette(null);
    }
  }, [currentTrack?.album?.images[2]?.url]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchCurrentTrack();
      const interval = setInterval(fetchCurrentTrack, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchCurrentTrack]);

  useEffect(() => {
    const storedTvMode = localStorage.getItem("tvMode");
    if (storedTvMode) {
      setTvMode(storedTvMode === "true");
    }
  }, []);

  const toggleTvMode = () => {
    const newTvMode = !tvMode;
    setTvMode(newTvMode);
    localStorage.setItem("tvMode", newTvMode);
  };

  // TODO: improve this code
  // useEffect(() => {
  //   const handleNewSong = async () => {
  //     if (currentTrack.durationMs - currentTrack.progressMs < 5000) {
  //       await new Promise((resolve) =>
  //         setTimeout(resolve, currentTrack.durationMs - currentTrack.progressMs)
  //       );
  //       fetchCurrentTrack();
  //     }
  //   };
  //   if (session?.accessToken) {
  //     if (currentTrack && isPlaying) {
  //       handleNewSong();
  //     }
  //   }
  // }, [currentTrack, isPlaying]);

  useEffect(() => {
    fetchCurrentPalette();
  }, [fetchCurrentPalette]);

  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < currentTrack.durationMs) {
          return prevProgress + 1000;
        }
        return prevProgress;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [currentTrack, isPlaying]);

  const progressPercentage = useMemo(
    () => (progress / (currentTrack?.durationMs || 1)) * 100,
    [progress, currentTrack]
  );

  const toggleFullScreen = useCallback(() => {
    let html = document.documentElement;

    /* View in fullscreen */
    function openFullscreen() {
      if (html.requestFullscreen) {
        html.requestFullscreen();
      } else if (html.webkitRequestFullscreen) {
        /* Safari */
        html.webkitRequestFullscreen();
      } else if (html.msRequestFullscreen) {
        /* IE11 */
        html.msRequestFullscreen();
      }
    }

    /* Close fullscreen */
    function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    }

    if (fullScreen) {
      closeFullscreen();
      setFullScreen(false);
    } else {
      openFullscreen();
      setFullScreen(true);
    }
  }, [fullScreen]);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      progress,
      currentPalette,
      progressPercentage,
      fullScreen,
      tvMode,
      togglePlay,
      skipToPrevious,
      skipToNext,
      toggleShuffle,
      rotateRepeateState,
      toggleFullScreen,
      toggleTvMode,
    }),
    [
      currentTrack,
      isPlaying,
      progress,
      currentPalette,
      progressPercentage,
      fullScreen,
      tvMode,
      toggleTvMode,
      togglePlay,
      skipToPrevious,
      skipToNext,
      toggleShuffle,
      rotateRepeateState,
      toggleFullScreen,
    ]
  );

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
