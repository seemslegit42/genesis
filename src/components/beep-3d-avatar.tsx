
'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// This shader creates a glowing orb with a fresnel effect (brighter edges)
const OrbMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.2, 0.5, 1.0), // A nice blue
    uRimColor: new THREE.Color(0.8, 0.9, 1.0), // A lighter rim color
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -modelViewPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uRimColor;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = 1.0 - dot(normal, viewDir);
      fresnel = pow(fresnel, 2.0); // Power makes the rim sharper

      // Add a subtle pulsing effect
      float pulse = 0.9 + 0.1 * sin(uTime * 2.0);
      vec3 finalColor = mix(uColor, uRimColor, fresnel) * pulse;

      gl_FragColor = vec4(finalColor, fresnel * 0.5 + 0.3); // Make it translucent
    }
  `
);

extend({ OrbMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbMaterial: any;
    }
  }
}

const BeepEntity = () => {
  const materialRef = useRef<any>();
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <orbMaterial
        ref={materialRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export function Beep3DAvatar() {
  return (
    <Canvas camera={{ position: [0, 0, 2.2], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <BeepEntity />
    </Canvas>
  );
}
