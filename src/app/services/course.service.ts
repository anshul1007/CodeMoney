import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, Observable } from 'rxjs';

import { Course, Lesson, Level, Unit } from '../models/course.models';

import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  #http = inject(HttpClient);
  #progressService = inject(ProgressService);

  private readonly mockUrl = '/mock-courses.json';

  private readonly baseCourses = toSignal(this.getCourses(), {
    initialValue: [],
  });

  // Computed courses that include progress data
  readonly courses = computed(() => {
    const rawCourses = this.baseCourses();
    return rawCourses.map((course) => this.applyProgressToCourse(course));
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

  private applyProgressToCourse(course: Course): Course {
    return {
      ...course,
      units: course.units.map((unit) => this.applyProgressToUnit(course.id, unit)),
    };
  }

  private applyProgressToUnit(courseId: string, unit: Unit): Unit {
    return {
      ...unit,
      lessons: unit.lessons.map((lesson) => this.applyProgressToLesson(courseId, unit.id, lesson)),
    };
  }

  private applyProgressToLesson(courseId: string, unitId: string, lesson: Lesson): Lesson {
    return {
      ...lesson,
      levels: lesson.levels.map((level, index) =>
        this.applyProgressToLevel(courseId, unitId, lesson.id, level, index, lesson.levels),
      ),
    };
  }

  private applyProgressToLevel(
    courseId: string,
    unitId: string,
    lessonId: string,
    level: Level,
    index: number,
    allLevels: Level[],
  ): Level {
    // Check if this level is completed
    const isCompleted = this.#progressService.isLevelCompleted(
      courseId,
      unitId,
      lessonId,
      level.id,
    );

    // Determine if this level should be unlocked
    let isUnlocked = false;

    if (index === 0) {
      // First level is always unlocked
      isUnlocked = true;
    } else {
      // Level is unlocked if the previous level is completed
      const previousLevel = allLevels[index - 1];
      isUnlocked = this.#progressService.isLevelCompleted(
        courseId,
        unitId,
        lessonId,
        previousLevel.id,
      );
    }

    // Get stars for completed levels
    const stars = isCompleted
      ? this.#progressService.getLevelStars(courseId, unitId, lessonId, level.id)
      : 0;

    return {
      ...level,
      isCompleted,
      isUnlocked,
      stars,
    };
  }
}
