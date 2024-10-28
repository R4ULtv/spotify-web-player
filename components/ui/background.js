"use client";

import { useMemo } from "react";
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import { useSpotify } from "@/components/providers/SpotifyProvider";
import { calculateDeltaE } from "@/components/utils/hooks";
import { useMedia } from "@/components/providers/MediaProvider";

export const presets = {
  default: {
    brightness: 0.7,
    cAzimuthAngle: 180,
    cDistance: 3.5,
    cPolarAngle: 115,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 235,
    uDensity: 1.1,
    uStrength: 2.4,
    uTime: 8,
  },
  wavy: {
    brightness: 0.8,
    cAzimuthAngle: 200,
    cDistance: 4,
    cPolarAngle: 125,
    rotationX: 15,
    rotationY: 15,
    rotationZ: 255,
    uDensity: 1.3,
    uStrength: 3,
    uTime: 12,
  },
  calm: {
    brightness: 0.6,
    cAzimuthAngle: 160,
    cDistance: 3,
    cPolarAngle: 105,
    rotationX: -15,
    rotationY: -15,
    rotationZ: 215,
    uDensity: 0.9,
    uStrength: 1.8,
    uTime: 4,
  },
};

export const GradientBackground = ({
  className,
  colors,
  grain = true,
  animation = true,
  uSpeed = 0.1,
  preset = null,
}) => {
  if (colors.length === 0) return null;

  const activePreset = preset ? presets[preset] : presets.default;

  return (
    <div className={className}>
      {grain && (
        <div className="absolute z-[2] inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgbnVtT2N0YXZlcz0iMyIgc2VlZD0iMiIgcmVzdWx0PSJub2lzZSI+PC9mZVR1cmJ1bGVuY2U+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIj48L2ZlQ29sb3JNYXRyaXg+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-50" />
      )}
      <ShaderGradientCanvas>
        <ShaderGradient
          animate={animation ? "on" : "off"}
          brightness={activePreset.brightness}
          cAzimuthAngle={activePreset.cAzimuthAngle}
          cDistance={activePreset.cDistance}
          cPolarAngle={activePreset.cPolarAngle}
          color1={colors[0]}
          color2={colors[1]}
          color3={colors[2]}
          grain="off"
          lightType="3d"
          positionX={0}
          positionY={0}
          positionZ={0}
          range="disabled"
          reflection={0.1}
          rotationX={activePreset.rotationX}
          rotationY={activePreset.rotationY}
          rotationZ={activePreset.rotationZ}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={activePreset.uDensity}
          uFrequency={0}
          uSpeed={uSpeed}
          uStrength={activePreset.uStrength}
          uTime={activePreset.uTime}
          wireframe={false}
          zoomOut={false}
          enableTransition={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
};

export function DynamicBackground() {
  const { currentPalette } = useSpotify();
  const { bgSettings } = useMedia();

  if (!currentPalette && !bgSettings) return null;

  const { darkestColor, otherColors } = useMemo(() => {
    if (!currentPalette?.length) return { darkestColor: "", otherColors: [] };

    const sortedColors = [...currentPalette].sort(
      (a, b) => a.lightness - b.lightness,
    );
    const darkestColor = sortedColors[0].hex;

    const otherColors = sortedColors
      .slice(1)
      .sort((a, b) =>
        bgSettings.colors.desc
          ? b[bgSettings.colors.type] - a[bgSettings.colors.type]
          : a[bgSettings.colors.type] - b[bgSettings.colors.type],
      )
      .filter((color, index, array) => {
        if (index === array.length - 1) return true;
        const deltaE = calculateDeltaE(
          { r: color.red, g: color.green, b: color.blue },
          {
            r: array[index + 1].red,
            g: array[index + 1].green,
            b: array[index + 1].blue,
          },
        );
        return deltaE >= 30;
      })
      .map((color) => color.hex);

    while (otherColors.length < 2) {
      otherColors.push(darkestColor);
    }

    return { darkestColor, otherColors };
  }, [currentPalette, bgSettings]);

  return (
    <GradientBackground
      className="absolute inset-0 w-svw h-svh overflow-hidden data-[closed]:opacity-0 duration-300 ease-out"
      colors={[otherColors[0], otherColors[1], darkestColor]}
      animation={bgSettings.animation}
      grain={bgSettings.grain}
      uSpeed={bgSettings.uSpeed}
      preset={bgSettings.preset}
    />
  );
}
