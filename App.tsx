import React, { useState, useEffect } from 'react';
import { IdeaGraveyard } from './components/IdeaGraveyard';
import { RemixStation } from './components/RemixStation';
import { AnvilWorkspace } from './components/AnvilWorkspace';
import { BlueprintDock } from './components/BlueprintDock';
import { Idea, ForgeSettings, Blueprint, IdeaStatus } from './types';

export default function App() {
  // PERSISTENCE: Load from local storage or start empty
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('forge_graveyard');
    return saved ? JSON.parse(saved) : [];
  });

  // PERSISTENCE: Save to local storage on every change
  useEffect(() => {
    localStorage.setItem('forge_graveyard', JSON.stringify(ideas));
  }, [ideas]);
  const [settings, setSettings] = useState<ForgeSettings>({ complexity: 50, chaos: 20 });
  // PERSISTENCE: Blueprint
  const [currentBlueprint, setCurrentBlueprint] = useState<Blueprint | null>(() => {
    const saved = localStorage.getItem('forge_blueprint');
    return saved ? JSON.parse(saved) : null;
  });

  // PERSISTENCE: Current Idea ID
  const [currentIdeaId, setCurrentIdeaId] = useState<string | undefined>(() => {
    const saved = localStorage.getItem('forge_idea_id');
    return saved ? JSON.parse(saved) : undefined;
  });

  // PERSISTENCE: Input Value
  const [inputValue, setInputValue] = useState<string>(() => {
    return localStorage.getItem('forge_input') || '';
  });

  // Effects to save state
  useEffect(() => {
    if (currentBlueprint) {
      localStorage.setItem('forge_blueprint', JSON.stringify(currentBlueprint));
    } else {
      localStorage.removeItem('forge_blueprint');
    }
  }, [currentBlueprint]);

  useEffect(() => {
    if (currentIdeaId) {
      localStorage.setItem('forge_idea_id', JSON.stringify(currentIdeaId));
    } else {
      localStorage.removeItem('forge_idea_id');
    }
  }, [currentIdeaId]);

  useEffect(() => {
    localStorage.setItem('forge_input', inputValue);
  }, [inputValue]);

  // When a new blueprint is forged
  const handleNewBlueprint = (blueprint: Blueprint) => {
    setCurrentBlueprint(blueprint);

    // Add to Graveyard as ACTIVE
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: blueprint.title,
      status: IdeaStatus.ACTIVE,
      date: new Date().toISOString().split('T')[0],
      blueprint: blueprint
    };

    setIdeas(prev => [newIdea, ...prev]);
    setCurrentIdeaId(newIdea.id);
  };

  // When clicking an idea in the graveyard
  const handleResurrectIdea = (idea: Idea) => {
    if (idea.blueprint) {
      setCurrentBlueprint(idea.blueprint);
      setCurrentIdeaId(idea.id);
    } else {
      alert("This idea was too corrupted to resurrect (No blueprint data).");
    }
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
    if (currentIdeaId === id) {
      setCurrentBlueprint(null);
      setCurrentIdeaId(undefined);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: IdeaStatus) => {
    setIdeas(prev => prev.map(idea =>
      idea.id === id ? { ...idea, status: newStatus } : idea
    ));
  };

  const handleClearWorkspace = () => {
    setCurrentBlueprint(null);
    setCurrentIdeaId(undefined);
    setInputValue('');
  };

  const handleSparkSelect = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-void text-zinc-400 font-mono overflow-hidden selection:bg-magma-500/30 selection:text-magma-200">

      {/* Top Main Area (Columns) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* Left Sidebar */}
        <IdeaGraveyard
          ideas={ideas}
          onResurrect={handleResurrectIdea}
          onDelete={handleDeleteIdea}
          onUpdateStatus={handleUpdateStatus}
          onClearWorkspace={handleClearWorkspace}
          currentIdeaId={currentIdeaId}
        />

        {/* Center Stage */}
        <AnvilWorkspace
          settings={settings}
          onBlueprintGenerated={handleNewBlueprint}
          currentBlueprint={currentBlueprint}
          input={inputValue}
          setInput={setInputValue}
        />

        {/* Right Sidebar */}
        <RemixStation
          settings={settings}
          onSettingsChange={setSettings}
          onSelectSpark={handleSparkSelect}
        />

      </div>

      {/* Bottom Dock */}
      <BlueprintDock blueprint={currentBlueprint} />

    </div>
  );
}