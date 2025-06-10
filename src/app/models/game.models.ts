import type { BalanceSheetData, FundingSource } from './financial.models';

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface GameItem {
  id: string;
  name: string;
  icon: string;
  isCorrect: boolean;
  isSelected?: boolean;
  description?: string;
}

export interface EstimationField {
  id: string;
  itemName: string;
  icon: string;
  userEstimate?: number;
  actualCost?: number;
  currency: string;
}

export interface LevelGameData {
  scene?: string;
  prompt: string;
  items?: GameItem[];
  choices?: Choice[];
  estimationFields?: EstimationField[];
  fundingSources?: FundingSource[];
  balanceSheetData?: BalanceSheetData;
  hints?: string[];
  correctAnswers?: string[];
}

export interface Level {
  id: string;
  title: string;
  description: string;
  objective: string;
  type: 'selection' | 'estimation' | 'funding' | 'balance-sheet';
  gameData: LevelGameData;
  isCompleted: boolean;
  isUnlocked: boolean;
  stars: number; // 0-3 stars based on performance

  // Legacy properties for backward compatibility with old balance sheet game
  balanceSheetData?: BalanceSheetData;
}
