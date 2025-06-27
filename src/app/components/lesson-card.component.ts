import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Lesson } from '../models/course.models';

import { LevelCardComponent } from './level-card.component';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LevelCardComponent],
  template: `
    <div class="overflow-hidden mb-4 rounded-lg border border-gray-100">
      <!-- Lesson Header -->
      <div class="p-2 border-b border-gray-100 sm:p-3 bg-gray-25">
        <div>
          <h4 class="text-xs font-semibold text-gray-800 sm:text-sm lg:text-base truncate">
            {{ lesson().title }}
          </h4>
          <p class="mt-1 text-xs text-gray-500 line-clamp-1 sm:line-clamp-2">
            {{ lesson().description }}
          </p>
        </div>
      </div>
      <!-- Levels Grid -->
      <div class="p-2 sm:p-3">
        <div class="grid grid-cols-2 auto-rows-fr gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
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
