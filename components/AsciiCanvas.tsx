import React, { useRef, useEffect, useState } from 'react';
import { AsciiOptions } from '../types';
import { getAsciiChar } from '../utils/asciiConverter';
import { playStartupSound, playScanSound, startAmbientHum, stopAmbientHum } from '../utils/soundEffects';
import { ScanEye, Camera } from 'lucide-react';

interface AsciiCanvasProps {
  options: AsciiOptions;
  onCapture: (imageData: string) => void;
}

export const AsciiCanvas: React.FC<AsciiCanvasProps> = ({ options, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null); // For processing pixels
  const prevFrameRef = useRef<Float32Array | null>(null); // Store previous frame for smoothing
  const animationRef = useRef<number>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 }, 
            facingMode: 'user' 
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Ensure video actually plays
          await videoRef.current.play().catch(e => console.error("Play error:", e));
          
          // Play sci-fi startup sound when camera is ready
          playStartupSound();
          // Start the continuous background hum
          startAmbientHum();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please allow permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      stopAmbientHum();
    };
  }, []);

  // Handle Canvas Resizing
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            // Check parent size to avoid scrollbar issues, fallback to window
            const parent = canvasRef.current.parentElement;
            if (parent) {
                canvasRef.current.width = parent.clientWidth;
                canvasRef.current.height = parent.clientHeight;
            } else {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Reset smoothing buffer when dimensions likely change
    prevFrameRef.current = null;
  }, [options.fontSize]);

  useEffect(() => {
    const renderLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const hiddenCanvas = hiddenCanvasRef.current;
      
      // Check if video has enough data. readyState >= 2 is HAVE_CURRENT_DATA
      if (!video || !canvas || !hiddenCanvas || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const ctx = canvas.getContext('2d', { alpha: false });
      const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

      if (!ctx || !hiddenCtx) {
          animationRef.current = requestAnimationFrame(renderLoop);
          return;
      }

      // Determine processing resolution
      const charHeight = options.fontSize;
      const charWidth = charHeight * 0.6; // Approximation for monospace aspect ratio
      
      const cols = Math.floor(canvas.width / charWidth);
      const rows = Math.floor(canvas.height / charHeight);

      // Safety check for zero dimensions
      if (cols <= 0 || rows <= 0) {
        animationRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Set hidden canvas size to the number of chars (cols x rows)
      if (hiddenCanvas.width !== cols || hiddenCanvas.height !== rows) {
        hiddenCanvas.width = cols;
        hiddenCanvas.height = rows;
        prevFrameRef.current = null; // Reset smoothing buffer on resize
      }

      // 1. Draw video to small hidden canvas
      // We flip horizontally for a natural mirror effect
      hiddenCtx.save();
      hiddenCtx.translate(cols, 0);
      hiddenCtx.scale(-1, 1);
      hiddenCtx.drawImage(video, 0, 0, cols, rows);
      hiddenCtx.restore();
      
      // 2. Get pixel data
      const frameData = hiddenCtx.getImageData(0, 0, cols, rows);
      const data = frameData.data;

      // --- TEMPORAL SMOOTHING START ---
      // Blend current frame with previous frame to reduce ASCII jitter
      const pixelCount = data.length;
      
      // Initialize buffer if needed
      if (!prevFrameRef.current || prevFrameRef.current.length !== pixelCount) {
        prevFrameRef.current = new Float32Array(pixelCount);
        for(let i=0; i<pixelCount; i++) prevFrameRef.current[i] = data[i];
      }

      const prev = prevFrameRef.current;
      // Smoothing factor: 0.0 = no smoothing, 0.9 = very slow trails. 
      // 0.75 provides a very smooth, liquid-like effect.
      const inertia = 0.75; 

      for (let i = 0; i < pixelCount; i++) {
        // Simple Low-pass filter
        // val = prev + (target - prev) * (1 - inertia)
        const target = data[i];
        const current = prev[i];
        const newValue = current + (target - current) * (1 - inertia);
        
        prev[i] = newValue;
        data[i] = newValue; // Update the view for rendering
      }
      // --- TEMPORAL SMOOTHING END ---

      // 3. Clear main canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 4. Setup Font
      ctx.font = `${options.fontSize}px 'JetBrains Mono', monospace`;
      ctx.textBaseline = 'top';

      // 5. Build and Draw ASCII
      const contrastFactor = (259 * (options.contrast * 255 + 255)) / (255 * (259 - options.contrast * 255));

      if (options.colorMode === 'color') {
          // Full Color Mode
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const offset = (y * cols + x) * 4;
                const r = data[offset];
                const g = data[offset + 1];
                const b = data[offset + 2];
                
                // Calculate brightness
                let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                brightness = contrastFactor * (brightness - 128) + 128;
                brightness *= options.brightness;
                brightness = Math.max(0, Math.min(255, brightness));

                const char = getAsciiChar(brightness, options.density);
                
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillText(char, x * charWidth, y * charHeight);
            }
          }
      } else {
          // Monochromatic / Matrix Modes
          if (options.colorMode === 'matrix') ctx.fillStyle = '#00ff41'; // Matrix Green
          else if (options.colorMode === 'retro') ctx.fillStyle = '#ffb000'; // Amber
          else ctx.fillStyle = '#ffffff'; // BW

          for (let y = 0; y < rows; y++) {
            let rowText = "";
            for (let x = 0; x < cols; x++) {
                const offset = (y * cols + x) * 4;
                const r = data[offset];
                const g = data[offset + 1];
                const b = data[offset + 2];
                
                let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                brightness = contrastFactor * (brightness - 128) + 128;
                brightness *= options.brightness;
                brightness = Math.max(0, Math.min(255, brightness));

                rowText += getAsciiChar(brightness, options.density);
            }
            ctx.fillText(rowText, 0, y * charHeight);
          }
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    animationRef.current = requestAnimationFrame(renderLoop);

    // Cleanup function to prevent zombie loops when options change
    return () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    };
  }, [options]);

  const handleCaptureClick = () => {
    if (canvasRef.current) {
        playScanSound();
        // We capture the visible canvas (The ASCII Art)
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onCapture(dataUrl);
    }
  };

  const handleScreenshotClick = () => {
    if (canvasRef.current) {
      playScanSound();
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `cyber_ascii_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
        {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-red-500 z-50">
                <p>{error}</p>
            </div>
        )}
        {/* Important: Video must not be display:none for textures to update in some browsers. 
            Using opacity-0 and z-index -1 keeps it in the DOM but invisible. */}
        <video 
            ref={videoRef} 
            className="absolute top-0 left-0 opacity-0 pointer-events-none -z-10 w-1 h-1" 
            playsInline 
            autoPlay 
            muted 
        />
        <canvas ref={hiddenCanvasRef} className="hidden" />
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        {/* Floating Controls Container */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex items-center gap-8 z-40">
            {/* Screenshot Button */}
            <button 
                onClick={handleScreenshotClick}
                className="bg-black/60 hover:bg-green-900/80 text-green-400 border border-green-500/50 p-4 rounded-full backdrop-blur-md transition-all active:scale-95 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                title="Save Snapshot"
            >
                <Camera className="w-6 h-6" />
            </button>

            {/* Scan & Analyze Button (Primary) */}
            <button 
                onClick={handleCaptureClick}
                className="bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/50 p-6 rounded-full backdrop-blur-md transition-all active:scale-95 group relative hover:shadow-[0_0_25px_rgba(0,255,0,0.5)]"
                title="Scan & Analyze"
            >
                <div className="absolute inset-0 rounded-full border border-green-500 opacity-50 animate-ping"></div>
                <ScanEye className="w-8 h-8" />
            </button>
        </div>
    </div>
  );
};