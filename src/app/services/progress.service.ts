import { Injectable, signal } from '@angular/core';

import { GameProgress } from '../models/progress.models';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private readonly STORAGE_KEY = 'codeMoney_progress';

  private readonly progressSignal = signal<GameProgress>(this.loadProgress());

  // Public read-only access to progress
  readonly progress = this.progressSignal.asReadonly();

  private loadProgress(): GameProgress {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load progress from localStorage:', error);
    }

    // Default progress
    return {
      currentCourse: 'money-mission',
      currentUnit: 'lemonade-stand',
      currentLesson: 'getting-started',
      currentLevel: 'choose-items',
      completedLevels: [],
      unlockedLevels: ['choose-items'],
      score: 0,
      totalStars: 0,
    };
  }

  private saveProgress(progress: GameProgress): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save progress to localStorage:', error);
    }
  }

  completeLevel(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
    stars = 3,
  ): void {
    const currentProgress = this.progressSignal();
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;

    // Check if level is already completed
    const isAlreadyCompleted = currentProgress.completedLevels.includes(levelKey);

    // Calculate star difference for scoring
    const existingStars = isAlreadyCompleted
      ? this.getLevelStars(courseId, unitId, lessonId, levelId)
      : 0;
    const starDifference = Math.max(0, stars - existingStars);

    const updatedProgress: GameProgress = {
      ...currentProgress,
      completedLevels: isAlreadyCompleted
        ? currentProgress.completedLevels
        : [...currentProgress.completedLevels, levelKey],
      totalStars: currentProgress.totalStars + starDifference,
      score: currentProgress.score + (isAlreadyCompleted ? 0 : 100), // Base score for completion
    };

    this.progressSignal.set(updatedProgress);
    this.saveProgress(updatedProgress);

    // Store individual level completion data
    this.saveLevelCompletion(courseId, unitId, lessonId, levelId, stars);
  }

  unlockLevel(courseId: string, unitId: string, lessonId: string, levelId: string): void {
    const currentProgress = this.progressSignal();
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;

    if (!currentProgress.unlockedLevels.includes(levelKey)) {
      const updatedProgress: GameProgress = {
        ...currentProgress,
        unlockedLevels: [...currentProgress.unlockedLevels, levelKey],
      };

      this.progressSignal.set(updatedProgress);
      this.saveProgress(updatedProgress);
    }
  }

  isLevelCompleted(courseId: string, unitId: string, lessonId: string, levelId: string): boolean {
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;
    return this.progressSignal().completedLevels.includes(levelKey);
  }

  isLevelUnlocked(courseId: string, unitId: string, lessonId: string, levelId: string): boolean {
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;
    return this.progressSignal().unlockedLevels.includes(levelKey);
  }

  getLevelStars(courseId: string, unitId: string, lessonId: string, levelId: string): number {
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;
    try {
      const stored = localStorage.getItem(`level_${levelKey}`);
      if (stored) {
        const levelData = JSON.parse(stored);
        return levelData.stars || 0;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load level data:', error);
    }
    return 0;
  }

  private saveLevelCompletion(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
    stars: number,
  ): void {
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;
    const levelData = {
      completedAt: new Date().toISOString(),
      stars: stars,
      courseId,
      unitId,
      lessonId,
      levelId,
    };

    try {
      localStorage.setItem(`level_${levelKey}`, JSON.stringify(levelData));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save level completion data:', error);
    }
  }

  resetProgress(): void {
    const defaultProgress: GameProgress = {
      currentCourse: 'money-mission',
      currentUnit: 'lemonade-stand',
      currentLesson: 'getting-started',
      currentLevel: 'choose-items',
      completedLevels: [],
      unlockedLevels: ['choose-items'],
      score: 0,
      totalStars: 0,
    };

    this.progressSignal.set(defaultProgress);
    this.saveProgress(defaultProgress);

    // Clear all level completion data
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith('level_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to clear level data:', error);
    }
  }

  // Get completion statistics
  getCompletionStats() {
    const progress = this.progressSignal();
    return {
      totalCompleted: progress.completedLevels.length,
      totalUnlocked: progress.unlockedLevels.length,
      totalStars: progress.totalStars,
      totalScore: progress.score,
    };
  }
}
