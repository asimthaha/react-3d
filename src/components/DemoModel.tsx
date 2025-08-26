import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";
import { ViewMode } from "./ProductViewer";

interface DemoModelProps {
  viewMode: ViewMode;
}

export const DemoModel = ({ viewMode }: DemoModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
    
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  // Material properties based on view mode
  const getMaterialProps = () => {
    switch (viewMode) {
      case "wireframe":
        return { 
          roughness: 0.2,
          metalness: 0.8,
          wireframe: true, 
          transparent: true, 
          opacity: 0.8,
          color: "#4fc3f7"
        };
      case "solid":
        return { 
          roughness: 0.2,
          metalness: 0.8,
          color: "#2196f3",
          emissive: "#0d47a1",
          emissiveIntensity: 0.1
        };
      case "textured":
        return { 
          roughness: 0.3,
          metalness: 0.6,
          color: "#1976d2"
        };
      case "normal":
        return { 
          roughness: 0.2,
          metalness: 0.8,
          color: "#64b5f6"
        };
      default:
        return {
          roughness: 0.2,
          metalness: 0.8,
          color: "#2196f3"
        };
    }
  };

  const materialProps = getMaterialProps();

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main central sphere */}
      <Sphere ref={sphereRef} args={[1, 64, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial {...materialProps} />
      </Sphere>

      {/* Orbiting torus */}
      <Torus 
        ref={torusRef} 
        args={[0.4, 0.15, 16, 100]} 
        position={[2.5, 0, 0]}
      >
        <meshStandardMaterial 
          {...materialProps} 
          color={viewMode === "wireframe" ? "#29b6f6" : "#1565c0"}
        />
      </Torus>

      {/* Secondary sphere */}
      <Sphere args={[0.3, 32, 16]} position={[-2, 1, 0]}>
        <meshStandardMaterial 
          {...materialProps} 
          color={viewMode === "wireframe" ? "#26c6da" : "#0277bd"}
          emissive={viewMode === "solid" ? "#004d40" : "#000000"}
          emissiveIntensity={viewMode === "solid" ? 0.2 : 0}
        />
      </Sphere>

      {/* Floating cubes */}
      <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.05} position={[1.5, 2, -1]}>
        <meshStandardMaterial 
          {...materialProps} 
          color={viewMode === "wireframe" ? "#00e5ff" : "#01579b"}
        />
      </RoundedBox>

      <RoundedBox args={[0.3, 0.3, 0.3]} radius={0.03} position={[-1.8, -1.5, 1.2]}>
        <meshStandardMaterial 
          {...materialProps} 
          color={viewMode === "wireframe" ? "#18ffff" : "#0288d1"}
        />
      </RoundedBox>

      <RoundedBox args={[0.2, 0.2, 0.2]} radius={0.02} position={[2.2, -1.2, -0.8]}>
        <meshStandardMaterial 
          {...materialProps} 
          color={viewMode === "wireframe" ? "#84ffff" : "#0277bd"}
        />
      </RoundedBox>
    </group>
  );
};