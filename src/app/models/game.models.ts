export interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  isUnlocked: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  levels: Level[];
  isUnlocked: boolean;
}

export interface Level {
  id: string;
  title: string;
  description: string;
  objective: string;
  balanceSheetData: BalanceSheetData;
  dragItems: DragItem[];
  dropZones: DropZone[];
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface BalanceSheetData {
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  equity: EquityItem[];
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

export interface DragItem {
  id: string;
  name: string;
  amount: number;
  type: 'asset' | 'liability' | 'equity';
  category?: string;
  description: string;
  isPlaced: boolean;
}

export interface DropZone {
  id: string;
  type: 'asset' | 'liability' | 'equity';
  category?: string;
  title: string;
  acceptedItems: string[];
  placedItems: DragItem[];
  maxItems?: number;
}

export interface GameProgress {
  currentCourse: string;
  currentChapter: string;
  currentLevel: string;
  completedLevels: string[];
  unlockedLevels: string[];
  score: number;
  totalStars: number;
}
