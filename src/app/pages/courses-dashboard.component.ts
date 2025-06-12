import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CourseService } from '../services/course.service';
import {
  ProgressOverviewComponent,
  UserProgress,
} from '../components/progress-overview.component';
import { CourseCardComponent } from '../components/course-card.component';
import { Course } from '../models/course.models';
import { HeaderComponent } from '../components/header.component';

@Component({
  selector: 'app-courses-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProgressOverviewComponent,
    CourseCardComponent,
    HeaderComponent,
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <!-- Header Component -->
      <app-header title="💰 Course Dashboard"></app-header>

      <!-- Progress Bar Section -->
      <app-progress-overview
        [progress]="progress()"
        [courses]="courses()"
      ></app-progress-overview>

      <!-- Content -->
      <div class="container mx-auto max-w-7xl px-4 md:px-6">
        <!-- Courses Grid with Enhanced Performance -->
        <div
          class="grid gap-4 sm:gap-6"
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
export class CoursesDashboardComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly destroyRef = inject(DestroyRef);

  // Signals for reactive state management
  readonly courses = signal<readonly Course[]>([]);
  readonly progress = signal<UserProgress>({
    totalStars: 0,
    completedLevels: [],
    unlockedLevels: [],
  });

  // Computed signals for derived state
  readonly totalLevels = computed(() => {
    return this.courses().reduce((total, course) => {
      return (
        total +
        course.units.reduce((unitTotal, unit) => {
          return (
            unitTotal +
            unit.lessons.reduce((lessonTotal, lesson) => {
              return lessonTotal + lesson.levels.length;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  });

  readonly completionPercentage = computed(() => {
    const total = this.totalLevels();
    if (total === 0) return 0;
    return Math.round((this.progress().completedLevels.length / total) * 100);
  });

  ngOnInit(): void {
    this.loadCourses();
    this.loadProgress();
  }

  private loadCourses(): void {
    const coursesData = this.courseService.getCourses();
    this.courses.set(coursesData);
  }
  private loadProgress(): void {
    this.courseService
      .getProgress()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((progressData) => {
        this.progress.set({
          totalStars: progressData.totalStars,
          completedLevels: progressData.completedLevels,
          unlockedLevels: progressData.unlockedLevels,
        });
      });
  }

  // Performance optimization: trackBy function
  readonly trackByCourseId = (index: number, course: Course): string =>
    course.id;
}
