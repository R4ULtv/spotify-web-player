"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSpotify } from "@/components/providers/SpotifyProvider";

export default function RandomCircle() {
  const { currentPalette } = useSpotify();
  const [circles, setCircles] = useState([]);

  const { darkestColor, otherColors } = useMemo(() => {
    if (!currentPalette?.length) {
      return { darkestColor: "#18181b", otherColors: ["#18181b"] };
    }

    const sortedColors = [...currentPalette].sort(
      (a, b) => a.lightness - b.lightness
    );
    return {
      darkestColor: sortedColors[0].hex,
      otherColors: sortedColors.slice(1).map((color) => color.hex),
    };
  }, [currentPalette]);

  const generateCircles = useCallback(() => {
    const numCircles = otherColors.length * 2 + 5;
    return Array.from({ length: numCircles }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 350 + 100,
      color: otherColors[i % otherColors.length],
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, [otherColors]);

  useEffect(() => {
    setCircles(generateCircles());
  }, [generateCircles]);

  return (
    <div
      className="absolute inset-0 w-svw h-svh overflow-hidden transition-all duration-300"
      style={{ backgroundColor: darkestColor }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgbnVtT2N0YXZlcz0iMyIgc2VlZD0iMiIgcmVzdWx0PSJub2lzZSI+PC9mZVR1cmJ1bGVuY2U+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIj48L2ZlQ29sb3JNYXRyaXg+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-50" />
      {circles.map(({ id, x, y, size, color, animationDelay }) => (
        <div
          key={id}
          className="absolute rounded-full opacity-50 blur-2xl animate-float"
          style={{
            backgroundColor: color,
            animationDelay,
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      ))}
    </div>
  );
}
