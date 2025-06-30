import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CourseCardComponent, HeaderComponent } from '../components';
import { ProgressOverviewComponent, UserProgress } from '../components/progress-overview.component';
import { CourseService } from '../services/course.service';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-courses-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    CourseCardComponent,
    ProgressOverviewComponent,
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br via-indigo-50 to-violet-50 from-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <!-- Navigation Header -->
      <app-header title="💰 Course Dashboard"></app-header>

      <!-- User Progress Overview -->
      <app-progress-overview [progress]="progress()" [courses]="courses()"></app-progress-overview>

      <!-- Main Content: Courses Grid -->
      <div
        class="py-8 px-4 mx-auto max-w-7xl sm:py-12 sm:px-6 md:py-12 xl:py-16 xl:px-8 2xl:py-16 2xl:px-10"
      >
        <div
          class="w-full grid grid-cols-1 gap-4 sm:gap-6 xl:gap-8 2xl:gap-10 text-center"
          role="main"
          aria-label="Available courses"
        >
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
  private readonly progressService = inject(ProgressService);

  readonly courses = this.courseService.courses;

  readonly progress = computed<UserProgress>(() => {
    const progressData = this.progressService.progress();
    const stats = this.progressService.getCompletionStats();

    return {
      totalStars: stats.totalStars,
      completedLevels: progressData.completedLevels,
      unlockedLevels: progressData.unlockedLevels,
      currentCourse: progressData.currentCourse,
      currentUnit: progressData.currentUnit,
      currentLesson: progressData.currentLesson,
      currentLevel: progressData.currentLevel,
    };
  });
}
