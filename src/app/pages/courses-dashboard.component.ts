import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  DestroyRef,
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
  templateUrl: './courses-dashboard.component.html',
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
  onLevelClick(event: {
    courseId: string;
    unitId: string;
    lessonId: string;
    levelId: string;
  }): void {
    // Level click handling is done by routerLink in template
  }

  // Performance optimization: trackBy function
  readonly trackByCourseId = (index: number, course: Course): string =>
    course.id;
}
