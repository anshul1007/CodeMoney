import {
  Component,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Level } from '../models/game.models';

@Component({
  selector: 'app-level-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="level-card cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95"
      [class.completed]="level().isCompleted"
      [class.unlocked]="level().isUnlocked"
      [class.locked]="!level().isUnlocked"
      (click)="onLevelClick()"
      [routerLink]="level().isUnlocked ? levelRoute() : null"
    >
      <div
        class="border rounded-lg p-2 sm:p-3 lg:p-4 relative min-h-[80px] sm:min-h-[100px] flex flex-col"
        [ngClass]="levelCardClasses()"
      >
        <!-- Level Icon/Status -->
        <div class="text-center mb-1 sm:mb-2">
          <div class="text-lg sm:text-xl lg:text-2xl" [ngClass]="iconClasses()">
            {{ levelIcon() }}
          </div>
        </div>

        <!-- Level Info -->
        <div class="flex-1 flex flex-col justify-between">
          <h5
            class="font-medium text-xs sm:text-sm text-center mb-1 line-clamp-2"
            [ngClass]="titleClasses()"
          >
            {{ level().title }}
          </h5>

          <p
            class="text-xs text-center text-gray-500 mb-1 sm:mb-2 line-clamp-2 flex-1"
          >
            {{ level().description }}
          </p>

          <!-- Stars -->
          @if (level().isCompleted) {
            <div class="flex justify-center space-x-1">
              @for (star of getStarsArray(level().stars); track $index) {
                <span class="text-yellow-400 text-sm sm:text-base">⭐</span>
              }
            </div>
          }
        </div>

        <!-- Play Button -->
        @if (level().isUnlocked && !level().isCompleted) {
          <div
            class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-blue-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold"
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
  readonly levelClick = output<{
    courseId: string;
    unitId: string;
    lessonId: string;
    levelId: string;
  }>();

  // Computed properties for cleaner template
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
      'border-blue-300 bg-blue-50':
        currentLevel.isUnlocked && !currentLevel.isCompleted,
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
  onLevelClick(): void {
    this.levelClick.emit({
      courseId: this.courseId(),
      unitId: this.unitId(),
      lessonId: this.lessonId(),
      levelId: this.level().id,
    });
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
}
