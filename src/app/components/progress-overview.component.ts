import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../models/course.models';

export interface UserProgress {
  totalStars: number;
  completedLevels: string[];
  unlockedLevels: string[];
}

@Component({
  selector: 'app-progress-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressOverviewComponent {
  readonly courses = input<readonly Course[]>([]);
  readonly progress = input<UserProgress>({
    totalStars: 0,
    completedLevels: [],
    unlockedLevels: [],
  });

  @Output() levelClick = new EventEmitter<{
    courseId: string;
    unitId: string;
    lessonId: string;
    levelId: string;
  }>();

  // Optimized computed signals for performance
  readonly totalLevels = computed(() => {
    return this.courses().reduce((total, course) => {
      return (
        total +
        course.units.reduce((unitTotal, unit) => {
          return (
            unitTotal +
            unit.lessons.reduce((lessonTotal, lesson) => {
              return lessonTotal + lesson.levels.length;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalLevels();
    if (total === 0) return 0;
    return Math.round((this.progress().completedLevels.length / total) * 100);
  });

  readonly currentLevel = computed(() => {
    return Math.floor(this.progress().totalStars / 10) + 1;
  });

  readonly completionMessage = computed(() => {
    const percentage = this.progressPercentage();
    if (percentage === 0) return 'Start your learning journey!';
    if (percentage < 25) return 'Great start! Keep going!';
    if (percentage < 50) return "You're making good progress!";
    if (percentage < 75) return 'Excellent work! Almost there!';
    if (percentage < 100) return 'So close to completing everything!';
    return "Congratulations! You've completed all levels!";
  });
}
