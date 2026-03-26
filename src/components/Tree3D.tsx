import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, Sparkles, OrbitControls, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function Butterfly({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function TreeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const [blooming, setBlooming] = useState(false);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      const targetRotationY = (mouse.x * viewport.width) / 20;
      const targetRotationX = -(mouse.y * viewport.height) / 20;
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setBlooming(true);
    setTimeout(() => setBlooming(false), 4000);
  };

  const leafPositions = useMemo(() => [
    [0, 2.5, 0], [0.8, 1.9, 0.5], [-0.8, 2.1, -0.4],
    [0.5, 2.8, -0.6], [-0.6, 2.6, 0.5], [0.7, 3.0, 0.2],
    [-0.4, 2.0, 0.7], [0.2, 3.4, -0.3], [-0.7, 2.7, -0.6],
    [0.6, 2.2, -0.5], [-0.5, 2.9, 0.4], [0.4, 2.4, 0.6],
    [0, 3.6, 0], [1.0, 2.5, -0.8], [-1.0, 1.9, 0.6]
  ], []);

  const butterflies = useMemo(() => [
    { pos: [1.5, 2.5, 0.5], color: "#4ade80" },
    { pos: [-1.8, 1.8, -0.5], color: "#22c55e" },
    { pos: [1.0, 3.2, -1.2], color: "#60a5fa" }
  ], []);

  return (
    <group ref={groupRef} onClick={handleClick} scale={0.85} position={[0, -0.8, 0]}>
      {/* Island Base */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2, 1, 0.6, 32]} />
        <meshStandardMaterial color="#2d4a3e" roughness={0.8} />
      </mesh>

      {/* Bottom organic layer */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.2, 1.2, 6]} />
        <meshStandardMaterial color="#1a2e25" roughness={1} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 3.2, 16]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.9} />
      </mesh>

      {/* Canopy / Leaves */}
      {leafPositions.map((pos, i) => (
        <mesh key={`leaf-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.5 + (i * 0.01) % 0.25, 32, 32]} />
          <MeshDistortMaterial
            color={blooming ? "#4ade80" : "#1b4332"}
            speed={blooming ? 3 : 1.5}
            distort={0.2}
            roughness={0.4}
            emissive={blooming ? "#22c55e" : "#000000"}
            emissiveIntensity={blooming ? 1 : 0}
          />
        </mesh>
      ))}

      {/* Atmosphere */}
      <Sparkles count={30} scale={5} size={2} speed={0.4} color="#4ade80" opacity={0.6} />

      {/* Butterflies */}
      {butterflies.map((b, i) => (
        <Butterfly key={i} position={b.pos as [number, number, number]} color={b.color} />
      ))}
    </group>
  );
}

export default function Tree3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] cursor-grab active:cursor-grabbing relative">
      <Canvas dpr={[1, 2]} shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 2, 7]} fov={45} />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-8, 5, 5]} intensity={0.5} color="#4ade80" />
        <pointLight position={[8, -5, 5]} intensity={0.5} />

        <Suspense fallback={null}>
          <TreeModel />
          <Environment preset="forest" />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={15} blur={2} far={10} />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  );
}
