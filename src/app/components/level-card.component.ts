import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Level } from '../models';

@Component({
  selector: 'app-level-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="h-full level-card"
      [class.completed]="level().isCompleted"
      [class.unlocked]="level().isUnlocked"
      [class.locked]="!level().isUnlocked"
      [routerLink]="level().isUnlocked ? levelRoute() : null"
    >
      <div
        class="flex relative flex-col p-2 h-full rounded-lg border shadow-md transition-all duration-200 cursor-pointer sm:p-3 lg:p-4 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 min-h-[80px] sm:min-h-[100px]"
        [ngClass]="levelCardClasses()"
      >
        <!-- Level Icon/Status -->
        <div class="mb-1 text-center sm:mb-2">
          <div class="text-lg sm:text-xl lg:text-2xl" [ngClass]="iconClasses()">
            {{ levelIcon() }}
          </div>
        </div>

        <!-- Level Info -->
        <div class="flex flex-col flex-1 justify-between">
          <h5
            class="mb-1 text-xs font-medium text-center sm:text-sm line-clamp-2"
            [ngClass]="titleClasses()"
          >
            {{ level().title }}
          </h5>

          <p class="flex-1 mb-1 text-xs text-center text-gray-500 sm:mb-2 line-clamp-2">
            {{ level().description }}
          </p>

          <!-- Stars -->
          @if (level().isCompleted) {
            <div class="flex justify-center space-x-1">
              @for (star of getStarsArray(level().stars); track $index) {
                <span class="text-sm text-yellow-400 sm:text-base">⭐</span>
              }
            </div>
          }
        </div>

        <!-- Play Button -->
        @if (level().isUnlocked && !level().isCompleted) {
          <div
            class="flex absolute -top-1 -right-1 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full sm:-top-2 sm:-right-2 sm:w-8 sm:h-8 sm:text-sm"
          >
            ▶
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCardComponent {
  readonly level = input.required<Level>();
  readonly courseId = input.required<string>();
  readonly unitId = input.required<string>();
  readonly lessonId = input.required<string>();

  readonly levelRoute = computed(() => [
    '/level',
    this.courseId(),
    this.unitId(),
    this.lessonId(),
    this.level().id,
  ]);

  readonly levelIcon = computed(() => {
    const currentLevel = this.level();
    if (currentLevel.isCompleted) return '✅';
    if (!currentLevel.isCompleted && currentLevel.isUnlocked) return '🎯';
    return '🔒';
  });

  readonly levelCardClasses = computed(() => {
    const currentLevel = this.level();
    return {
      'border-green-300 bg-green-50': currentLevel.isCompleted,
      'border-blue-300 bg-blue-50': currentLevel.isUnlocked && !currentLevel.isCompleted,
      'border-gray-200 bg-gray-50 opacity-50': !currentLevel.isUnlocked,
    };
  });

  readonly iconClasses = computed(() => {
    const currentLevel = this.level();
    return {
      'text-green-600': currentLevel.isCompleted,
      'text-blue-600': !currentLevel.isCompleted && currentLevel.isUnlocked,
      'text-gray-400': !currentLevel.isUnlocked,
    };
  });

  readonly titleClasses = computed(() => {
    const currentLevel = this.level();
    return {
      'text-green-800': currentLevel.isCompleted,
      'text-blue-800': currentLevel.isUnlocked && !currentLevel.isCompleted,
      'text-gray-500': !currentLevel.isUnlocked,
    };
  });

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
}
