import { Injectable, signal, computed, effect } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, Lesson, Unit } from '../models/course.models';
import { Level } from '../models/game.models';
import { GameProgress } from '../models/progress.models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  // Modern signal-based state management (primary)
  private readonly progressSignal = signal<GameProgress>({
    currentCourse: 'money-mission',
    currentUnit: 'lemonade-stand',
    currentLesson: 'getting-started',
    currentLevel: 'choose-items',
    completedLevels: [],
    unlockedLevels: ['choose-items'],
    score: 0,
    totalStars: 0,
  });

  // Legacy BehaviorSubject for backward compatibility - sync with signals
  private readonly progressSubject = new BehaviorSubject<GameProgress>(
    this.progressSignal(),
  );

  // Keep for backward compatibility
  readonly progress$ = this.progressSubject.asObservable();

  // Modern computed signals for derived state
  readonly completedLevelsCount = computed(
    () => this.progressSignal().completedLevels.length,
  );
  readonly unlockedLevelsCount = computed(
    () => this.progressSignal().unlockedLevels.length,
  );
  readonly totalStars = computed(() => this.progressSignal().totalStars);

  // Public read-only access to progress signal
  readonly progress = this.progressSignal.asReadonly();

  // Auto-sync signals with BehaviorSubject for compatibility
  private readonly syncEffect = effect(() => {
    this.progressSubject.next(this.progressSignal());
  });
  // Optimized course data with readonly arrays for better performance
  private readonly courses: readonly Course[] = [
    {
      id: 'money-mission',
      title: 'Money Mission: Build Your Own Business!',
      description:
        'Learn about money, business, and finance through fun games and activities.',
      icon: '💰',
      isUnlocked: true,
      units: [
        {
          id: 'lemonade-stand',
          title: '📦 Unit 1: Start Your Lemonade Stand!',
          description:
            'Learn the basics of starting a business with a lemonade stand.',
          icon: '🍋',
          isUnlocked: true,
          lessons: [
            {
              id: 'getting-started',
              title: '🎯 Lesson 1: What Do You Need to Start?',
              description:
                'Discover what items you need to start your lemonade business.',
              icon: '🎯',
              isUnlocked: true,
              levels: [
                {
                  id: 'choose-items',
                  title: '🧩 Level 1: Choose What You Need',
                  description:
                    'Select the right items to start your lemonade stand.',
                  objective:
                    'Choose the correct items needed for a lemonade stand business.',
                  type: 'selection',
                  isCompleted: false,
                  isUnlocked: true,
                  stars: 0,
                  gameData: {
                    scene:
                      'A colorful cartoon street where the child wants to open a lemonade stand.',
                    prompt:
                      'You want to start a lemonade stand! What do you think you need?',
                    items: [
                      {
                        id: 'lemons',
                        name: 'Lemons',
                        icon: '🍋',
                        isCorrect: true,
                      },
                      {
                        id: 'sugar',
                        name: 'Sugar',
                        icon: '🧂',
                        isCorrect: true,
                      },
                      { id: 'ice', name: 'Ice', icon: '🧊', isCorrect: true },
                      {
                        id: 'stand',
                        name: 'Stand',
                        icon: '🏕️',
                        isCorrect: true,
                      },
                      { id: 'cups', name: 'Cups', icon: '🥤', isCorrect: true },
                      {
                        id: 'napkins',
                        name: 'Napkins',
                        icon: '🧼',
                        isCorrect: true,
                      },
                      {
                        id: 'sofa',
                        name: 'Sofa',
                        icon: '🛋️',
                        isCorrect: false,
                      },
                      {
                        id: 'skateboard',
                        name: 'Skateboard',
                        icon: '🛹',
                        isCorrect: false,
                      },
                      { id: 'tv', name: 'TV', icon: '📺', isCorrect: false },
                      {
                        id: 'bicycle',
                        name: 'Bicycle',
                        icon: '🚲',
                        isCorrect: false,
                      },
                    ],
                    hints: [
                      'Think about what customers need to buy and enjoy lemonade!',
                    ],
                  },
                },
                {
                  id: 'estimate-costs',
                  title: '💰 Level 2: How Much Does It Cost?',
                  description:
                    'Estimate the costs of your lemonade stand items.',
                  objective: 'Make cost estimates for your business items.',
                  type: 'estimation',
                  isCompleted: false,
                  isUnlocked: false,
                  stars: 0,
                  gameData: {
                    prompt:
                      "Now, let's guess how much each item costs! Don't worry, just try your best.",
                    estimationFields: [
                      {
                        id: 'lemons',
                        itemName: 'Lemons',
                        icon: '🍋',
                        actualCost: 50,
                        currency: '₹',
                      },
                      {
                        id: 'sugar',
                        itemName: 'Sugar',
                        icon: '🧂',
                        actualCost: 30,
                        currency: '₹',
                      },
                      {
                        id: 'ice',
                        itemName: 'Ice',
                        icon: '🧊',
                        actualCost: 20,
                        currency: '₹',
                      },
                      {
                        id: 'cups',
                        itemName: 'Cups',
                        icon: '🥤',
                        actualCost: 25,
                        currency: '₹',
                      },
                      {
                        id: 'stand',
                        itemName: 'Stand',
                        icon: '🏕️',
                        actualCost: 200,
                        currency: '₹',
                      },
                      {
                        id: 'napkins',
                        itemName: 'Napkins',
                        icon: '🧼',
                        actualCost: 15,
                        currency: '₹',
                      },
                    ],
                    hints: [
                      'Ask a grown-up or make your best guess!',
                      'Think about what you might pay at a store.',
                    ],
                  },
                },
                {
                  id: 'funding-sources',
                  title: '💸 Level 3: Where Will the Money Come From?',
                  description:
                    'Learn about different ways to fund your business.',
                  objective:
                    'Choose how you will get money to start your business.',
                  type: 'funding',
                  isCompleted: false,
                  isUnlocked: false,
                  stars: 0,
                  gameData: {
                    prompt:
                      'How will you get the money to start your lemonade stand?',
                    fundingSources: [
                      {
                        id: 'pocket-money',
                        name: 'My Pocket Money',
                        icon: '💰',
                        description: 'Use your own saved money',
                        maxAmount: 100,
                      },
                      {
                        id: 'parents-loan',
                        name: 'Borrow from Parents',
                        icon: '🏦',
                        description: 'Ask parents for a loan',
                        maxAmount: 300,
                        interestRate: 0,
                      },
                      {
                        id: 'friend-partner',
                        name: 'Ask a Friend to Partner',
                        icon: '🤝',
                        description: 'Find a business partner',
                        maxAmount: 200,
                      },
                      {
                        id: 'not-enough',
                        name: "Don't Have Enough Yet",
                        icon: '🚫',
                        description: 'Need to save more money first',
                        maxAmount: 0,
                      },
                    ],
                    hints: [
                      'You can choose more than one option!',
                      'Think about what feels comfortable for you.',
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  getCourses(): readonly Course[] {
    return this.courses;
  }

  getCourse(courseId: string): Course | undefined {
    return this.courses.find((course) => course.id === courseId);
  }

  getUnit(courseId: string, unitId: string): Unit | undefined {
    const course = this.getCourse(courseId);
    return course?.units.find((unit) => unit.id === unitId);
  }

  getLesson(
    courseId: string,
    unitId: string,
    lessonId: string,
  ): Lesson | undefined {
    const unit = this.getUnit(courseId, unitId);
    return unit?.lessons.find((lesson) => lesson.id === lessonId);
  }

  getLevel(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
  ): Level | undefined {
    const lesson = this.getLesson(courseId, unitId, lessonId);
    return lesson?.levels.find((level) => level.id === levelId);
  }
  completeLevel(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
    stars: number,
  ): void {
    const level = this.getLevel(courseId, unitId, lessonId, levelId);

    if (level) {
      level.isCompleted = true;
      level.stars = Math.max(level.stars, stars);

      // Update progress using signals (modern approach)
      const currentProgress = this.progressSignal();

      if (!currentProgress.completedLevels.includes(levelId)) {
        // Create new progress object for immutability
        const updatedProgress = {
          ...currentProgress,
          completedLevels: [...currentProgress.completedLevels, levelId],
          totalStars: currentProgress.totalStars + stars,
        };

        this.progressSignal.set(updatedProgress);
      }

      // Unlock next level
      this.unlockNextLevel(courseId, unitId, lessonId, levelId);
    }
  }
  private unlockNextLevel(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
  ): void {
    const lesson = this.getLesson(courseId, unitId, lessonId);
    if (!lesson) {
      return;
    }

    const currentLevelIndex = lesson.levels.findIndex(
      (level) => level.id === levelId,
    );

    if (
      currentLevelIndex >= 0 &&
      currentLevelIndex < lesson.levels.length - 1
    ) {
      const nextLevel = lesson.levels[currentLevelIndex + 1];
      nextLevel.isUnlocked = true;

      // Update progress using signals
      const currentProgress = this.progressSignal();
      if (!currentProgress.unlockedLevels.includes(nextLevel.id)) {
        const updatedProgress = {
          ...currentProgress,
          unlockedLevels: [...currentProgress.unlockedLevels, nextLevel.id],
        };

        this.progressSignal.set(updatedProgress);
      }
    }
  }

  getProgress(): Observable<GameProgress> {
    return this.progress$;
  }
}
