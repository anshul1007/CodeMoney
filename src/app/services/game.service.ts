import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, Level, GameProgress } from '../models/game.models';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameProgressSubject = new BehaviorSubject<GameProgress>({
    currentCourse: 'legacy-balance-sheet',
    currentUnit: 'balance-sheet-intro',
    currentLesson: 'balance-sheet-intro',
    currentLevel: 'level-1',
    completedLevels: [],
    unlockedLevels: ['level-1'],
    score: 0,
    totalStars: 0,
  });

  public gameProgress$ = this.gameProgressSubject.asObservable();

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor() {
    this.loadProgress();
  }
  getCurrentLevel(): Observable<Level | null> {
    return new Observable((observer) => {
      const legacyLevel: Level = {
        id: 'legacy-level-1',
        title: 'Basic Balance Sheet',
        description: 'Learn to categorize financial items',
        objective: 'Drag items to their correct balance sheet categories',
        type: 'balance-sheet',
        gameData: {
          prompt: 'Drag each item to the correct category on the balance sheet',
          balanceSheetData: {
            assets: [],
            liabilities: [],
            equity: [],
          },
        },
        isCompleted: false,
        isUnlocked: true,
        stars: 0,
        dragItems: [
          {
            id: 'cash',
            name: 'Cash',
            amount: 1000,
            type: 'asset',
            category: 'current',
            description: 'Money in bank accounts',
            isPlaced: false,
          },
          {
            id: 'loan',
            name: 'Bank Loan',
            amount: 5000,
            type: 'liability',
            category: 'long-term',
            description: 'Money owed to the bank',
            isPlaced: false,
          },
        ],
        dropZones: [
          {
            id: 'current-assets',
            type: 'asset',
            category: 'current',
            title: 'Current Assets',
            acceptedItems: ['cash'],
            placedItems: [],
            maxItems: 5,
          },
          {
            id: 'long-term-liabilities',
            type: 'liability',
            category: 'long-term',
            title: 'Long-term Liabilities',
            acceptedItems: ['loan'],
            placedItems: [],
            maxItems: 5,
          },
        ],
      };
      observer.next(legacyLevel);
    });
  }

  checkAnswer(level: Level): { isCorrect: boolean; feedback: string } {
    return {
      isCorrect: true,
      feedback: 'Legacy functionality not implemented',
    };
  }

  completeLevel(levelId: string): void {
    // Stub implementation
  }

  goToNextLevel(): void {
    // Stub implementation
  }
  getAllLevels(): Observable<Level[]> {
    return new Observable((observer) => {
      // Return basic legacy levels
      const levels: Level[] = [
        {
          id: 'legacy-level-1',
          title: 'Basic Balance Sheet',
          description: 'Learn to categorize financial items',
          objective: 'Drag items to their correct balance sheet categories',
          type: 'balance-sheet',
          gameData: {
            prompt:
              'Drag each item to the correct category on the balance sheet',
            balanceSheetData: {
              assets: [],
              liabilities: [],
              equity: [],
            },
          },
          isCompleted: false,
          isUnlocked: true,
          stars: 0,
        },
      ];
      observer.next(levels);
    });
  }

  goToLevel(levelId: string): void {
    // Stub implementation
  }

  private saveProgress(): void {
    localStorage.setItem(
      'codeMoney_progress',
      JSON.stringify(this.gameProgressSubject.value),
    );
  }

  private loadProgress(): void {
    const saved = localStorage.getItem('codeMoney_progress');
    if (saved) {
      const progress = JSON.parse(saved);
      this.gameProgressSubject.next(progress);
    }
  }

  resetProgress(): void {
    localStorage.removeItem('codeMoney_progress');
    this.gameProgressSubject.next({
      currentCourse: 'legacy-balance-sheet',
      currentUnit: 'balance-sheet-intro',
      currentLesson: 'balance-sheet-intro',
      currentLevel: 'level-1',
      completedLevels: [],
      unlockedLevels: ['level-1'],
      score: 0,
      totalStars: 0,
    });
  }
}
