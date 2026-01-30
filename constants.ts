import { Idea, IdeaStatus, Spark } from './types';

export const MOCK_IDEAS: Idea[] = [
  { id: '1', title: 'Neural Garden', status: IdeaStatus.DEEP_FREEZE, date: '2023-11-02' },
  { id: '2', title: 'Crypto Watchdog', status: IdeaStatus.SCRAPPED, date: '2024-01-15' },
  { id: '3', title: 'VR Retailer', status: IdeaStatus.STATIONARY, date: '2024-02-20' },
  { id: '4', title: 'Soundscape Gen', status: IdeaStatus.DEEP_FREEZE, date: '2023-08-10' },
  { id: '5', title: 'Auto-Budgeter', status: IdeaStatus.SCRAPPED, date: '2023-12-05' },
];

export const INITIAL_SPARKS: Spark[] = [
  { id: 's1', text: 'Merge "Social Network" with "Supply Chain Management"', type: 'COMBO' },
  { id: 's2', text: 'Pivot: What if the user is an AI agent?', type: 'PIVOT' },
  { id: 's3', text: 'Inject chaos: The UI degrades over time.', type: 'WILD' },
];
