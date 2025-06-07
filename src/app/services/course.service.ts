import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Course,
  Unit,
  Lesson,
  Level,
  GameProgress,
} from '../models/game.models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private progressSubject = new BehaviorSubject<GameProgress>({
    currentCourse: 'money-mission',
    currentUnit: 'lemonade-stand',
    currentLesson: 'getting-started',
    currentLevel: 'choose-items',
    completedLevels: [],
    unlockedLevels: ['choose-items'],
    score: 0,
    totalStars: 0,
  });

  progress$ = this.progressSubject.asObservable();

  private courses: Course[] = [
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

  getCourses(): Course[] {
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
    console.log('completeLevel called with:', {
      courseId,
      unitId,
      lessonId,
      levelId,
      stars,
    });

    const level = this.getLevel(courseId, unitId, lessonId, levelId);
    console.log('Found level:', level);

    if (level) {
      level.isCompleted = true;
      level.stars = Math.max(level.stars, stars);
      console.log('Level marked as completed with stars:', level.stars);

      // Update progress
      const currentProgress = this.progressSubject.value;
      if (!currentProgress.completedLevels.includes(levelId)) {
        currentProgress.completedLevels.push(levelId);
        currentProgress.totalStars += stars;
        console.log(
          'Updated progress - completed levels:',
          currentProgress.completedLevels,
        );
      }

      // Unlock next level
      this.unlockNextLevel(courseId, unitId, lessonId, levelId);

      this.progressSubject.next(currentProgress);
      console.log('Progress updated and broadcast');
    } else {
      console.log('Level not found for completion');
    }
  }
  private unlockNextLevel(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
  ): void {
    console.log('unlockNextLevel called with:', {
      courseId,
      unitId,
      lessonId,
      levelId,
    });

    const lesson = this.getLesson(courseId, unitId, lessonId);
    if (!lesson) {
      console.log('Lesson not found for unlocking next level');
      return;
    }

    console.log(
      'Found lesson with levels:',
      lesson.levels.map((l) => ({ id: l.id, isUnlocked: l.isUnlocked })),
    );

    const currentLevelIndex = lesson.levels.findIndex(
      (level) => level.id === levelId,
    );

    console.log(
      'Current level index:',
      currentLevelIndex,
      'Total levels:',
      lesson.levels.length,
    );

    if (
      currentLevelIndex >= 0 &&
      currentLevelIndex < lesson.levels.length - 1
    ) {
      const nextLevel = lesson.levels[currentLevelIndex + 1];
      console.log(
        'Next level to unlock:',
        nextLevel.id,
        'Currently unlocked:',
        nextLevel.isUnlocked,
      );

      nextLevel.isUnlocked = true;

      const currentProgress = this.progressSubject.value;
      if (!currentProgress.unlockedLevels.includes(nextLevel.id)) {
        currentProgress.unlockedLevels.push(nextLevel.id);
        console.log('Added to unlocked levels:', nextLevel.id);
        console.log('All unlocked levels:', currentProgress.unlockedLevels);
      } else {
        console.log('Level was already unlocked:', nextLevel.id);
      }
    } else {
      console.log(
        'No next level to unlock - either invalid index or last level',
      );
    }
  }

  getProgress(): Observable<GameProgress> {
    return this.progress$;
  }
}
