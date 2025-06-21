import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Course } from '../models/course.models';

import { UnitCardComponent } from './unit-card.component';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule, UnitCardComponent],
  template: `
    <div class="overflow-hidden bg-white rounded-xl shadow-lg sm:rounded-2xl">
      <!-- Course Header - Mobile optimized -->
      <div class="p-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 sm:p-6">
        <div class="flex items-center space-x-3">
          <span class="flex-shrink-0 text-2xl sm:text-3xl lg:text-4xl">
            {{ course().icon }}
          </span>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold sm:text-xl lg:text-2xl truncate">
              {{ course().title }}
            </h2>
            <p class="mt-1 text-sm text-blue-100 sm:text-base line-clamp-2">
              {{ course().description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Units - Mobile first spacing -->
      <div class="p-3 space-y-3 sm:p-4 sm:space-y-4 lg:p-6 lg:space-y-6">
        @for (unit of course().units; track unit.id) {
          <app-unit-card [unit]="unit" [courseId]="course().id"> </app-unit-card>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
  readonly course = input.required<Course>();
}
