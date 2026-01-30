import React from 'react';
import { Archive, Snowflake, Trash2, Anchor, Zap, Skull, X, ChevronDown } from 'lucide-react';
import { Idea, IdeaStatus } from '../types';

interface IdeaGraveyardProps {
  ideas: Idea[];
  onResurrect: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: IdeaStatus) => void;
  currentIdeaId?: string;
}

const StatusIcon = ({ status }: { status: IdeaStatus }) => {
  switch (status) {
    case IdeaStatus.DEEP_FREEZE: return <Snowflake size={14} className="text-cyan-500/70" />;
    case IdeaStatus.SCRAPPED: return <Trash2 size={14} className="text-zinc-600" />;
    case IdeaStatus.STATIONARY: return <Anchor size={14} className="text-amber-600/70" />;
    case IdeaStatus.ACTIVE: return <Zap size={14} className="text-magma-500" />;
    default: return <Skull size={14} className="text-zinc-600" />;
  }
};

const getStatusStyles = (status: IdeaStatus, isActive: boolean) => {
  const base = "relative border-l-2 transition-all duration-300 backdrop-blur-sm";
  
  if (isActive) {
    switch (status) {
        case IdeaStatus.DEEP_FREEZE:
            return `${base} bg-cyan-950/20 border-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] text-cyan-100`;
        case IdeaStatus.SCRAPPED:
             return `${base} bg-zinc-800 border-zinc-500 shadow-[inset_0_0_20px_rgba(82,82,91,0.1)] text-zinc-300 grayscale`;
        case IdeaStatus.STATIONARY:
             return `${base} bg-amber-950/20 border-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)] text-amber-100`;
        case IdeaStatus.ACTIVE:
        default:
             return `${base} bg-magma-900/10 border-magma-500 shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] text-magma-100`;
      }
  }

  switch (status) {
    case IdeaStatus.DEEP_FREEZE: 
      return `${base} border-cyan-900/30 bg-void hover:bg-zinc-900 hover:border-cyan-400/30 text-zinc-400`;
    case IdeaStatus.SCRAPPED: 
      return `${base} border-zinc-800 bg-void hover:bg-zinc-900 hover:border-red-900/30 text-zinc-500 grayscale`;
    case IdeaStatus.STATIONARY: 
      return `${base} border-amber-900/30 bg-void hover:bg-zinc-900 hover:border-amber-500/30 text-zinc-400`;
    case IdeaStatus.ACTIVE:
      return `${base} border-magma-900/50 bg-void hover:bg-zinc-900 hover:border-magma-500/30 text-zinc-300`;
    default: 
      return `${base} border-zinc-800 bg-void hover:bg-zinc-900`;
  }
};

export const IdeaGraveyard: React.FC<IdeaGraveyardProps> = ({ ideas, onResurrect, onDelete, onUpdateStatus, currentIdeaId }) => {
  return (
    <div className="h-full flex flex-col border-r border-zinc-800 bg-void w-72 shrink-0 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-zinc-900/20 via-void to-void pointer-events-none"></div>

      {/* Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center gap-3 bg-void/80 z-10">
        <h2 className="text-zinc-300 font-bold tracking-[0.2em] text-xs flex items-center gap-2">
          <Skull size={14} className="text-zinc-500" /> GRAVEYARD
        </h2>
        <span className="text-[10px] text-zinc-500 font-mono">
          [{ideas.length}]
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 z-10">
        {ideas.length === 0 && (
          <div className="text-center py-10 opacity-30">
            <Skull size={32} className="mx-auto mb-2 text-zinc-800" />
            <p className="text-[10px] font-mono text-zinc-700 uppercase">Crypt Empty</p>
          </div>
        )}

        {ideas.map((idea) => (
          <div 
            key={idea.id} 
            onClick={() => onResurrect(idea)}
            className={`
              group p-3 cursor-pointer overflow-hidden rounded-sm relative
              ${getStatusStyles(idea.status, idea.id === currentIdeaId)}
            `}
          >
            {/* Delete Button (Hover Only) */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(idea.id);
                }}
                className="absolute top-2 right-2 p-1.5 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-zinc-900 rounded"
                title="Delete Idea"
            >
                <X size={12} />
            </button>

            {/* Status Line with Dropdown */}
            <div className="flex justify-between items-start mb-2 pr-6">
               <div className="relative z-30 group/status">
                   <div className="text-[10px] font-bold tracking-widest uppercase opacity-70 flex items-center gap-2 cursor-pointer hover:opacity-100 hover:text-white transition-opacity">
                     <StatusIcon status={idea.status} />
                     <span className="border-b border-dashed border-transparent group-hover/status:border-current">
                        {idea.status.replace('_', ' ')}
                     </span>
                     <ChevronDown size={10} className="opacity-0 group-hover/status:opacity-100 -ml-1" />
                   </div>
                   
                   {/* Hidden Select Overlay */}
                   <select 
                        value={idea.status}
                        onChange={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(idea.id, e.target.value as IdeaStatus);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   >
                        {Object.values(IdeaStatus).map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                   </select>
               </div>
            </div>

            {/* Title */}
            <div className={`font-mono text-sm mb-1 truncate transition-colors duration-200`}>
              {idea.title}
            </div>
            
            <div className="text-[9px] font-mono text-zinc-600">
                {idea.date}
            </div>

            {/* Hover Action */}
            <div className="h-0 group-hover:h-5 transition-all duration-300 overflow-hidden">
                <div className="text-[10px] opacity-70 uppercase tracking-[0.2em] flex items-center gap-1 pt-1">
                    &gt;&gt; RESURRECT
                </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};