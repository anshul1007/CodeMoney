import { BaseGameData } from './base-game.models';
import { Level } from './course.models';

export type GameType = 'selection' | 'estimation' | 'funding' | 'balance-sheet';

export type CurrentLevel = Pick<Level, 'id' | 'title' | 'description' | 'stars'>;

export interface SelectionItem {
  id: string;
  name: string;
  icon?: string;
  isCorrect?: boolean;
  isSelected?: boolean;
}

export interface SelectionGameData extends BaseGameData {
  items: SelectionItem[];
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

export interface EstimationGameData extends BaseGameData {
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

export interface FundingGameData extends BaseGameData {
  totalBudget: number;
  fundingSources: FundingSource[];
  constraints?: {
    mustAllocateAll?: boolean;
    allowDeficit?: boolean;
    minSources?: number;
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
