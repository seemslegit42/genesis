
'use client';
import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import type { Vow } from '@/lib/types';

// Define the visual themes for each Vow
const VOW_THEMES: Record<Vow, any> = {
  Architect: {
    coreColor: new THREE.Color('#3d5afe'), // A deep, structural blue
    rimColor: new THREE.Color('#81d4fa'), // Lighter, blueprint-like cyan
    fresnelPower: 3.5,
    particleColor: '#81d4fa',
    particleShape: 'box',
  },
  Oracle: {
    coreColor: new THREE.Color('#673ab7'), // A mystical, deep purple
    rimColor: new THREE.Color('#f48fb1'), // A soft, ethereal pink
    fresnelPower: 2.0,
    particleColor: '#f48fb1',
    particleShape: 'sphere',
  },
  Sentinel: {
    coreColor: new THREE.Color('#f44336'), // A vigilant, primary red
    rimColor: new THREE.Color('#ffc107'), // A fiery, warning amber
    fresnelPower: 5.0,
    particleColor: '#ffc107',
    particleShape: 'cone', // Represents a shield or shard
  },
};

const DYNAMIC_FRESNEL_SHADER = {
  vertex: `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = -modelViewPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,
  fragment: `
    uniform vec3 uCoreColor;
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
      fresnel *= (1.0 + 0.1 * sin(uTime * 3.0 + vNormal.z * 5.0)); // subtle, shimmering pulse

      vec3 color = mix(uCoreColor, uRimColor, fresnel);

      gl_FragColor = vec4(color, fresnel * 0.8 + 0.2); // Make it more solid
    }
  `
};

const DynamicFresnelMaterial = shaderMaterial(
  {
    uCoreColor: new THREE.Color(0.0, 0.5, 0.5),
    uRimColor: new THREE.Color(0.2, 0.8, 0.8),
    uFresnelPower: 2.5,
    uTime: 0,
  },
  DYNAMIC_FRESNEL_SHADER.vertex,
  DYNAMIC_FRESNEL_SHADER.fragment
);

extend({ DynamicFresnelMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      dynamicFresnelMaterial: any
    }
  }
}

function BeepEntity({ vow }: { vow: Vow | null }) {
  const group = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const particleSystemRef = useRef<THREE.Group>(null!);

  const theme = vow ? VOW_THEMES[vow] : VOW_THEMES.Architect;

  const particleGeometry = useMemo(() => {
    switch (theme.particleShape) {
      case 'box':
        return new THREE.BoxGeometry(0.03, 0.03, 0.03);
      case 'cone':
        return new THREE.ConeGeometry(0.02, 0.05, 4);
      case 'sphere':
      default:
        return new THREE.SphereGeometry(0.02, 8, 8);
    }
  }, [theme.particleShape]);

  const particles = useMemo(() => {
    const count = 50;
    const temp = new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ),
      scale: 0.5 + Math.random() * 0.5,
    }));
    return temp;
  }, []);

  useEffect(() => {
    if (materialRef.current) {
        materialRef.current.uniforms.uCoreColor.value = theme.coreColor;
        materialRef.current.uniforms.uRimColor.value = theme.rimColor;
        materialRef.current.uniforms.uFresnelPower.value = theme.fresnelPower;
    }
  }, [theme]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = elapsedTime * 0.2;
      group.current.rotation.x = elapsedTime * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsedTime;
    }
    if (particleSystemRef.current) {
      particleSystemRef.current.rotation.y = -elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Central Orb */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <dynamicFresnelMaterial
          ref={materialRef}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Particle System */}
      <group ref={particleSystemRef}>
        {particles.map((particle, i) => (
          <mesh key={i} position={particle.position} scale={particle.scale} geometry={particleGeometry}>
            <meshStandardMaterial color={theme.particleColor} emissive={theme.particleColor} emissiveIntensity={1} roughness={0.2} metalness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Beep3DAvatarV2({ vow }: { vow: Vow | null }) {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <BeepEntity vow={vow} />
    </Canvas>
  );
}
