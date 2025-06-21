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
    <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      <!-- Course Header - Mobile optimized -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6">
        <div class="flex items-center space-x-3">
          <span class="text-2xl sm:text-3xl lg:text-4xl flex-shrink-0">
            {{ course().icon }}
          </span>
          <div class="min-w-0 flex-1">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              {{ course().title }}
            </h2>
            <p class="text-blue-100 text-sm sm:text-base mt-1 line-clamp-2">
              {{ course().description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Units - Mobile first spacing -->
      <div class="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
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
