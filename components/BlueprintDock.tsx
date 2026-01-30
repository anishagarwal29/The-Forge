import React from 'react';
import { Download, Monitor } from 'lucide-react';
import { Blueprint } from '../types';

interface BlueprintDockProps {
  blueprint: Blueprint | null;
}

export const BlueprintDock: React.FC<BlueprintDockProps> = ({ blueprint }) => {
  const isDisabled = !blueprint;

  const handleExport = () => {
    if (!blueprint) return;
    const content = JSON.stringify(blueprint, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blueprint.title.replace(/\s+/g, '_').toLowerCase()}_blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStation = () => {
    if (!blueprint) return;

    // Construct the deep link
    const title = encodeURIComponent(blueprint.title);
    // Pre-fill Forge URL
    const currentUrl = encodeURIComponent(window.location.origin);
    const tags = "CS"; // User requested 'CS' tag
    const icon = "desktopcomputer"; // User requested computer icon

    const url = `station://add-resource?title=${title}&url=${currentUrl}&tags=${tags}&icon=${icon}`;

    // Trigger the deep link
    window.location.href = url;
  };

  return (
    <div className="h-16 border-t border-magma-900 bg-void flex items-center justify-between px-6 shrink-0 z-10">
      <div className="text-xs text-magma-800 font-mono">
        SYSTEM_STATUS: <span className="text-green-900">ONLINE</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleExport}
          disabled={isDisabled}
          className={`
            flex items-center gap-2 px-6 py-2 border font-mono text-xs font-bold tracking-wider uppercase transition-all
            ${isDisabled
              ? 'border-magma-900 text-magma-900 cursor-not-allowed opacity-50'
              : 'border-magma-600 text-magma-500 hover:bg-magma-900/20 hover:text-magma-300 hover:border-magma-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]'}
          `}
        >
          <Download size={14} />
          Export to Mac
        </button>

        <button
          onClick={handleStation}
          disabled={isDisabled}
          className={`
            flex items-center gap-2 px-6 py-2 border font-mono text-xs font-bold tracking-wider uppercase transition-all
            ${isDisabled
              ? 'border-magma-900 text-magma-900 cursor-not-allowed opacity-50'
              : 'border-magma-600 text-magma-500 hover:bg-magma-900/20 hover:text-magma-300 hover:border-magma-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]'}
          `}
        >
          <Monitor size={14} />
          Send to Station
        </button>
      </div>
    </div>
  );
};
