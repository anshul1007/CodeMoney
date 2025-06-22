import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Course } from '../models/course.models';

export interface UserProgress {
  totalStars: number;
  completedLevels: string[];
  unlockedLevels: string[];
  currentCourse?: string;
  currentUnit?: string;
  currentLesson?: string;
  currentLevel?: string;
}

@Component({
  selector: 'app-progress-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-purple-50 border-t border-gray-100">
      <div class="p-4 mx-auto max-w-7xl sm:p-6 xl:p-8 2xl:p-10">
        <div class="flex justify-between items-center mb-2 xl:mb-3">
          <div class="flex items-center space-x-4 xl:space-x-5">
            <span class="text-sm font-medium text-gray-700 xl:text-base">Your Progress</span>
            <span class="text-xs text-gray-600 xl:text-sm">{{ levelDisplayText() }}</span>
          </div>
          <div
            class="flex items-center space-x-4 text-xs text-gray-600 sm:text-sm xl:space-x-5 xl:text-base"
          >
            <span>🌟 {{ progress().totalStars }}</span>
            <span>✅ {{ progress().completedLevels.length }}/{{ totalLevels() }} </span>
            <span class="font-medium text-blue-600"> {{ progressPercentage() }}% </span>
          </div>
        </div>

        <!-- Current section info -->
        <div class="mb-3 text-center">
          <span class="text-xs font-medium text-gray-500 xl:text-sm">Currently Learning:</span>
          <span class="ml-2 text-sm font-semibold text-blue-700 xl:text-base">
            {{ currentSectionInfo() }}
          </span>
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

        <!-- Completion message -->
        <div class="mt-2 text-xs text-center text-gray-600 xl:mt-3 xl:text-sm">
          <span class="italic">{{ completionMessage() }}</span>
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
    const completedCount = this.progress().completedLevels.length;
    const totalLevels = this.totalLevels();

    // If all levels are completed, show the total count
    if (completedCount >= totalLevels) {
      return totalLevels;
    }

    // Otherwise, show which level they're currently working on (next to complete)
    return Math.min(completedCount + 1, totalLevels);
  });

  readonly levelDisplayText = computed(() => {
    const completedCount = this.progress().completedLevels.length;
    const totalLevels = this.totalLevels();

    if (completedCount >= totalLevels) {
      return 'All Complete! 🎉';
    }

    return `Level ${completedCount + 1}/${totalLevels}`;
  });

  readonly currentSectionInfo = computed(() => {
    const progress = this.progress();
    const courses = this.courses();

    if (!progress.currentCourse || !progress.currentUnit || !progress.currentLesson) {
      return 'Getting Started';
    }

    // Find the current course, unit, and lesson to get readable names
    const course = courses.find((c) => c.id === progress.currentCourse);
    if (!course) return 'Getting Started';

    const unit = course.units.find((u) => u.id === progress.currentUnit);
    if (!unit) return course.title;

    const lesson = unit.lessons.find((l) => l.id === progress.currentLesson);
    if (!lesson) return `${course.title} - ${unit.title}`;

    return `${course.title} - ${unit.title} - ${lesson.title}`;
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
