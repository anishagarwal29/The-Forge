import React from 'react';
import { Blueprint } from '../types';
import { Box, Layers, Cpu, Activity } from 'lucide-react';

interface VisualizationPaneProps {
    status: 'idle' | 'generating' | 'complete';
    blueprint: Blueprint | null;
}

// The idle animation: Large orange circles
const IdleMesh = () => (
    <div className="flex flex-col items-center justify-center opacity-80">
        <div className="relative w-96 h-96 flex items-center justify-center">
            {/* Outer Ring - Slow Rotate */}
            <div className="absolute inset-0 border border-magma-900/80 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
            {/* Inner Ring - Fast Reverse Rotate */}
            <div className="absolute inset-16 border-2 border-magma-600/80 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>

            {/* Rotating Text */}
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <span className="font-mono text-7xl tracking-widest text-magma-900/50 font-black select-none">MESH</span>
            </div>
        </div>
    </div>
);

// The loading animation
const MeshSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <div className="relative w-[30rem] h-[30rem] border border-magma-500/30 rounded-full animate-mesh-spin">
            <div className="absolute inset-8 border border-magma-500/20 rounded-full border-dashed"></div>
            <div className="absolute inset-24 border border-magma-500/10 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-magma-500/30"></div>
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-magma-500/30"></div>
        </div>
        <div className="absolute text-magma-500 font-mono text-xs tracking-[0.2em] animate-pulse bg-void px-3 py-1 border border-magma-900 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            FORGING BLUEPRINT
        </div>
    </div>
);

const BlueprintCard = ({ data }: { data: Blueprint }) => (
    <div className="w-full h-full p-8 overflow-y-auto animate-in fade-in zoom-in-95 duration-500 scrollbar-hide">

        <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-20">
            {/* Header - Fixed Layout to prevent overlap */}
            <div className="border-b border-zinc-800 pb-6">

                {/* Metadata Row */}
                <div className="flex justify-between items-start mb-4">
                    <div className="text-[10px] text-zinc-700 font-mono tracking-widest">
                    // SYSTEM_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Est. Complexity</span>
                        <span className="text-magma-500 font-mono text-lg font-bold border border-magma-900/50 px-2 py-0.5 bg-magma-950/20">
                            {data.estimatedComplexity}
                        </span>
                    </div>
                </div>

                {/* Title Row */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 font-mono mb-4 uppercase tracking-tighter">
                        {data.title}
                    </h1>
                    <p className="text-xl text-magma-400/80 font-light italic">
                        "{data.tagline}"
                    </p>
                </div>
            </div>

            {/* Concept / Description */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 relative group hover:border-magma-900/50 transition-colors">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Box size={14} /> Concept
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-mono">
                    {data.description}
                </p>
            </div>

            {/* Tech Stack */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers size={14} /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                    {data.techStack.map(tech => (
                        <span key={tech} className="px-3 py-1.5 text-xs bg-zinc-900 text-magma-200/90 border border-zinc-700 rounded-sm">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Core Features */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu size={14} /> Core Features
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {data.coreFeatures.map((feat, idx) => (
                        <div key={idx} className="text-sm text-zinc-300 flex items-start gap-3 font-mono border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                            <span className="text-magma-600 mt-1">&gt;&gt;</span>
                            <span>{feat}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Architecture */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-zinc-600 uppercase tracking-wider mb-2">
                    <Activity size={14} />
                    <span>System Architecture / Data Flow</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-8 font-mono text-xs text-magma-100/80 whitespace-pre overflow-x-auto shadow-[inset_0_0_30px_rgba(0,0,0,1)] rounded-sm">
                    {data.architectureDiagram}
                </div>
            </div>
        </div>
    </div>
);

export const VisualizationPane: React.FC<VisualizationPaneProps> = ({ status, blueprint }) => {
    return (
        <div className="relative flex-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed overflow-hidden flex flex-col items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            {/* Glow Center - Re-added orange glow for ambiance */}
            <div className="absolute inset-0 bg-radial-gradient from-magma-900/10 to-void pointer-events-none"></div>

            {status === 'idle' && <IdleMesh />}

            {status === 'generating' && <MeshSpinner />}

            {status === 'complete' && blueprint && <BlueprintCard data={blueprint} />}

        </div>
    );
};