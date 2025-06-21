import { BaseGameData } from './base-game.models';
import { Level } from './course.models';

export type GameType = 'selection' | 'estimation' | 'funding' | 'balance-sheet';

export type CurrentLevel = Pick<Level, 'id' | 'title' | 'description' | 'stars'>;

export interface SelectionGameData extends BaseGameData {
  items: {
    id: string;
    name: string;
    icon?: string;
    isCorrect?: boolean; // Indicates if the item is correct (for validation)
    isSelected?: boolean; // Indicates if the item is selected by the user
    // Additional properties can be added as needed
  }[];
  // options: Array<{
  //   id: string;
  //   label: string;
  //   value: any;
  //   isCorrect?: boolean;
  //   description?: string;
  // }>;
  // multiSelect?: boolean;
  // minSelections?: number;
  // maxSelections?: number;
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
  categories: {
    id: string;
    name: string;
    description: string;
    minAmount?: number;
    maxAmount?: number;
    suggestedAmount?: number;
  }[];
  constraints?: {
    mustAllocateAll?: boolean;
    allowDeficit?: boolean;
  };
}

export interface BalanceSheetGameData extends BaseGameData {
  accounts: {
    id: string;
    name: string;
    type: 'asset' | 'liability' | 'equity';
    category: string;
    initialBalance?: number;
  }[];
  transactions: {
    id: string;
    description: string;
    amount: number;
    affectedAccounts: string[];
  }[];
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
