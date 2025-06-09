export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  units: Unit[];
  isUnlocked: boolean;

  // Legacy property for backward compatibility
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  levels: Level[];
  isUnlocked: boolean;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  isUnlocked: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  levels: Level[];
  isUnlocked: boolean;
}

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

export interface AssetItem {
  id: string;
  name: string;
  amount: number;
  category: 'current' | 'fixed';
}

export interface LiabilityItem {
  id: string;
  name: string;
  amount: number;
  category: 'current' | 'long-term';
}

export interface EquityItem {
  id: string;
  name: string;
  amount: number;
}

export interface BalanceSheetData {
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  equity: EquityItem[];
}

export interface FundingSource {
  id: string;
  name: string;
  icon: string;
  description: string;
  maxAmount?: number;
  interestRate?: number;
  isSelected?: boolean;
  amount?: number;
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

export interface GameProgress {
  currentCourse: string;
  currentUnit: string;
  currentLesson: string;
  currentLevel: string;
  completedLevels: string[];
  unlockedLevels: string[];
  score: number;
  totalStars: number;

  // Legacy property for backward compatibility
  currentChapter?: string;
}
