import { Suspense, useState, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "react-error-boundary";
import { Scene } from "./Scene";
import { ViewerControls } from "./ViewerControls";
import { LoadingProgress } from "./LoadingProgress";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { ScreenshotCapture } from "./ScreenshotCapture";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Maximize2, 
  RotateCcw, 
  Camera,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

export type ViewMode = "solid" | "wireframe" | "textured" | "normal";

interface ProductViewerProps {
  modelUrl?: string;
  title?: string;
  description?: string;
}

export const ProductViewer = ({ 
  modelUrl, 
  title = "3D Product Showcase",
  description = "Interactive 3D product viewer with advanced controls"
}: ProductViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("solid");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);

  const handleScreenshot = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_screenshot.png`;
      link.href = dataURL;
      link.click();
      
      toast.success("Screenshot captured successfully!");
    }
  }, [title]);

  const handleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleReset = useCallback(() => {
    // This will be handled by the Scene component through refs
    toast.success("View reset to default");
  }, []);

  const handleError = useCallback((error: Error, errorInfo: any) => {
    console.error('3D Viewer Error:', error, errorInfo);
    setError(error.message);
    toast.error("3D viewer encountered an error. Please refresh the page.");
  }, []);

  return (
    <div className={`relative w-full h-screen viewer-container overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="glass-strong rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              <PerformanceMonitor fps={fps} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowControls(!showControls)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 3D Canvas */}
      <ErrorBoundary
        FallbackComponent={({ error }) => (
          <div className="flex items-center justify-center h-full bg-viewer-bg">
            <div className="glass p-8 rounded-2xl text-center max-w-md">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3D Viewer Error</h3>
              <p className="text-muted-foreground mb-4">
                {error?.message || "Failed to initialize 3D viewer"}
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        )}
        onError={handleError}
      >
        <Canvas
          ref={canvasRef}
          camera={{
            position: [0, 0, 5],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          className="!absolute !inset-0"
        >
          <Suspense fallback={null}>
            <Scene
              viewMode={viewMode}
              autoRotate={autoRotate}
              modelUrl={modelUrl}
              onLoadingChange={setLoading}
              onFpsChange={setFps}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Loading Overlay */}
      {loading && <LoadingProgress />}

      {/* Controls Panel */}
      {showControls && (
        <ViewerControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          autoRotate={autoRotate}
          onAutoRotateChange={setAutoRotate}
          onReset={handleReset}
          onScreenshot={handleScreenshot}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
        />
      )}

      {/* Quick Actions */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleScreenshot}
            className="glass-strong shadow-glow"
          >
            <Camera className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleReset}
            className="glass-strong shadow-glow"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleFullscreen}
            className="glass-strong shadow-glow"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Screenshot Component */}
      <ScreenshotCapture canvasRef={canvasRef} />
    </div>
  );
};