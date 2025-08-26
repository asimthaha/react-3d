import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface PerformanceMonitorProps {
  fps: number;
}

export const PerformanceMonitor = ({ fps }: PerformanceMonitorProps) => {
  const getFpsColor = () => {
    if (fps >= 55) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (fps >= 30) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getFpsColor()} flex items-center gap-1 px-2 py-1`}
    >
      <Activity className="w-3 h-3" />
      <span className="text-xs font-medium">{fps} FPS</span>
    </Badge>
  );
};