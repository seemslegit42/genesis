
'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

function BeepOrb() {
  const group = useRef<THREE.Group>(null!);
  const shellsRef = useRef<THREE.Mesh[]>([]);
  const eyesRef = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y += 0.002;
      group.current.position.y = 0.15 * Math.sin(clock.getElapsedTime() * 1.3);
    }
    shellsRef.current?.forEach((shell, i) => {
      if (shell.material instanceof THREE.MeshPhysicalMaterial) {
        shell.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(clock.getElapsedTime() * 2 + i);
      }
    });
    const blink = Math.sin(clock.getElapsedTime() * 5) > 0.75 ? 0.1 : 1;
    eyesRef.current.forEach((eye) => {
      if (eye && eye.material) {
        (eye.material as THREE.MeshStandardMaterial).opacity = blink;
      }
    });
  });

  const shells = [1.15, 1.3, 1.45].map((scale, idx) => (
    <mesh
      key={idx}
      ref={(el) => (shellsRef.current[idx] = el!)}
      scale={[scale, scale, scale]}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        emissive={"#20B2AA"}  // Roman Aqua-ish
        emissiveIntensity={1}
        transparent
        opacity={0.3}
        roughness={0}
        metalness={0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  ));

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Core reflective orb */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#007777"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1}
          reflectivity={1}
          emissive={"#004D4D"}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Bioluminescent shells */}
      {shells}

      {/* Minimal glowing eyes */}
      <mesh
        ref={(el) => (eyesRef.current[0] = el!)}
        position={[-0.4, 0.2, 0.9]}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#00CED1" emissive="#00CED1" transparent opacity={1} />
      </mesh>
      <mesh
        ref={(el) => (eyesRef.current[1] = el!)}
        position={[0.4, 0.2, 0.9]}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#00CED1" emissive="#00CED1" transparent opacity={1} />
      </mesh>
    </group>
  );
}

export function Beep3DAvatar() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <BeepOrb />
    </Canvas>
  );
}
