"use client";
import createGlobe from "cobe";
import { useEffect, useRef, useMemo } from "react";

const MARKER_SIZE = 0.06;
const MARKERS = [
  [40.7128, -74.006], // New York
  [34.0522, -118.2437], // Los Angeles
  [41.8781, -87.6298], // Chicago
  [51.5074, -0.05278], // London
  [48.8566, 2.3522], // Paris
  [52.52, 13.405], // Berlin
  [35.6762, 139.6503], // Tokyo
  [31.2304, 121.4737], // Shanghai
  [22.3193, 114.1694], // Hong Kong
  [-33.8688, 151.2093], // Sydney
  [-22.9068, -43.1729], // Rio de Janeiro
  [1.3521, 103.8198], // Singapore
].map((location) => ({ location, size: MARKER_SIZE }));

export function Cobe({
  className = "w-full max-w-xl aspect-square m-auto relative",
}) {
  const canvasRef = useRef();
  const phiRef = useRef(0);

  const globeConfig = useMemo(
    () => ({
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 32000,
      mapBrightness: 5.0,
      baseColor: [244 / 255, 244 / 255, 245 / 255],
      markerColor: [30 / 255, 215 / 255, 96 / 255],
      glowColor: [24 / 255, 24 / 255, 27 / 255],
      markers: MARKERS,
      scale: 1.24,
    }),
    [],
  );

  useEffect(() => {
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      ...globeConfig,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        state.phi = phiRef.current;
        phiRef.current += 0.005;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    const timeout = setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
      clearTimeout(timeout);
    };
  }, [globeConfig]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
