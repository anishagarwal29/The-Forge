import React, { useState, useEffect } from 'react';
import { Sliders, Zap, RefreshCw } from 'lucide-react';
import { ForgeSettings, Spark } from '../types';
import { generateSparks } from '../services/geminiService';

interface RemixStationProps {
  settings: ForgeSettings;
  onSettingsChange: (newSettings: ForgeSettings) => void;
  onSelectSpark: (text: string) => void;
}

export const RemixStation: React.FC<RemixStationProps> = ({ settings, onSettingsChange, onSelectSpark }) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [loadingSparks, setLoadingSparks] = useState(false);

  const fetchSparks = async () => {
    setLoadingSparks(true);
    const result = await generateSparks();
    const newSparks: Spark[] = result.map((item, i) => ({
      id: `live-${Date.now()}-${i}`,
      text: item.text,
      type: item.type as 'COMBO' | 'PIVOT' | 'WILD'
    }));
    setSparks(prev => [...newSparks, ...prev].slice(0, 10)); // Keep last 10
    setLoadingSparks(false);
  };

  useEffect(() => {
    fetchSparks();
  }, []);

  const handleSliderChange = (key: keyof ForgeSettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const getSliderBackground = (value: number) => {
    // Gradient from Magma Orange (#ea580c) to Dark Zinc (#27272a)
    return `linear-gradient(to right, #ea580c 0%, #ea580c ${value}%, #27272a ${value}%, #27272a 100%)`;
  };

  return (
    <div className="h-full flex flex-col border-l border-zinc-800 bg-void w-72 shrink-0 overflow-hidden">
      
      {/* Custom Styles for Slider */}
      <style>{`
        .forge-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            outline: none;
            transition: background 0.1s;
        }
        .forge-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 20px;
            border-radius: 1px;
            background: #f97316;
            cursor: pointer;
            border: 1px solid #7c2d12;
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.4);
            transition: all 0.2s;
        }
        .forge-slider::-webkit-slider-thumb:hover {
            background: #fff7ed;
            box-shadow: 0 0 15px rgba(249, 115, 22, 0.8);
            transform: scale(1.1);
            border-color: #fff7ed;
        }
        .forge-slider::-moz-range-thumb {
            width: 12px;
            height: 20px;
            border-radius: 1px;
            background: #f97316;
            cursor: pointer;
            border: 1px solid #7c2d12;
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.4);
        }
      `}</style>

      {/* Parameters Header */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-zinc-400 font-bold tracking-[0.2em] text-sm flex items-center gap-2">
          <Sliders size={16} /> MIXER_PARAMS
        </h2>
      </div>

      {/* Sliders */}
      <div className="p-6 space-y-8 border-b border-zinc-800">
        
        {/* Complexity */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-zinc-500 font-mono uppercase">
            <label>Complexity</label>
            <span className="text-zinc-300">{settings.complexity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.complexity}
            onChange={(e) => handleSliderChange('complexity', parseInt(e.target.value))}
            className="forge-slider"
            style={{ background: getSliderBackground(settings.complexity) }}
          />
          <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
             <span>Minimal</span>
             <span>Monolithic</span>
          </div>
        </div>

        {/* Chaos */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-zinc-500 font-mono uppercase">
            <label>Chaos / Abs</label>
            <span className="text-zinc-300">{settings.chaos}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.chaos}
            onChange={(e) => handleSliderChange('chaos', parseInt(e.target.value))}
            className="forge-slider"
            style={{ background: getSliderBackground(settings.chaos) }}
          />
           <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
             <span>Safe</span>
             <span>Eldritch</span>
          </div>
        </div>

      </div>

      {/* Random Sparks */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
          <h2 className="text-zinc-400 font-bold tracking-[0.2em] text-sm flex items-center gap-2">
            <Zap size={16} className={loadingSparks ? 'text-magma-500' : 'text-zinc-600'} /> SPARKS
          </h2>
          <button 
            onClick={fetchSparks} 
            disabled={loadingSparks}
            className={`text-zinc-600 hover:text-magma-500 transition-colors ${loadingSparks ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={14} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingSparks && sparks.length === 0 && (
                <div className="text-center text-zinc-700 animate-pulse text-xs">IGNITING...</div>
            )}
            {sparks.map((spark) => (
                <div 
                  key={spark.id} 
                  onClick={() => onSelectSpark(spark.text)}
                  className="border border-zinc-800 bg-zinc-900/10 p-3 rounded-sm relative overflow-hidden group hover:border-magma-600/50 hover:bg-zinc-900/30 transition-all cursor-pointer active:scale-95"
                >
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 bg-magma-600 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-200 font-mono leading-relaxed select-none">
                        {spark.text}
                    </p>
                    <div className="mt-2 text-[10px] text-zinc-700 font-bold uppercase tracking-widest group-hover:text-magma-700">
                        [{spark.type}]
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};