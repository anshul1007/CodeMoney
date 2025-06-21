import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

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
  template: `
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
      <div class="p-4 mx-auto max-w-7xl sm:p-6 xl:p-8 2xl:p-10">
        <div class="flex justify-between items-center mb-2 xl:mb-3">
          <div class="flex items-center space-x-4 xl:space-x-5">
            <span class="text-sm font-medium text-gray-700 xl:text-base">Your Progress</span>
            <span class="text-xs text-gray-600 xl:text-sm">Level {{ currentLevel() }}</span>
          </div>
          <div
            class="flex items-center space-x-4 text-xs text-gray-600 sm:text-sm xl:space-x-5 xl:text-base"
          >
            <span>🌟 {{ progress().totalStars }}</span>
            <span>✅ {{ progress().completedLevels.length }}/{{ totalLevels() }} </span>
            <span class="font-medium text-blue-600"> {{ progressPercentage() }}% </span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-3 bg-gray-200 rounded-full sm:h-4 xl:h-5">
          <div
            class="overflow-hidden relative h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out sm:h-4 xl:h-5"
            [style.width.%]="progressPercentage()"
          >
            <!-- Animated shine effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Quick stats -->
        <div
          class="flex justify-between items-center mt-2 text-xs text-gray-500 xl:mt-3 xl:text-sm"
        >
          <span>{{ progress().completedLevels.length }} levels completed</span>
          <span>{{ totalLevels() - progress().completedLevels.length }} remaining</span>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressOverviewComponent {
  readonly courses = input<readonly Course[]>([]);
  readonly progress = input<UserProgress>({
    totalStars: 0,
    completedLevels: [],
    unlockedLevels: [],
  });

  readonly levelClick = output<{
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
