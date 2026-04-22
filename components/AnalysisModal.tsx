import React from 'react';
import { AnalysisResult } from '../types';
import { X, ShieldAlert, Cpu, Activity } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: AnalysisResult | null;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, isLoading, result }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-black border border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.2)] overflow-hidden font-mono">
        
        {/* Scanner Line Animation */}
        {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_#0f0] animate-[scan_2s_ease-in-out_infinite]"></div>
        )}

        {/* Header */}
        <div className="bg-green-900/20 p-4 border-b border-green-500/50 flex justify-between items-center">
            <h2 className="text-green-500 text-lg font-bold flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                NEURAL ANALYSIS
            </h2>
            <button onClick={onClose} className="text-green-700 hover:text-green-400">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 text-green-400 min-h-[300px] flex flex-col justify-center">
            {isLoading ? (
                <div className="space-y-4 text-center">
                    <div className="text-xl animate-pulse">UPLOADING VISUAL DATA...</div>
                    <div className="text-xs text-green-700">
                        packet_loss: 0% <br/>
                        encryption: AES-256 <br/>
                        target_lock: ACQUIRED
                    </div>
                </div>
            ) : result ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Threat Level */}
                    <div className="border border-green-800 p-4 bg-green-900/10 flex items-center justify-between">
                        <span className="text-xs text-green-600">THREAT LEVEL ASSESSMENT</span>
                        <div className={`text-xl font-bold flex items-center gap-2 ${
                            result.threatLevel.includes('HIGH') || result.threatLevel.includes('CRITICAL') ? 'text-red-500' : 'text-green-400'
                        }`}>
                            <ShieldAlert className="w-5 h-5" />
                            {result.threatLevel}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-xs text-green-600 border-b border-green-900 pb-1">SUBJECT ANALYSIS</h3>
                        <p className="leading-relaxed text-sm typewriter">
                            {result.description}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <h3 className="text-xs text-green-600 border-b border-green-900 pb-1">IDENTIFIED ATTRIBUTES</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.tags.map((tag, i) => (
                                <span key={i} className="text-xs border border-green-500/50 px-2 py-1 bg-green-500/10 rounded-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button onClick={onClose} className="text-xs bg-green-600 hover:bg-green-500 text-black px-4 py-2 font-bold uppercase">
                            Close File
                        </button>
                    </div>

                </div>
            ) : (
                <div className="text-center text-red-500">DATA CORRUPTED.</div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-green-900/20 p-2 border-t border-green-500/50 flex justify-between text-[10px] text-green-800">
            <span>TERMINAL_ID: 884-X</span>
            <span className="animate-pulse">CONNECTED</span>
        </div>

      </div>
      <style>{`
        @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
        }
      `}</style>
    </div>
  );
};