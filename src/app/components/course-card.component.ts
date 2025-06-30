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
    <div class="w-full overflow-hidden bg-white rounded-xl shadow-lg sm:rounded-2xl">
      <!-- Course Header - Mobile optimized -->
      <div
        class="p-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 sm:p-6 xl:p-8 2xl:p-10"
      >
        <div class="flex items-center space-x-3 xl:space-x-4 2xl:space-x-5">
          <span class="flex-shrink-0 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
            {{ course().icon }}
          </span>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl truncate">
              {{ course().title }}
            </h2>
            <p class="mt-1 text-sm text-blue-100 sm:text-base xl:text-lg 2xl:text-xl line-clamp-2">
              {{ course().description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Units - Mobile first spacing -->
      <div class="p-4 space-y-4 sm:p-6 sm:space-y-6 xl:p-8 xl:space-y-8 2xl:p-10">
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
