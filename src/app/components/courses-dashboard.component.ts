import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../services/course.service';
import {
  ProgressOverviewComponent,
  UserProgress,
} from './progress-overview.component';
import { CourseCardComponent } from './course-card.component';
import { Course } from '../models/course.models';
import { HeaderComponent } from './header.component';

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
  private courseService = inject(CourseService);

  // Signals for reactive state management
  courses = signal<Course[]>([]);
  progress = signal<UserProgress>({
    totalStars: 0,
    completedLevels: [],
    unlockedLevels: [],
  });

  // Computed signals for derived state
  totalLevels = computed(() => {
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

  completionPercentage = computed(() => {
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
    this.courseService.getProgress().subscribe((progressData) => {
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
}
