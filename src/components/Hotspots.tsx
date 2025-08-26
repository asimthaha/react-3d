import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";

interface HotspotData {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  color?: string;
}

const hotspotData: HotspotData[] = [
  {
    id: "feature-1",
    position: [1.2, 0.8, 0.5],
    title: "Premium Materials",
    description: "High-quality PBR materials with realistic lighting",
    color: "#4fc3f7"
  },
  {
    id: "feature-2", 
    position: [-1.5, -0.5, 1],
    title: "Advanced Geometry",
    description: "Complex mesh topology with smooth surfaces",
    color: "#26c6da"
  },
  {
    id: "feature-3",
    position: [0.8, -1.2, -0.8],
    title: "Interactive Elements",
    description: "Touch-responsive 3D interactions",
    color: "#00e5ff"
  }
];

const Hotspot = ({ hotspot }: { hotspot: HotspotData }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(hovered ? scale * 1.3 : scale);
    }
  });

  return (
    <group position={hotspot.position}>
      {/* Hotspot Sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={hotspot.color || "#4fc3f7"}
          emissive={hotspot.color || "#4fc3f7"}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          transparent
          opacity={hovered ? 0.9 : 0.7}
        />
      </mesh>

      {/* Hotspot Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.12, 16]} />
        <meshBasicMaterial
          color={hotspot.color || "#4fc3f7"}
          transparent
          opacity={hovered ? 0.5 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Info Panel */}
      {(hovered || clicked) && (
        <Html
          position={[0, 0.3, 0]}
          center
          distanceFactor={10}
          zIndexRange={[100, 0]}
        >
          <div className="glass-strong rounded-xl p-3 max-w-xs pointer-events-none animate-fade-in">
            <h4 className="font-semibold text-sm text-foreground mb-1">
              {hotspot.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {hotspot.description}
            </p>
          </div>
        </Html>
      )}

      {/* Connecting Line */}
      {(hovered || clicked) && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([0, 0, 0, 0, 0.3, 0])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={hotspot.color || "#4fc3f7"}
            transparent
            opacity={0.6}
            linewidth={2}
          />
        </line>
      )}
    </group>
  );
};

export const Hotspots = () => {
  return (
    <group>
      {hotspotData.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} />
      ))}
    </group>
  );
};