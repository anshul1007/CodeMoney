import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, Chapter, Level, GameProgress, DragItem, DropZone } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameProgressSubject = new BehaviorSubject<GameProgress>({
    currentCourse: 'lemonade-basics',
    currentChapter: 'balance-sheet-intro',
    currentLevel: 'level-1',
    completedLevels: [],
    unlockedLevels: ['level-1'],
    score: 0,
    totalStars: 0
  });

  public gameProgress$ = this.gameProgressSubject.asObservable();

  private coursesSubject = new BehaviorSubject<Course[]>(this.initializeCourses());
  public courses$ = this.coursesSubject.asObservable();

  constructor() {
    this.loadProgress();
  }

  private initializeCourses(): Course[] {
    return [
      {
        id: 'lemonade-basics',
        title: 'Lemonade Stand Basics',
        description: 'Learn fundamental financial concepts through managing a lemonade stand',
        isUnlocked: true,
        chapters: [
          {
            id: 'balance-sheet-intro',
            title: 'Understanding Balance Sheets',
            description: 'Learn what assets, liabilities, and equity mean in your lemonade business',
            isUnlocked: true,
            levels: [
              {
                id: 'level-1',
                title: 'Your First Balance Sheet',
                description: 'Help Lucy organize her lemonade stand\'s first balance sheet',
                objective: 'Drag the correct items to their proper places on the balance sheet',
                isCompleted: false,
                isUnlocked: true,
                balanceSheetData: {
                  assets: [],
                  liabilities: [],
                  equity: []
                },
                dragItems: [
                  {
                    id: 'cash',
                    name: 'Cash',
                    amount: 50,
                    type: 'asset',
                    category: 'current',
                    description: 'Money Lucy has to start her business',
                    isPlaced: false
                  },
                  {
                    id: 'lemons',
                    name: 'Lemons Inventory',
                    amount: 20,
                    type: 'asset',
                    category: 'current',
                    description: 'Lemons Lucy bought to make lemonade',
                    isPlaced: false
                  },
                  {
                    id: 'lemonade-stand',
                    name: 'Lemonade Stand',
                    amount: 75,
                    type: 'asset',
                    category: 'fixed',
                    description: 'The wooden stand Lucy uses to sell lemonade',
                    isPlaced: false
                  },
                  {
                    id: 'mom-loan',
                    name: 'Loan from Mom',
                    amount: 30,
                    type: 'liability',
                    category: 'current',
                    description: 'Money Lucy borrowed from her mom',
                    isPlaced: false
                  },
                  {
                    id: 'owner-investment',
                    name: 'Lucy\'s Investment',
                    amount: 115,
                    type: 'equity',
                    description: 'Lucy\'s own money invested in the business',
                    isPlaced: false
                  }
                ],
                dropZones: [
                  {
                    id: 'current-assets',
                    type: 'asset',
                    category: 'current',
                    title: 'Current Assets',
                    acceptedItems: ['cash', 'lemons'],
                    placedItems: [],
                    maxItems: 2
                  },
                  {
                    id: 'fixed-assets',
                    type: 'asset',
                    category: 'fixed',
                    title: 'Fixed Assets',
                    acceptedItems: ['lemonade-stand'],
                    placedItems: [],
                    maxItems: 1
                  },
                  {
                    id: 'current-liabilities',
                    type: 'liability',
                    category: 'current',
                    title: 'Current Liabilities',
                    acceptedItems: ['mom-loan'],
                    placedItems: [],
                    maxItems: 1
                  },
                  {
                    id: 'equity',
                    type: 'equity',
                    title: 'Owner\'s Equity',
                    acceptedItems: ['owner-investment'],
                    placedItems: [],
                    maxItems: 1
                  }
                ]
              },              {
                id: 'level-2',
                title: 'After First Day Sales',
                description: 'Update the balance sheet after Lucy\'s first day of sales',
                objective: 'Show how transactions affect the balance sheet',
                isCompleted: false,
                isUnlocked: false,
                balanceSheetData: {
                  assets: [],
                  liabilities: [],
                  equity: []
                },
                dragItems: [
                  {
                    id: 'cash-updated',
                    name: 'Cash',
                    amount: 95,
                    type: 'asset',
                    category: 'current',
                    description: 'Cash after first day: $50 + $60 sales - $15 supplies = $95',
                    isPlaced: false
                  },
                  {
                    id: 'lemons-remaining',
                    name: 'Lemons Inventory',
                    amount: 5,
                    type: 'asset',
                    category: 'current',
                    description: 'Remaining lemons after first day of sales',
                    isPlaced: false
                  },
                  {
                    id: 'supplies',
                    name: 'Supplies',
                    amount: 15,
                    type: 'asset',
                    category: 'current',
                    description: 'Cups, napkins, and sugar purchased',
                    isPlaced: false
                  },
                  {
                    id: 'lemonade-stand',
                    name: 'Lemonade Stand',
                    amount: 75,
                    type: 'asset',
                    category: 'fixed',
                    description: 'The wooden stand Lucy uses to sell lemonade',
                    isPlaced: false
                  },
                  {
                    id: 'mom-loan',
                    name: 'Loan from Mom',
                    amount: 30,
                    type: 'liability',
                    category: 'current',
                    description: 'Money Lucy still owes her mom',
                    isPlaced: false
                  },
                  {
                    id: 'owner-equity-updated',
                    name: 'Lucy\'s Equity',
                    amount: 160,
                    type: 'equity',
                    description: 'Lucy\'s ownership: $115 initial + $45 profit from sales',
                    isPlaced: false
                  }
                ],
                dropZones: [
                  {
                    id: 'current-assets',
                    type: 'asset',
                    category: 'current',
                    title: 'Current Assets',
                    acceptedItems: ['cash-updated', 'lemons-remaining', 'supplies'],
                    placedItems: [],
                    maxItems: 3
                  },
                  {
                    id: 'fixed-assets',
                    type: 'asset',
                    category: 'fixed',
                    title: 'Fixed Assets',
                    acceptedItems: ['lemonade-stand'],
                    placedItems: [],
                    maxItems: 1
                  },
                  {
                    id: 'current-liabilities',
                    type: 'liability',
                    category: 'current',
                    title: 'Current Liabilities',
                    acceptedItems: ['mom-loan'],
                    placedItems: [],
                    maxItems: 1
                  },
                  {
                    id: 'equity',
                    type: 'equity',
                    title: 'Owner\'s Equity',
                    acceptedItems: ['owner-equity-updated'],
                    placedItems: [],
                    maxItems: 1
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }

  getCurrentLevel(): Observable<Level | null> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        const progress = this.gameProgressSubject.value;
        const course = courses.find(c => c.id === progress.currentCourse);
        if (course) {
          const chapter = course.chapters.find(ch => ch.id === progress.currentChapter);
          if (chapter) {
            const level = chapter.levels.find(l => l.id === progress.currentLevel);
            observer.next(level || null);
          }
        }
      });
    });
  }

  checkAnswer(level: Level): { isCorrect: boolean; feedback: string } {
    const allItemsPlaced = level.dragItems.every(item => item.isPlaced);
    
    if (!allItemsPlaced) {
      return {
        isCorrect: false,
        feedback: 'Please place all items in their correct positions.'
      };
    }

    // Check if balance sheet balances
    const totalAssets = level.dropZones
      .filter(zone => zone.type === 'asset')
      .reduce((sum, zone) => sum + zone.placedItems.reduce((itemSum, item) => itemSum + item.amount, 0), 0);

    const totalLiabilities = level.dropZones
      .filter(zone => zone.type === 'liability')
      .reduce((sum, zone) => sum + zone.placedItems.reduce((itemSum, item) => itemSum + item.amount, 0), 0);

    const totalEquity = level.dropZones
      .filter(zone => zone.type === 'equity')
      .reduce((sum, zone) => sum + zone.placedItems.reduce((itemSum, item) => itemSum + item.amount, 0), 0);

    const isBalanced = totalAssets === (totalLiabilities + totalEquity);

    if (isBalanced) {
      this.completeLevel(level.id);
      return {
        isCorrect: true,
        feedback: `Excellent! Your balance sheet balances perfectly. Assets ($${totalAssets}) = Liabilities ($${totalLiabilities}) + Equity ($${totalEquity})`
      };
    } else {
      return {
        isCorrect: false,
        feedback: `The balance sheet doesn't balance. Assets ($${totalAssets}) ≠ Liabilities ($${totalLiabilities}) + Equity ($${totalEquity}). Remember: Assets must equal Liabilities plus Equity!`
      };
    }
  }

  completeLevel(levelId: string): void {
    const progress = this.gameProgressSubject.value;
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId);
      progress.score += 100;
      progress.totalStars += 3;
      
      // Unlock next level
      this.unlockNextLevel(levelId);
      
      this.gameProgressSubject.next(progress);
      this.saveProgress();
    }
  }

  goToNextLevel(): void {
    const progress = this.gameProgressSubject.value;
    const courses = this.coursesSubject.value;
    
    const course = courses.find(c => c.id === progress.currentCourse);
    if (course) {
      const chapter = course.chapters.find(ch => ch.id === progress.currentChapter);
      if (chapter) {
        const currentLevelIndex = chapter.levels.findIndex(l => l.id === progress.currentLevel);
        if (currentLevelIndex !== -1 && currentLevelIndex < chapter.levels.length - 1) {
          const nextLevel = chapter.levels[currentLevelIndex + 1];
          if (nextLevel.isUnlocked) {
            progress.currentLevel = nextLevel.id;
            this.gameProgressSubject.next(progress);
            this.saveProgress();
          }
        }
      }
    }
  }

  getAllLevels(): Observable<Level[]> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        const progress = this.gameProgressSubject.value;
        const course = courses.find(c => c.id === progress.currentCourse);
        if (course) {
          const chapter = course.chapters.find(ch => ch.id === progress.currentChapter);
          if (chapter) {
            observer.next(chapter.levels);
          }
        }
      });
    });
  }

  goToLevel(levelId: string): void {
    const progress = this.gameProgressSubject.value;
    progress.currentLevel = levelId;
    this.gameProgressSubject.next(progress);
    this.saveProgress();
  }

  private unlockNextLevel(completedLevelId: string): void {
    const courses = this.coursesSubject.value;
    const progress = this.gameProgressSubject.value;
    
    // Find the completed level and unlock the next one
    for (const course of courses) {
      for (const chapter of course.chapters) {
        const levelIndex = chapter.levels.findIndex(l => l.id === completedLevelId);
        if (levelIndex !== -1 && levelIndex < chapter.levels.length - 1) {
          const nextLevel = chapter.levels[levelIndex + 1];
          nextLevel.isUnlocked = true;
          if (!progress.unlockedLevels.includes(nextLevel.id)) {
            progress.unlockedLevels.push(nextLevel.id);
          }
        }
      }
    }
    
    this.coursesSubject.next(courses);
  }

  private saveProgress(): void {
    localStorage.setItem('codeMoney_progress', JSON.stringify(this.gameProgressSubject.value));
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
      currentCourse: 'lemonade-basics',
      currentChapter: 'balance-sheet-intro',
      currentLevel: 'level-1',
      completedLevels: [],
      unlockedLevels: ['level-1'],
      score: 0,
      totalStars: 0
    });
  }
}
