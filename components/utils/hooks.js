"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Calculates the Delta E (CIE76) between two colors in RGB space.
 * @param {Object} rgb1 - The first RGB color object with properties r, g, b (0-255).
 * @param {Object} rgb2 - The second RGB color object with properties r, g, b (0-255).
 * @returns {number} The Delta E value. Lower values indicate more similar colors.
 */
export function calculateDeltaE(rgb1, rgb2) {
  // Convert RGB to Lab
  const lab1 = rgbToLab(rgb1);
  const lab2 = rgbToLab(rgb2);

  // Calculate Delta E (CIE76 formula)
  const deltaL = lab2.L - lab1.L;
  const deltaA = lab2.A - lab1.A;
  const deltaB = lab2.B - lab1.B;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

/**
 * Converts an RGB color to Lab color space.
 * @param {Object} rgb - The RGB color object with properties r, g, b (0-255).
 * @returns {Object} The Lab color object with properties l, a, b.
 */
export function rgbToLab(rgb) {
  // Convert RGB to XYZ
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ color space
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  // Convert XYZ to Lab
  const fx = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  const fy = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  const fz = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  const L = 116 * fy - 16;
  const A = 500 * (fx - fy);
  const B = 200 * (fy - fz);

  return { L, A, B };
}

/**
 * Custom hook to check if a media query matches the current viewport
 * @param {string} query - The media query to check
 * @returns {boolean} - True if the media query matches, false otherwise
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query],
  );

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Formats milliseconds into a time string (MM:SS)
 * @param {number} ms - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Formats a date into a relative time string (e.g., "2 hours ago")
 * @param {Date|string} inputDate - The date to format
 * @returns {string} - Formatted relative time string
 */
export const formatRelativeTime = (inputDate) => {
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 5) {
    return "just now";
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
};
