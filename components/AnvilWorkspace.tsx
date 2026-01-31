import React, { useState, useEffect } from 'react';
import { VisualizationPane } from './VisualizationPane';
import { Blueprint, ForgeSettings } from '../types';
import { generateBlueprint } from '../services/geminiService';
import { Hammer } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface AnvilWorkspaceProps {
  settings: ForgeSettings;
  onBlueprintGenerated: (blueprint: Blueprint) => void;
  currentBlueprint: Blueprint | null;
  input: string;
  setInput: (val: string) => void;
}

export const AnvilWorkspace: React.FC<AnvilWorkspaceProps> = ({
  settings,
  onBlueprintGenerated,
  currentBlueprint,
  input,
  setInput
}) => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'complete'>('idle');

  const { playForgeStart, startForgingLoop, stopForgingLoop, playForgeSuccess } = useSoundEffects();

  // If a blueprint is loaded externally (restored from graveyard), update local state
  useEffect(() => {
    if (currentBlueprint) {
      setStatus('complete');
    } else {
      setStatus('idle');
    }
  }, [currentBlueprint]);

  const handleForge = async () => {
    if (!input.trim() || status === 'generating') return;

    // Start Audio Experience
    playForgeStart();
    startForgingLoop();

    setStatus('generating');
    try {
      const blueprint = await generateBlueprint(input, settings);

      // Stop loop and play success
      stopForgingLoop();
      playForgeSuccess();

      onBlueprintGenerated(blueprint);
      setStatus('complete');
      setInput(''); // Clear input on success
    } catch (error) {
      console.error(error);
      stopForgingLoop(); // Stop loop on error
      setStatus('idle');
      alert("The Forge failed to strike. Check console.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleForge();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-void relative">

      {/* Visualization Pane (Top/Center) */}
      <div className="flex-1 relative flex flex-col min-h-0">
        <VisualizationPane status={status} blueprint={currentBlueprint} />
      </div>

      {/* Input Block (Bottom) */}
      <div className="h-auto border-t border-zinc-800 p-6 bg-void shrink-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex gap-4 items-end max-w-4xl mx-auto w-full">
          <div className="flex-1 relative">
            <label className="block text-[10px] text-zinc-500 font-mono mb-1 tracking-widest uppercase">
                // Input Stream
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="// DUMP NEW IDEA HERE..."
              className="w-full bg-zinc-900/30 border border-zinc-800 text-zinc-300 font-mono text-sm p-4 h-24 focus:outline-none focus:border-magma-500/50 focus:text-magma-100 focus:shadow-[0_0_15px_rgba(249,115,22,0.1)] resize-none placeholder-zinc-700 transition-all"
            />
          </div>

          <button
            onClick={handleForge}
            disabled={status === 'generating' || !input.trim()}
            className={`
                h-24 px-8 border-2 font-mono text-lg font-bold tracking-widest uppercase flex flex-col items-center justify-center gap-2 transition-all duration-300
                ${status === 'generating'
                ? 'border-magma-900 text-magma-700 cursor-not-allowed bg-magma-950/20'
                : 'border-magma-600 text-magma-500 bg-magma-900/10 hover:border-magma-400 hover:text-magma-300 hover:bg-magma-500/20 hover:shadow-[0_0_25px_rgba(249,115,22,0.2)]'
              }
            `}
          >
            <Hammer
              size={24}
              className={status === 'generating' ? 'animate-hammer text-magma-400' : 'text-magma-600'}
            />
            {status === 'generating' ? 'FORGING' : 'FORGE'}
          </button>
        </div>
      </div>

    </div>
  );
};