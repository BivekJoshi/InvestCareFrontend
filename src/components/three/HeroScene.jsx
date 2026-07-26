'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  Icosahedron,
  Points,
  PointMaterial,
  Sparkles,
  Torus,
} from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

import { scene as sceneColors } from '@/theme';

/**
 * Ambient hero scene — an abstract stand-in for diversified, compounding
 * capital: a faceted core inside a wireframe shell, six orbiting nodes (one per
 * investment sector) on three inclined rings, and a slow particle field.
 * Purely decorative, so the whole canvas is hidden from assistive tech.
 */
export default function HeroScene({ className = '' }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.4, 6.4], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduceMotion ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 5]} intensity={1.7} color={sceneColors.light.key} />
        <pointLight position={[-6, -3, -4]} intensity={2.6} color={sceneColors.light.warm} />
        <pointLight position={[5, 4, -6]} intensity={1.4} color={sceneColors.light.cool} />

        <ParallaxRig enabled={!reduceMotion}>
          <Float speed={1.15} rotationIntensity={0.45} floatIntensity={0.65}>
            <Core />
          </Float>

          {ORBITS.map((orbit) => (
            <Orbit key={orbit.radius} {...orbit} />
          ))}

          <ParticleField />
          <Sparkles count={60} scale={9} size={2.6} speed={0.3} color={sceneColors.node} opacity={0.6} />
        </ParallaxRig>
      </Canvas>
    </div>
  );
}

/** radius / tilt / speed / how many nodes ride this ring */
const ORBITS = [
  { radius: 2.45, tilt: [1.36, 0, 0.28], speed: 0.13, nodes: 2, opacity: 0.55 },
  { radius: 3.15, tilt: [1.12, 0.42, -0.2], speed: -0.09, nodes: 3, opacity: 0.34 },
  { radius: 3.8, tilt: [1.5, -0.3, 0.5], speed: 0.06, nodes: 1, opacity: 0.2 },
];

/** Eases the whole scene toward the pointer for a subtle depth effect. */
function ParallaxRig({ children, enabled }) {
  const group = useRef(null);

  useFrame((state, delta) => {
    if (!group.current || !enabled) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.32, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.22, 3, delta);
  });

  return <group ref={group}>{children}</group>;
}

function Core() {
  const solid = useRef(null);
  const shell = useRef(null);
  const halo = useRef(null);

  useFrame((state, delta) => {
    if (solid.current) solid.current.rotation.y += delta * 0.14;
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.09;
      shell.current.rotation.x += delta * 0.04;
    }
    if (halo.current) {
      // Gentle breathing so the core never sits perfectly still.
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
      halo.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <Icosahedron ref={solid} args={[1.45, 1]}>
        <meshStandardMaterial color={sceneColors.core} roughness={0.32} metalness={0.6} flatShading />
      </Icosahedron>

      <Icosahedron ref={shell} args={[1.85, 1]}>
        <meshBasicMaterial color={sceneColors.shell} wireframe transparent opacity={0.34} />
      </Icosahedron>

      <Icosahedron ref={halo} args={[2.25, 2]}>
        <meshBasicMaterial color={sceneColors.halo} wireframe transparent opacity={0.09} />
      </Icosahedron>
    </group>
  );
}

function Orbit({ radius, tilt, speed, nodes, opacity }) {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  // Nodes are children of the ring group, so they inherit its tilt and spin.
  const nodeAngles = useMemo(
    () => Array.from({ length: nodes }, (_, i) => (i / nodes) * Math.PI * 2),
    [nodes],
  );

  return (
    <group ref={ref} rotation={tilt}>
      <Torus args={[radius, 0.011, 12, 140]}>
        <meshBasicMaterial color={sceneColors.orbit} transparent opacity={opacity} />
      </Torus>

      {nodeAngles.map((angle) => (
        <mesh
          key={angle}
          position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
        >
          <sphereGeometry args={[0.062, 16, 16]} />
          <meshBasicMaterial color={sceneColors.node} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ count = 1100 }) {
  const ref = useRef(null);

  // Random cloud generated once per mount.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 4.2 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.018;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={sceneColors.particles}
        size={0.032}
        sizeAttenuation
        depthWrite={false}
        opacity={0.68}
      />
    </Points>
  );
}
