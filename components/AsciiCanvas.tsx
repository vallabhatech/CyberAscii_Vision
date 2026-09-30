import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AsciiOptions } from '../types';
import { getAsciiChar } from '../utils/asciiConverter';
import { playScanSound, playStartupSound, startAmbientHum, stopAmbientHum } from '../utils/soundEffects';
import { Camera } from 'lucide-react';

interface AsciiCanvasProps { options: AsciiOptions; }

const MAX_FPS = 30;
const MAX_COLUMNS = 220;
const MAX_ROWS = 140;
const INERTIA = 0.75;

export const AsciiCanvas: React.FC<AsciiCanvasProps> = ({ options }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameRef = useRef<Float32Array | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameAtRef = useRef(0);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const hiddenContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let disposed = false;
    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) { setError('Camera API is unavailable in this browser.'); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280, max: 1920 }, height: { ideal: 720, max: 1080 }, facingMode: 'user' },
          audio: false,
        });
        if (disposed || !videoRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        playStartupSound();
        startAmbientHum();
      } catch (err) {
        console.error('Camera initialization failed:', err);
        setError('Unable to access camera. Please allow camera permissions and reload.');
      }
    };
    startCamera();
    return () => { disposed = true; stream?.getTracks().forEach(track => track.stop()); stopAmbientHum(); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const resize = () => {
      const width = Math.max(1, Math.floor(parent.clientWidth));
      const height = Math.max(1, Math.floor(parent.clientHeight));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height;
        canvasContextRef.current = canvas.getContext('2d', { alpha: false });
        prevFrameRef.current = null;
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(parent); resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    hiddenContextRef.current = hiddenCanvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
  }, []);

  useEffect(() => { prevFrameRef.current = null; }, [options.fontSize, options.resolution]);

  const renderFrame = useCallback((timestamp: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const ctx = canvasContextRef.current;
    const hiddenCtx = hiddenContextRef.current;
    if (!video || !canvas || !hiddenCanvas || !ctx || !hiddenCtx || video.readyState < 2) return;
    if (timestamp - lastFrameAtRef.current < 1000 / MAX_FPS) return;
    lastFrameAtRef.current = timestamp;

    const baseCharWidth = options.fontSize * 0.6;
    const displayCols = Math.max(1, Math.floor(canvas.width / baseCharWidth));
    const displayRows = Math.max(1, Math.floor(canvas.height / options.fontSize));
    const sampleCols = Math.max(24, Math.min(MAX_COLUMNS, Math.floor(displayCols * options.resolution)));
    const sampleRows = Math.max(16, Math.min(MAX_ROWS, Math.floor(displayRows * options.resolution)));
    if (hiddenCanvas.width !== sampleCols || hiddenCanvas.height !== sampleRows) {
      hiddenCanvas.width = sampleCols; hiddenCanvas.height = sampleRows; prevFrameRef.current = null;
    }

    hiddenCtx.save(); hiddenCtx.translate(sampleCols, 0); hiddenCtx.scale(-1, 1);
    hiddenCtx.drawImage(video, 0, 0, sampleCols, sampleRows); hiddenCtx.restore();
    const frameData = hiddenCtx.getImageData(0, 0, sampleCols, sampleRows);
    const data = frameData.data;
    if (!prevFrameRef.current || prevFrameRef.current.length !== data.length) {
      prevFrameRef.current = new Float32Array(data.length); prevFrameRef.current.set(data);
    }
    const prev = prevFrameRef.current;
    for (let i = 0; i < data.length; i++) {
      const smoothed = prev[i] + (data[i] - prev[i]) * (1 - INERTIA);
      prev[i] = smoothed; data[i] = smoothed;
    }

    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cellWidth = canvas.width / sampleCols;
    const cellHeight = canvas.height / sampleRows;
    ctx.font = Math.max(6, Math.floor(cellHeight)) + "px 'JetBrains Mono', monospace";
    ctx.textBaseline = 'top';
    const contrastFactor = (259 * (options.contrast * 255 + 255)) / (255 * (259 - options.contrast * 255));

    if (options.colorMode === 'color') {
      for (let y = 0; y < sampleRows; y++) {
        for (let x = 0; x < sampleCols; x++) {
          const offset = (y * sampleCols + x) * 4;
          const r = data[offset], g = data[offset + 1], b = data[offset + 2];
          let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          brightness = contrastFactor * (brightness - 128) + 128;
          brightness = Math.max(0, Math.min(255, brightness * options.brightness));
          ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
          ctx.fillText(getAsciiChar(brightness, options.density), x * cellWidth, y * cellHeight);
        }
      }
    } else {
      ctx.fillStyle = options.colorMode === 'matrix' ? '#00ff41' : options.colorMode === 'retro' ? '#ffb000' : '#fff';
      for (let y = 0; y < sampleRows; y++) {
        let rowText = '';
        for (let x = 0; x < sampleCols; x++) {
          const offset = (y * sampleCols + x) * 4;
          const r = data[offset], g = data[offset + 1], b = data[offset + 2];
          let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          brightness = contrastFactor * (brightness - 128) + 128;
          brightness = Math.max(0, Math.min(255, brightness * options.brightness));
          rowText += getAsciiChar(brightness, options.density);
        }
        ctx.fillText(rowText, 0, y * cellHeight);
      }
    }
  }, [options]);

  useEffect(() => {
    let active = true;
    const loop = (timestamp: number) => {
      if (!active) return;
      if (document.visibilityState === 'visible') renderFrame(timestamp);
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    const onVisibilityChange = () => { if (document.visibilityState === 'visible') lastFrameAtRef.current = 0; };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      active = false;
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [renderFrame]);

  const handleScreenshotClick = () => {
    if (!canvasRef.current) return;
    playScanSound();
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = 'cyber_ascii_' + Date.now() + '.png';
    link.click();
  };

  return (
    <div className="relative w-full h-full bg-black">
      {error && <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-red-500 z-50 p-6 text-center"><p>{error}</p></div>}
      <video ref={videoRef} className="absolute top-0 left-0 opacity-0 pointer-events-none -z-10 w-1 h-1" playsInline autoPlay muted />
      <canvas ref={hiddenCanvasRef} className="hidden" />
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40">
        <button onClick={handleScreenshotClick} className="bg-black/60 hover:bg-green-900/80 text-green-400 border border-green-500/50 p-4 rounded-full backdrop-blur-md transition-all active:scale-95 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]" title="Save Snapshot" aria-label="Save snapshot">
          <Camera className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};