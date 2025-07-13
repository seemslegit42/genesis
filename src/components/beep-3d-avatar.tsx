
'use client';
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, Torus, Points, PointMaterial } from '@react-three/drei';

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

function BeepParticles({ count = 2000 }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));
      const r = THREE.MathUtils.randFloat(2.5, 5);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions.set([x, y, z], i * 3);
    }
    return { positions };
  }, [count]);

  useFrame((state) => {
    const { clock } = state;
    if (pointsRef.current) {
        pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        pointsRef.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#20B2AA"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}


function BeepOrb() {
  const group = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const shellsRef = useRef<THREE.ShaderMaterial[]>([]);
  const eyeArcLeft = useRef<THREE.Mesh>(null!);
  const eyeArcRight = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y += 0.001; // Slower, more hypnotic rotation
      group.current.position.y = 0.1 * Math.sin(elapsedTime * 0.8); // Softer, slower bob
    }
    
    if (coreRef.current && coreRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        coreRef.current.material.emissiveIntensity = 0.3 + 0.2 * Math.sin(elapsedTime * 0.5);
    }

    shellsRef.current?.forEach((shell) => {
      if (shell) {
        shell.uniforms.uTime.value = elapsedTime;
      }
    });
    
    // Animate eye arc intensity for a "living" feel
    const eyeIntensity = 1.5 + Math.sin(elapsedTime * 2.5) * 0.5;
    if (eyeArcLeft.current && eyeArcLeft.current.material instanceof THREE.MeshStandardMaterial) {
        eyeArcLeft.current.material.emissiveIntensity = eyeIntensity;
    }
     if (eyeArcRight.current && eyeArcRight.current.material instanceof THREE.MeshStandardMaterial) {
        eyeArcRight.current.material.emissiveIntensity = eyeIntensity;
    }
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

      {/* Non-human, glowing arc-eyes */}
      <Torus 
        ref={eyeArcLeft}
        args={[0.5, 0.03, 16, 100, Math.PI / 1.5]}
        position={[-0.2, 0.15, 0.85]}
        rotation={[0.5, -0.5, 0]}
      >
        <meshStandardMaterial color="#00CED1" emissive="#40E0D0" emissiveIntensity={2} toneMapped={false} />
      </Torus>
      <Torus 
        ref={eyeArcRight}
        args={[0.5, 0.03, 16, 100, Math.PI / 1.5]}
        position={[0.2, 0.15, 0.85]}
        rotation={[0.5, 0.5, 0]}
      >
        <meshStandardMaterial color="#00CED1" emissive="#40E0D0" emissiveIntensity={2} toneMapped={false} />
      </Torus>
    </group>
  );
}

export function Beep3DAvatar() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 5, 2]} intensity={0.5} />
      <BeepOrb />
      <BeepParticles />
    </Canvas>
  );
}
