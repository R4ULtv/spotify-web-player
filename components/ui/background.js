"use client";

import { useMemo } from "react";
import { Transition } from "@headlessui/react";
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import { useSpotify } from "@/components/providers/SpotifyProvider";

export default function RandomCircle() {
  const { currentPalette } = useSpotify();

  const { darkestColor, otherColors } = useMemo(() => {
    if (!currentPalette?.length) {
      return { darkestColor: "#18181b", otherColors: ["#18181b", "#18181b"] };
    }

    const sortedColors = [...currentPalette].sort(
      (a, b) => a.lightness - b.lightness
    );
    return {
      darkestColor: sortedColors[0].hex,
      otherColors: [
        sortedColors[1]?.hex || "#18181b",
        sortedColors[2]?.hex || "#18181b",
      ],
    };
  }, [currentPalette]);

  return (
    <Transition show={!!currentPalette?.length}>
      <div className="absolute inset-0 w-svw h-svh overflow-hidden data-[closed]:opacity-0 duration-300 ease-out">
        <div className="absolute z-[2] inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgbnVtT2N0YXZlcz0iMyIgc2VlZD0iMiIgcmVzdWx0PSJub2lzZSI+PC9mZVR1cmJ1bGVuY2U+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIj48L2ZlQ29sb3JNYXRyaXg+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-50" />
        <ShaderGradientCanvas>
          <ShaderGradient
            animate="on"
            brightness={0.9}
            cAzimuthAngle={180}
            cDistance={2.8}
            cPolarAngle={115}
            cameraZoom={9.1}
            color1={otherColors[0]}
            color2={otherColors[1]}
            color3={darkestColor}
            frameRate={60}
            grain="off"
            lightType="3d"
            positionX={0}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={0}
            rotationZ={235}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0}
            uDensity={1.1}
            uFrequency={0}
            uSpeed={0.1}
            uStrength={2.4}
            uTime={8}
            wireframe={false}
            zoomOut={false}
            enableTransition={false}
          />
        </ShaderGradientCanvas>
      </div>
    </Transition>
  );
}
