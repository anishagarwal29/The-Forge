export enum IdeaStatus {
  DEEP_FREEZE = 'DEEP_FREEZE',
  STATIONARY = 'STATIONARY',
  SCRAPPED = 'SCRAPPED',
  ACTIVE = 'ACTIVE'
}

export interface Blueprint {
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  coreFeatures: string[];
  architectureDiagram: string; // ASCII or Mermaid representation
  estimatedComplexity: string;
}

export interface Idea {
  id: string;
  title: string;
  status: IdeaStatus;
  date: string;
  blueprint?: Blueprint; // Added to allow restoring the idea
}

export interface Spark {
  id: string;
  text: string;
  type: 'COMBO' | 'PIVOT' | 'WILD';
}

export interface ForgeSettings {
  complexity: number;
  chaos: number;
}
