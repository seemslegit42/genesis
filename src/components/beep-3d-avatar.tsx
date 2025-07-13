
'use client';
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Custom Fresnel shader for the glowing edge effect on the shells
const FresnelMaterial = shaderMaterial(
  {
    uColor: new THREE.Color(0.0, 0.5, 0.5),
    uRimColor: new THREE.Color(0.2, 0.8, 0.8),
    uFresnelPower: 2.5,
    uTime: 0,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = -modelViewPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform vec3 uRimColor;
    uniform float uFresnelPower;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewDir);
      
      float fresnel = 1.0 - dot(normal, viewDir);
      fresnel = pow(fresnel, uFresnelPower);
      fresnel *= (1.0 + 0.2 * sin(uTime * 2.0)); // subtle pulse

      vec3 color = mix(uColor, uRimColor, fresnel);

      gl_FragColor = vec4(color, fresnel * 0.7 + 0.1);
    }
  `
);

extend({ FresnelMaterial });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            fresnelMaterial: any
        }
    }
}


function BeepOrb() {
  const group = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const shellsRef = useRef<THREE.ShaderMaterial[]>([]);
  const eyesRef = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y += 0.001; // Slower, more hypnotic rotation
      group.current.position.y = 0.1 * Math.sin(elapsedTime * 0.8); // Softer, slower bob
    }
    
    // Pulse the core orb's emissive intensity
    if (coreRef.current && coreRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        coreRef.current.material.emissiveIntensity = 0.3 + 0.2 * Math.sin(elapsedTime * 0.5);
    }

    // Update the Fresnel shader time uniform for the shells
    shellsRef.current?.forEach((shell) => {
      if (shell) {
        shell.uniforms.uTime.value = elapsedTime;
      }
    });

    // Slower, more deliberate blink
    const blink = Math.sin(elapsedTime * 0.5) > 0.98 ? 0.05 : 1;
    eyesRef.current.forEach((eye) => {
      if (eye && eye.material) {
        (eye.material as THREE.MeshStandardMaterial).opacity = blink;
      }
    });
  });

  const shells = [1.15, 1.3, 1.45].map((scale, idx) => (
    <mesh
      key={idx}
      scale={[scale, scale, scale]}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <fresnelMaterial
        ref={(el: THREE.ShaderMaterial) => (shellsRef.current[idx] = el)}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  ));

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Core reflective orb */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#004d40" // Deep, dark teal/jade
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          emissive={"#20B2AA"} // Roman Aqua emissive glow
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Bioluminescent shells with Fresnel effect */}
      {shells}

      {/* Minimal glowing eyes */}
      <mesh
        ref={(el) => (eyesRef.current[0] = el!)}
        position={[-0.4, 0.2, 0.9]}
      >
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#00CED1" emissive="#40E0D0" emissiveIntensity={2} transparent opacity={1} toneMapped={false} />
      </mesh>
      <mesh
        ref={(el) => (eyesRef.current[1] = el!)}
        position={[0.4, 0.2, 0.9]}
      >
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#00CED1" emissive="#40E0D0" emissiveIntensity={2} transparent opacity={1} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Beep3DAvatar() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 5, 2]} intensity={0.5} />
      <BeepOrb />
    </Canvas>
  );
}
