import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Unit } from '../models/course.models';
import { LessonCardComponent } from './lesson-card.component';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LessonCardComponent],
  template: `
    <div
      class="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden"
    >
      <!-- Unit Header -->
      <div class="bg-gray-50 p-3 sm:p-4 border-b border-gray-200">
        <div>
          <h3
            class="text-sm sm:text-base lg:text-lg font-bold text-gray-800 truncate"
          >
            {{ unit().title }}
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
            {{ unit().description }}
          </p>
        </div>
      </div>

      <!-- Lessons -->
      <div class="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 lg:space-y-4">
        @for (lesson of unit().lessons; track lesson.id) {
          <app-lesson-card
            [lesson]="lesson"
            [courseId]="courseId()"
            [unitId]="unit().id"
            (levelClick)="onLevelClick($event)"
          >
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
  readonly levelClick = output<{
    courseId: string;
    unitId: string;
    lessonId: string;
    levelId: string;
  }>();

  onLevelClick(event: {
    courseId: string;
    unitId: string;
    lessonId: string;
    levelId: string;
  }): void {
    this.levelClick.emit(event);
  }
}
