import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Lesson } from '../models/course.models';

import { LevelCardComponent } from './level-card.component';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LevelCardComponent],
  template: `
    <div class="border border-gray-100 rounded-lg overflow-hidden">
      <!-- Lesson Header -->
      <div class="bg-gray-25 p-2 sm:p-3 border-b border-gray-100">
        <div>
          <h4 class="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base truncate">
            {{ lesson().title }}
          </h4>
          <p class="text-xs text-gray-500 mt-1 line-clamp-1 sm:line-clamp-2">
            {{ lesson().description }}
          </p>
        </div>
      </div>
      <!-- Levels Grid -->
      <div class="p-2 sm:p-3">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 auto-rows-fr">
          @for (level of lesson().levels; track level.id) {
            <app-level-card
              [level]="level"
              [courseId]="courseId()"
              [unitId]="unitId()"
              [lessonId]="lesson().id"
            >
            </app-level-card>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonCardComponent {
  readonly lesson = input.required<Lesson>();
  readonly courseId = input.required<string>();
  readonly unitId = input.required<string>();
}
