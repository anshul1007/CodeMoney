import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
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
})
export class ProgressOverviewComponent {
  @Input() courses = signal<Course[]>([]);
  @Input() progress = signal<UserProgress>({
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

  // Computed signals for calculations
  totalLevels = computed(() => {
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

  progressPercentage = computed(() => {
    const total = this.totalLevels();
    if (total === 0) return 0;
    return Math.round((this.progress().completedLevels.length / total) * 100);
  });

  currentLevel = computed(() => {
    return Math.floor(this.progress().totalStars / 10) + 1;
  });
}
