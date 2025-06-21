import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CourseCardComponent, HeaderComponent } from '../components';
import { ProgressOverviewComponent, UserProgress } from '../components/progress-overview.component';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-courses-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ProgressOverviewComponent,
    CourseCardComponent,
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <!-- Navigation Header -->
      <app-header title="💰 Course Dashboard"></app-header>

      <!-- User Progress Overview -->
      <!-- <app-progress-overview
        [progress]="progress()"
        [courses]="courses()"
      ></app-progress-overview> -->

      <!-- Main Content: Courses Grid -->
      <div class="container mx-auto max-w-7xl px-4 md:px-6">
        <div class="grid gap-4 sm:gap-6" role="main" aria-label="Available courses">
          @for (course of courses(); track course.id) {
            <app-course-card [course]="course"></app-course-card>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesDashboardComponent {
  private readonly courseService = inject(CourseService);

  readonly courses = this.courseService.courses;

  readonly progress = signal<UserProgress>({
    totalStars: 0,
    completedLevels: [],
    unlockedLevels: [],
  });
}
