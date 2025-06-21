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
    <div class="overflow-hidden rounded-lg border border-gray-200 sm:rounded-xl xl:rounded-2xl">
      <!-- Unit Header -->
      <div class="p-4 bg-gray-50 border-b border-gray-200 sm:p-6 xl:p-8">
        <div>
          <h3 class="text-sm font-bold text-gray-800 sm:text-base lg:text-lg xl:text-xl truncate">
            {{ unit().title }}
          </h3>
          <p class="mt-1 text-xs text-gray-600 sm:text-sm xl:text-base line-clamp-2">
            {{ unit().description }}
          </p>
        </div>
      </div>

      <!-- Lessons -->
      <div class="p-4 space-y-4 sm:p-6 sm:space-y-6 xl:p-8 xl:space-y-8">
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
