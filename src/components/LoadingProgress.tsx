import { useProgress } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export const LoadingProgress = () => {
  const { progress, active } = useProgress();

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl max-w-md w-full mx-4">
          
          {/* Loading Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-glow" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Loading 3D Scene
            </h3>
            <p className="text-muted-foreground text-sm">
              Initializing advanced rendering pipeline...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <Progress 
              value={progress} 
              className="w-full h-2 bg-secondary"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loading assets</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="mt-6 space-y-2">
            <div className={`flex items-center gap-2 text-xs ${
              progress > 20 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                progress > 20 ? 'bg-primary animate-pulse-glow' : 'bg-muted'
              }`} />
              <span>Initializing WebGL context</span>
            </div>
            
            <div className={`flex items-center gap-2 text-xs ${
              progress > 50 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                progress > 50 ? 'bg-primary animate-pulse-glow' : 'bg-muted'
              }`} />
              <span>Loading 3D models</span>
            </div>
            
            <div className={`flex items-center gap-2 text-xs ${
              progress > 80 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                progress > 80 ? 'bg-primary animate-pulse-glow' : 'bg-muted'
              }`} />
              <span>Setting up lighting</span>
            </div>
            
            <div className={`flex items-center gap-2 text-xs ${
              progress > 95 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                progress > 95 ? 'bg-primary animate-pulse-glow' : 'bg-muted'
              }`} />
              <span>Finalizing scene</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};