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

// Create a context for Spotify-related data and functions
const SpotifyContext = createContext();

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export const SpotifyProvider = ({ children }) => {
  const { data: session } = useSession();

  // State to manage player information and UI settings
  const [playerState, setPlayerState] = useState({
    currentTrack: null,
    currentQueue: [],
    recentlyTracks: [],
    isPlayingAds: false,
    isPlaying: false,
    progress: 0,
    currentPalette: null,
    tvMode: false,
  });

  // Fetch data from Spotify API with authentication
  const fetchWithAuth = useCallback(
    async (url, options = {}) => {
      if (!session?.accessToken) throw new Error("No access token available");
      const res = await fetch(`${SPOTIFY_API_BASE}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (res.status === 403) {
        const { error } = await res.json();
        if (error.reason === "PREMIUM_REQUIRED") {
          throw new Error("Spotify Premium is required for this action");
        }
        throw new Error("Invalid access token");
      }
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      return res;
    },
    [session?.accessToken]
  );

  // Generic handler for Spotify actions with error handling and track refresh
  const handleSpotifyAction = useCallback(async (action, errorMessage) => {
    try {
      await action();
      await fetchCurrentTrack(); // Refresh current track info after action
    } catch (error) {
      toast.error(errorMessage, { description: error.message });
      console.error(errorMessage, error);
    }
  }, []);

  // Toggle shuffle mode for the current playback
  const toggleShuffle = useCallback(
    () =>
      handleSpotifyAction(
        () =>
          fetchWithAuth(
            `/me/player/shuffle?state=${!playerState.currentTrack
              ?.shuffleState}`,
            { method: "PUT" }
          ),
        "Failed to toggle shuffle"
      ),
    [fetchWithAuth, playerState.currentTrack?.shuffleState, handleSpotifyAction]
  );

  // Rotate through repeat states: off -> context -> track -> off
  const rotateRepeatState = useCallback(() => {
    const states = ["off", "context", "track"];
    const nextState =
      states[
        (states.indexOf(playerState.currentTrack?.repeatState) + 1) %
          states.length
      ];
    return handleSpotifyAction(
      () =>
        fetchWithAuth(`/me/player/repeat?state=${nextState}`, {
          method: "PUT",
        }),
      "Failed to change repeat state"
    );
  }, [
    fetchWithAuth,
    playerState.currentTrack?.repeatState,
    handleSpotifyAction,
  ]);

  // Toggle play/pause for the current track
  const togglePlay = useCallback(
    () =>
      handleSpotifyAction(
        () =>
          fetchWithAuth(
            `/me/player/${playerState.isPlaying ? "pause" : "play"}`,
            { method: "PUT" }
          ),
        "Failed to toggle play"
      ),
    [fetchWithAuth, playerState.isPlaying, handleSpotifyAction]
  );

  // Skip to the previous track in the queue
  const skipToPrevious = useCallback(
    () =>
      handleSpotifyAction(
        () => fetchWithAuth("/me/player/previous", { method: "POST" }),
        "Failed to skip to previous"
      ),
    [fetchWithAuth, handleSpotifyAction]
  );

  // Skip to the next track in the queue
  const skipToNext = useCallback(
    () =>
      handleSpotifyAction(
        () => fetchWithAuth("/me/player/next", { method: "POST" }),
        "Failed to skip to next"
      ),
    [fetchWithAuth, handleSpotifyAction]
  );

  // Add a new function to fetch the queue
  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/me/player/queue");
      const data = await res.json();
      setPlayerState((prev) => ({
        ...prev,
        currentQueue: data.queue,
      }));
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  }, [fetchWithAuth]);

  // Fetch the currently playing track information
  const fetchCurrentTrack = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/me/player");
      if (res.status === 204) {
        setPlayerState((prev) =>
          prev.currentTrack ? { ...prev, currentTrack: null } : prev
        );
        return;
      }
      const data = await res.json();
      if (data?.currently_playing_type === "track") {
        // Extract relevant track information
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
        setPlayerState((prev) => ({
          ...prev,
          currentTrack: track,
          progress: track.progressMs,
          isPlaying: track.isPlaying,
          isPlayingAds: false,
        }));
      } else if (data?.currently_playing_type === "ad") {
        setPlayerState((prev) => ({
          ...prev,
          isPlayingAds: true,
        }));
      }
    } catch (error) {
      console.error("Error fetching current track:", error);
    }
  }, [fetchWithAuth]);

  // Extract color palette from the current track's album art
  const fetchCurrentPalette = useCallback(async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const colors = await extractColors(imageUrl, {
        crossOrigin: "Anonymous",
      });
      setPlayerState((prev) => ({ ...prev, currentPalette: colors }));

      // Update favicon to current album art
      const link =
        document.querySelector("link[rel~='icon']") ||
        document.createElement("link");
      link.type = "image/png";
      link.rel = "shortcut icon";
      link.href = imageUrl;
      document.getElementsByTagName("head")[0].appendChild(link);
    } catch (error) {
      console.error("Error extracting colors:", error);
      setPlayerState((prev) => ({ ...prev, currentPalette: null }));
    }
  }, []);

  // Fetch current track periodically when session is active
  useEffect(() => {
    if (session?.accessToken) {
      // fetch the current track every 2 seconds (Rate Limit: unlimited??)
      fetchCurrentTrack();
      const interval = setInterval(fetchCurrentTrack, 2000);
      return () => clearInterval(interval);
    }
  }, [fetchCurrentTrack, session?.accessToken]);

  // Load TV mode setting from localStorage on initial render
  useEffect(() => {
    const storedTvMode = localStorage.getItem("tvMode");
    if (storedTvMode) {
      setPlayerState((prev) => ({ ...prev, tvMode: storedTvMode === "true" }));
    }
  }, []);

  // Update document title and fetch color palette when current track changes
  useEffect(() => {
    const currentAlbumImageUrl =
      playerState.currentTrack?.album?.images[2]?.url;
    if (currentAlbumImageUrl) {
      document.title = `${
        playerState.currentTrack.name
      } - ${playerState.currentTrack.artists
        .map((artist) => artist.name)
        .join(", ")} | Spotify Web Player`;
      fetchCurrentPalette(currentAlbumImageUrl);
    }
  }, [playerState.currentTrack?.album?.images[2]?.url, fetchCurrentPalette]);

  // Update progress of currently playing track
  useEffect(() => {
    if (!playerState.isPlaying || !playerState.currentTrack) return;

    const progressInterval = setInterval(() => {
      setPlayerState((prev) => ({
        ...prev,
        progress:
          prev.progress < prev.currentTrack.durationMs
            ? prev.progress + 1000
            : prev.progress,
      }));
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [playerState.currentTrack, playerState.isPlaying]);

  // Toggle TV mode on/off and save to localStorage
  const toggleTvMode = useCallback(() => {
    setPlayerState((prev) => {
      const newTvMode = !prev.tvMode;
      localStorage.setItem("tvMode", newTvMode);
      return { ...prev, tvMode: newTvMode };
    });
  }, []);

  // Seek to a specific position within the current track
  const seekTrack = useCallback(
    async (positionMs) => {
      if (!playerState.currentTrack) return;
      try {
        await fetchWithAuth(`/me/player/seek?position_ms=${positionMs}`, {
          method: "PUT",
        });
        setPlayerState((prev) => ({ ...prev, progress: positionMs }));
      } catch (error) {
        toast.error("Failed to seek within track:", {
          description: error.message,
        });
        console.error("Error seeking within track:", error);
      }
    },
    [fetchWithAuth, playerState.currentTrack]
  );

  // Handle shortcuts for actions
  useEffect(() => {
    const keyActions = {
      " ": (e) => {
        e.preventDefault();
        togglePlay();
      },
      ArrowLeft: (e) => {
        if (e.shiftKey && playerState.currentTrack) {
          e.preventDefault();
          seekTrack(Math.max(0, playerState.progress - 10000));
        } else if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          skipToPrevious();
        }
      },
      ArrowRight: (e) => {
        if (e.shiftKey && playerState.currentTrack) {
          e.preventDefault();
          seekTrack(
            Math.min(
              playerState.currentTrack.durationMs,
              playerState.progress + 10000
            )
          );
        } else if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          skipToNext();
        }
      },
      s: (e) => {
        if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
          toggleShuffle();
        }
      },
      r: (e) => {
        if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
          rotateRepeatState();
        }
      },
      t: (e) => {
        if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
          toggleTvMode();
        }
      },
    };

    const handleKeyDown = (event) => {
      const action = keyActions[event.key];
      if (action) action(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlay,
    skipToPrevious,
    skipToNext,
    toggleShuffle,
    rotateRepeatState,
    toggleTvMode,
    seekTrack,
    playerState.currentTrack,
    playerState.progress,
  ]);

  // Fetch recently played tracks
  const fetchRecentlyPlayed = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/me/player/recently-played");
      const data = await res.json();
      const recentTracks = data.items.map((item) => ({
        name: item.track.name,
        link: item.track.external_urls.spotify,
        artists: item.track.artists.map((artist) => ({
          name: artist.name,
          link: artist.external_urls.spotify,
        })),
        album: {
          name: item.track.album.name,
          images: item.track.album.images,
          link: item.track.album.external_urls.spotify,
        },
        durationMs: item.track.duration_ms,
        explicit: item.track.explicit,
        playedAt: item.played_at,
      }));
      setPlayerState((prev) => ({ ...prev, recentlyTracks: recentTracks }));
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchRecentlyPlayed();
      const interval = setInterval(fetchRecentlyPlayed, 90000); // Fetch every minute
      return () => clearInterval(interval);
    }
  }, [fetchRecentlyPlayed, session?.accessToken]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      ...playerState,
      progressPercentage:
        (playerState.progress / (playerState.currentTrack?.durationMs || 1)) *
        100,
      togglePlay,
      skipToPrevious,
      skipToNext,
      toggleShuffle,
      rotateRepeatState,
      toggleTvMode,
      seekTrack,
    }),
    [
      playerState,
      togglePlay,
      skipToPrevious,
      skipToNext,
      toggleShuffle,
      rotateRepeatState,
      toggleTvMode,
      seekTrack,
    ]
  );

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

// Custom hook to access Spotify context
export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
