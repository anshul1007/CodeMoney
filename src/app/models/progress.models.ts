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
