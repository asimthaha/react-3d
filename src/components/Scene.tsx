import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  useProgress,
  Html,
  ContactShadows,
  Float,
  Text,
  Sparkles,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import { ViewMode } from "./ProductViewer";
import { DemoModel } from "./DemoModel";
import { Hotspots } from "./Hotspots";

// Simplified post-processing effects with better error handling
const PostProcessingEffects = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if post-processing is supported and safe to use
    const checkPostProcessingSupport = () => {
      try {
        // Simple test to see if we can create basic post-processing effects
        if (typeof window !== "undefined" && window.WebGLRenderingContext) {
          // Delay enabling to avoid initial render issues
          setTimeout(() => {
            setIsEnabled(true);
          }, 1000);
        }
      } catch (error) {
        console.warn(
          "Post-processing effects disabled due to compatibility issues:",
          error
        );
      }
    };

    checkPostProcessingSupport();
  }, []);

  // Return null to disable post-processing effects
  if (!isEnabled) {
    return null;
  }

  // For now, return null to avoid the post-processing library issues
  // This can be re-enabled when the library compatibility is resolved
  return null;
};

interface SceneProps {
  viewMode: ViewMode;
  autoRotate: boolean;
  modelUrl?: string;
  onLoadingChange: (loading: boolean) => void;
  onFpsChange: (fps: number) => void;
}

export const Scene = ({
  viewMode,
  autoRotate,
  modelUrl,
  onLoadingChange,
  onFpsChange,
}: SceneProps) => {
  const { progress } = useProgress();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const modelRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  // FPS Monitoring
  useFrame((state) => {
    const now = performance.now();
    setFrameCount((prev) => prev + 1);

    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      onFpsChange(fps);
      setFrameCount(0);
      setLastTime(now);
    }
  });

  // Loading state management
  useEffect(() => {
    onLoadingChange(progress < 100);
  }, [progress, onLoadingChange]);

  // Material update based on view mode
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child: THREE.Object3D) => {
        if (
          (child as THREE.Mesh).isMesh &&
          (child as THREE.Mesh).material &&
          typeof (child as THREE.Mesh).material === "object"
        ) {
          const material = (child as THREE.Mesh).material;

          // Ensure material has the necessary properties before accessing them
          if (
            "wireframe" in material &&
            "transparent" in material &&
            "opacity" in material
          ) {
            switch (viewMode) {
              case "wireframe":
                material.wireframe = true;
                material.transparent = true;
                material.opacity = 0.8;
                break;
              case "solid":
                material.wireframe = false;
                material.transparent = false;
                material.opacity = 1;
                break;
              case "textured":
                material.wireframe = false;
                material.transparent = false;
                material.opacity = 1;
                break;
              case "normal":
                material.wireframe = false;
                material.transparent = false;
                material.opacity = 1;
                break;
            }
            material.needsUpdate = true;
          }
        }
      });
    }
  }, [viewMode]);

  return (
    <>
      {/* Camera Setup */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        minDistance={2}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        dampingFactor={0.05}
        enableDamping={true}
      />

      {/* Lighting Setup */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 0, -20]} intensity={0.8} color="#4fc3f7" />
      <pointLight position={[10, -10, 10]} intensity={0.6} color="#29b6f6" />

      {/* Environment */}
      <Environment preset="studio" background={false} blur={0.8} />

      {/* Main Model */}
      <group ref={modelRef}>
        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.3}
          floatingRange={[-0.1, 0.1]}
        >
          {modelUrl ? (
            // Load custom model if provided
            <Html center>
              <div className="text-white">Loading custom model...</div>
            </Html>
          ) : (
            <DemoModel viewMode={viewMode} />
          )}
        </Float>
      </group>

      {/* Hotspots */}
      <Hotspots />

      {/* Ground Plane */}
      <ContactShadows
        opacity={0.3}
        scale={10}
        blur={2}
        far={10}
        resolution={256}
        color="#000000"
      />

      {/* Sparkles Effect */}
      <Sparkles
        count={50}
        scale={[10, 10, 10]}
        size={2}
        speed={0.4}
        opacity={0.6}
        color="#4fc3f7"
      />

      {/* Post-processing Effects */}
      <PostProcessingEffects />
    </>
  );
};
