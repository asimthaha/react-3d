import { useCallback } from "react";

interface ScreenshotCaptureProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const ScreenshotCapture = ({ canvasRef }: ScreenshotCaptureProps) => {
  const captureScreenshot = useCallback((filename: string = "3d-viewer-screenshot.png") => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return dataURL;
    }
    return null;
  }, [canvasRef]);

  // This component doesn't render anything visible
  // It's used for screenshot functionality
  return null;
};