import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Box, 
  Grid3x3, 
  Palette, 
  Eye,
  RotateCcw,
  Camera,
  Maximize2,
  Minimize2,
  Play,
  Pause
} from "lucide-react";
import { ViewMode } from "./ProductViewer";

interface ViewerControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  autoRotate: boolean;
  onAutoRotateChange: (enabled: boolean) => void;
  onReset: () => void;
  onScreenshot: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
}

const viewModes: Array<{
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    id: "solid",
    label: "Solid",
    icon: <Box className="w-4 h-4" />,
    description: "Solid shaded view"
  },
  {
    id: "wireframe", 
    label: "Wireframe",
    icon: <Grid3x3 className="w-4 h-4" />,
    description: "Wireframe mesh view"
  },
  {
    id: "textured",
    label: "Textured", 
    icon: <Palette className="w-4 h-4" />,
    description: "Textured material view"
  },
  {
    id: "normal",
    label: "Normal",
    icon: <Eye className="w-4 h-4" />,
    description: "Normal mapping view"
  }
];

export const ViewerControls = ({
  viewMode,
  onViewModeChange,
  autoRotate,
  onAutoRotateChange,
  onReset,
  onScreenshot,
  onFullscreen,
  isFullscreen
}: ViewerControlsProps) => {
  return (
    <div className="absolute bottom-6 left-6 z-20">
      <div className="control-panel rounded-2xl p-4 space-y-4 max-w-sm">
        
        {/* View Mode Selection */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-foreground">View Mode</h3>
          <div className="grid grid-cols-2 gap-2">
            {viewModes.map((mode) => (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange(mode.id)}
                className={`justify-start h-auto p-3 ${
                  viewMode === mode.id 
                    ? 'bg-primary text-primary-foreground shadow-glow' 
                    : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    {mode.icon}
                    <span className="text-xs font-medium">{mode.label}</span>
                  </div>
                  <span className="text-xs opacity-70">{mode.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Animation Controls */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-foreground">Animation</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {autoRotate ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="text-sm">Auto Rotate</span>
            </div>
            <Switch
              checked={autoRotate}
              onCheckedChange={onAutoRotateChange}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-foreground">Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onReset}
              className="flex flex-col items-center gap-1 h-auto p-2 bg-secondary/50 hover:bg-secondary/70"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs">Reset</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onScreenshot}
              className="flex flex-col items-center gap-1 h-auto p-2 bg-secondary/50 hover:bg-secondary/70"
            >
              <Camera className="w-4 h-4" />
              <span className="text-xs">Capture</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onFullscreen}
              className="flex flex-col items-center gap-1 h-auto p-2 bg-secondary/50 hover:bg-secondary/70"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="text-xs">
                {isFullscreen ? 'Exit' : 'Full'}
              </span>
            </Button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-2 pt-2">
          <Badge variant="secondary" className="text-xs bg-secondary/50">
            WebGL 2.0
          </Badge>
          <Badge variant="secondary" className="text-xs bg-secondary/50">
            PBR Ready
          </Badge>
        </div>
      </div>
    </div>
  );
};