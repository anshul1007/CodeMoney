import { BaseGameData } from './base-game.models';
import { Level } from './course.models';
import { GameType } from './game-registry';

export type { GameType };

export type CurrentLevel = Pick<Level, 'id' | 'title' | 'description' | 'stars'>;

export interface SelectionItem {
  id: string;
  name: string;
  icon?: string;
  isCorrect?: boolean;
  isSelected?: boolean;
}

export interface MultiChoiceGameData extends BaseGameData {
  items: SelectionItem[];
}

export interface EstimationItem {
  id: string;
  name: string;
  icon: string;
  targetValue: number;
  acceptableRange: {
    min: number;
    max: number;
  };
  unit: string;
  userEstimate?: number;
}

export interface ValueInputGameData extends BaseGameData {
  currency: string;
  items: EstimationItem[];
  totalBudget?: number;
  minEstimations?: number;
}

export interface FundingSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxAmount: number;
  isAvailable: boolean;
  isSelected?: boolean;
  amount?: number;
}

export interface ResourceAllocationGameData extends BaseGameData {
  totalBudget: number;
  fundingSources: FundingSource[];
  constraints?: {
    mustAllocateAll?: boolean;
    allowDeficit?: boolean;
    minSources?: number;
  };
}

// Generic GameData interface
export interface GameData<T extends BaseGameData = BaseGameData> {
  currentLevel: CurrentLevel;
  scene?: string;
  prompt: string;
  hints?: string[];
  gameType: GameType;
  isCompleted?: boolean;
  // Generic game-specific data
  data: T;
}

// Submission data types for saved game states
export interface EstimationSubmissionData {
  userEstimates: Record<string, number>;
}

export interface FundingSubmissionData {
  selections: Record<string, boolean>;
  amounts: Record<string, number>;
}

export type SelectionSubmissionData = string[];
