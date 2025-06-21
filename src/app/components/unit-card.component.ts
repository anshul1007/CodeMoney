import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Unit } from '../models/course.models';

import { LessonCardComponent } from './lesson-card.component';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LessonCardComponent],
  template: `
    <div class="overflow-hidden rounded-lg border border-gray-200 sm:rounded-xl">
      <!-- Unit Header -->
      <div class="p-3 bg-gray-50 border-b border-gray-200 sm:p-4">
        <div>
          <h3 class="text-sm font-bold text-gray-800 sm:text-base lg:text-lg truncate">
            {{ unit().title }}
          </h3>
          <p class="mt-1 text-xs text-gray-600 sm:text-sm line-clamp-2">
            {{ unit().description }}
          </p>
        </div>
      </div>

      <!-- Lessons -->
      <div class="p-2 space-y-2 sm:p-3 sm:space-y-3 lg:p-4 lg:space-y-4">
        @for (lesson of unit().lessons; track lesson.id) {
          <app-lesson-card [lesson]="lesson" [courseId]="courseId()" [unitId]="unit().id">
          </app-lesson-card>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitCardComponent {
  readonly unit = input.required<Unit>();
  readonly courseId = input.required<string>();
}
