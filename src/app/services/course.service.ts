import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, Observable } from 'rxjs';

import { Course, Lesson, Level, Unit } from '../models/course.models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  #http = inject(HttpClient);

  private readonly mockUrl = '/mock-courses.json';

  readonly courses = toSignal(this.getCourses(), {
    initialValue: [],
  });

  getCourses(): Observable<readonly Course[]> {
    return this.#http
      .get<{ courses: Course[] }>(this.mockUrl)
      .pipe(map((response) => response.courses));
  }

  readonly getCourse = computed(() => (courseId: string): Course | undefined => {
    return this.courses()?.find((course) => course.id === courseId);
  });

  readonly getUnit = computed(() => (courseId: string, unitId: string): Unit | undefined => {
    const course = this.getCourse()(courseId);
    return course?.units.find((unit) => unit.id === unitId);
  });

  readonly getLesson = computed(
    () =>
      (courseId: string, unitId: string, lessonId: string): Lesson | undefined => {
        const unit = this.getUnit()(courseId, unitId);
        return unit?.lessons.find((lesson) => lesson.id === lessonId);
      },
  );

  readonly getLevel = computed(
    () =>
      (courseId: string, unitId: string, lessonId: string, levelId: string): Level | undefined => {
        const lesson = this.getLesson()(courseId, unitId, lessonId);
        return lesson?.levels.find((level) => level.id === levelId);
      },
  );

  // private readonly progressSignal = signal<GameProgress>({
  //   currentCourse: 'money-mission',
  //   currentUnit: 'lemonade-stand',
  //   currentLesson: 'getting-started',
  //   currentLevel: 'choose-items',
  //   completedLevels: [],
  //   unlockedLevels: ['choose-items'],
  //   score: 0,
  //   totalStars: 0,
  // });

  // // Modern computed signals for derived state
  // readonly completedLevelsCount = computed(
  //   () => this.progressSignal().completedLevels.length,
  // );

  // readonly unlockedLevelsCount = computed(
  //   () => this.progressSignal().unlockedLevels.length,
  // );

  // readonly totalStars = computed(() => this.progressSignal().totalStars);

  // // Public read-only access to progress signal
  // readonly progress = this.progressSignal.asReadonly();

  // // readonly courses = toSignal(this.http.get<Course[]>(this.mockUrl), {
  // //   initialValue: [],
  // // });

  // completeLevel(
  //   courseId: string,
  //   unitId: string,
  //   lessonId: string,
  //   levelId: string,
  //   stars: number,
  // ): void {
  //   const level = this.getLevel(courseId, unitId, lessonId, levelId);

  //   if (level) {
  //     level.isCompleted = true;
  //     level.stars = Math.max(level.stars, stars);

  //     // Update progress using signals (modern approach)
  //     const currentProgress = this.progressSignal();

  //     if (!currentProgress.completedLevels.includes(levelId)) {
  //       // Create new progress object for immutability
  //       const updatedProgress = {
  //         ...currentProgress,
  //         completedLevels: [...currentProgress.completedLevels, levelId],
  //         totalStars: currentProgress.totalStars + stars,
  //       };

  //       this.progressSignal.set(updatedProgress);
  //     }

  //     // Unlock next level
  //     this.unlockNextLevel(courseId, unitId, lessonId, levelId);
  //   }
  // }
  // private unlockNextLevel(
  //   courseId: string,
  //   unitId: string,
  //   lessonId: string,
  //   levelId: string,
  // ): void {
  //   const lesson = this.getLesson(courseId, unitId, lessonId);
  //   if (!lesson) {
  //     return;
  //   }

  //   const currentLevelIndex = lesson.levels.findIndex(
  //     (level) => level.id === levelId,
  //   );

  //   if (
  //     currentLevelIndex >= 0 &&
  //     currentLevelIndex < lesson.levels.length - 1
  //   ) {
  //     const nextLevel = lesson.levels[currentLevelIndex + 1];
  //     nextLevel.isUnlocked = true;

  //     // Update progress using signals
  //     const currentProgress = this.progressSignal();
  //     if (!currentProgress.unlockedLevels.includes(nextLevel.id)) {
  //       const updatedProgress = {
  //         ...currentProgress,
  //         unlockedLevels: [...currentProgress.unlockedLevels, nextLevel.id],
  //       };

  //       this.progressSignal.set(updatedProgress);
  //     }
  //   }
  // }

  // getProgress() {
  //   return this.progressSignal;
  // }
}
