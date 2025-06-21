import { BaseGameData } from './base-game.models';

export type GameType = 'selection' | 'estimation' | 'funding' | 'balance-sheet';

export interface SelectionGameData extends BaseGameData {
  options: Array<{
    id: string;
    label: string;
    value: any;
    isCorrect?: boolean;
    description?: string;
  }>;
  multiSelect?: boolean;
  minSelections?: number;
  maxSelections?: number;
}

export interface EstimationGameData extends BaseGameData {
  targetValue: number;
  unit: string;
  acceptableRange: {
    min: number;
    max: number;
  };
  hints?: {
    rangeHint?: string;
    contextHint?: string;
  };
}

export interface FundingGameData extends BaseGameData {
  totalBudget: number;
  categories: Array<{
    id: string;
    name: string;
    description: string;
    minAmount?: number;
    maxAmount?: number;
    suggestedAmount?: number;
  }>;
  constraints?: {
    mustAllocateAll?: boolean;
    allowDeficit?: boolean;
  };
}

export interface BalanceSheetGameData extends BaseGameData {
  accounts: Array<{
    id: string;
    name: string;
    type: 'asset' | 'liability' | 'equity';
    category: string;
    initialBalance?: number;
  }>;
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    affectedAccounts: string[];
  }>;
}

// Generic GameData interface
export interface GameData<T extends BaseGameData = BaseGameData> {
  levelId: string;
  scene?: string;
  prompt: string;
  hints?: string[];
  gameType: GameType;
  isCompleted?: boolean;
  // Generic game-specific data
  gameSpecificData: T;
}
