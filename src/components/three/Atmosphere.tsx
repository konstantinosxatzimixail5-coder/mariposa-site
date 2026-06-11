"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Site-wide atmosphere — a single, slow set of soft Aegean ripples. Layered sine
 * crests drift and undulate across a full-frame plane, lit in a soft cyan-blue
 * so the page reads as if it sits just above moving water. Pure GLSL on one
 * fullscreen mesh (no textures, models or geometry detail), so it stays
 * feather-light. Held at low opacity by AtmosphereMount and mounted only when
 * the capability / reduced-motion gate passes; the page stands on its own
 * without it.
 */

const CYAN = new THREE.Color("#79c7d6"); // soft Aegean cyan-blue

const waveVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Stacked ripple crests whose lines bend along travelling swells, plus a slow
// vertical drift. Thin, bright crests over near-transparent troughs read as
// light catching the surface of calm water rather than a flat gradient.
const waveFragment = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uAspect;
  varying vec2 vUv;

  float crests(vec2 uv, float t, float freq, float speed, float bend) {
    // Bend the horizontal crest lines with a couple of travelling swells.
    float swell =
        sin(uv.x * 3.1 + t * speed) * bend
      + sin(uv.x * 6.7 - t * speed * 0.6) * bend * 0.5;
    float lines = 0.5 + 0.5 * sin((uv.y + swell) * freq + t * speed * 0.8);
    // Pow sharpens the bands into slender crests with broad, faint troughs.
    return pow(lines, 7.0);
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect; // keep swell wavelength even across aspect ratios

    float w =
        crests(uv, uTime, 26.0, 0.55, 0.045) * 0.7
      + crests(uv, uTime * 1.3 + 10.0, 41.0, 0.40, 0.030) * 0.4
      + crests(uv, uTime * 0.7 + 20.0, 17.0, 0.30, 0.060) * 0.5;

    // Fade gently at the very top and bottom so there is no hard plane edge.
    float edge = smoothstep(0.0, 0.18, vUv.y) * (1.0 - smoothstep(0.82, 1.0, vUv.y));

    float a = clamp(w, 0.0, 1.0) * edge * 0.5;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Waves() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const viewport = useThree((s) => s.viewport);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: CYAN },
      uAspect: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime!.value = state.clock.elapsedTime;
    matRef.current.uniforms.uAspect!.value =
      state.viewport.width / state.viewport.height;
  });

  // A unit plane scaled to the visible viewport so the ripples always fill the
  // frame, whatever the aspect ratio. r3f recomputes `viewport` on resize.
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={waveVertex}
        fragmentShader={waveFragment}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function Atmosphere() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 50 }}
    >
      <Waves />
    </Canvas>
  );
}
