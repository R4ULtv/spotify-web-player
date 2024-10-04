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

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children, session }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPalette, setCurrentPalette] = useState(null);

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
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error fetching current track:", error);
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
    } catch (error) {
      console.error("Error fetching current track:", error);
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
    } catch (error) {
      console.error("Error fetching current track:", error);
    }
  }, [currentTrack]);

  const fetchCurrentTrack = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

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
    const handleNewSong = async () => {
      if (currentTrack?.durationMs - currentTrack?.progressMs < 5000) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            currentTrack.durationMs - currentTrack.progressMs
          )
        );
        fetchCurrentTrack();
      }
    };
    if (session?.accessToken) {
      handleNewSong();
    }
  }, [currentTrack]);

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

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      progress,
      currentPalette,
      progressPercentage,
      togglePlay,
      skipToPrevious,
      skipToNext,
    }),
    [
      currentTrack,
      isPlaying,
      progress,
      currentPalette,
      progressPercentage,
      togglePlay,
      skipToPrevious,
      skipToNext,
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
