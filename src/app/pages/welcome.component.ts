import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Course } from '../models';
import { AnalyticsService } from '../services/analytics.service';
import { CourseService } from '../services/course.service';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  private readonly courseService = inject(CourseService);
  private readonly progressService = inject(ProgressService);
  private readonly analyticsService = inject(AnalyticsService);

  readonly courses = this.courseService.courses;

  // Get the first available course for the featured course section
  readonly featuredCourse = computed(() => {
    const allCourses = this.courses();
    return allCourses.length > 0 ? allCourses[0] : null;
  });

  // Get learning topics dynamically from the first course
  readonly learningTopics = computed(() => {
    const course = this.featuredCourse();
    if (!course || !course.units.length) {
      return this.getDefaultLearningTopics();
    }

    const topics: { icon: string; title: string; description: string }[] = [];

    // Extract learning concepts from the course structure
    course.units.forEach((unit) => {
      unit.lessons.forEach((lesson) => {
        lesson.levels.forEach((level) => {
          // Map level objectives to learning topics
          if (level.id === 'choose-items') {
            topics.push({
              icon: '🧩',
              title: 'Item Selection',
              description: 'Learn what you need to start a business by choosing the right items',
            });
          } else if (level.id === 'estimate-costs') {
            topics.push({
              icon: '💰',
              title: 'Cost Estimation',
              description: 'Practice estimating how much business items cost in the real world',
            });
          } else if (level.id === 'funding-sources') {
            topics.push({
              icon: '💸',
              title: 'Funding Sources',
              description: 'Discover different ways to get money to start your business',
            });
          } else if (level.id === 'interactive-balance') {
            topics.push({
              icon: '⚖️',
              title: 'Balance Sheets',
              description: 'Learn how to track your business finances and balance your books',
            });
          }
        });
      });
    });

    // Add star scoring as a universal concept
    topics.push({
      icon: '⭐',
      title: 'Star Scoring',
      description: 'Earn stars based on your performance and unlock new levels',
    });

    return topics.slice(0, 4); // Limit to 4 topics for display
  });

  private getDefaultLearningTopics() {
    return [
      {
        icon: '🧩',
        title: 'Item Selection',
        description: 'Learn what you need to start a business by choosing the right items',
      },
      {
        icon: '💰',
        title: 'Cost Estimation',
        description: 'Practice estimating how much business items cost in the real world',
      },
      {
        icon: '💸',
        title: 'Funding Sources',
        description: 'Discover different ways to get money to start your business',
      },
      {
        icon: '⭐',
        title: 'Star Scoring',
        description: 'Earn stars based on your performance and unlock new levels',
      },
    ];
  }

  startGame() {
    // Track user starting their learning journey
    this.analyticsService.trackUserEngagement('start_learning', 'user_journey', {
      from_page: 'welcome',
      first_time: this.progressService.progress().completedLevels.length === 0,
    });

    // Track conversion event
    this.analyticsService.trackConversion('learning_journey_start', 1, {
      entry_point: 'welcome_page',
    });
  }

  getTotalLevelsCount(course: Course): number {
    let totalLevels = 0;
    course.units.forEach((unit) => {
      unit.lessons.forEach((lesson) => {
        totalLevels += lesson.levels.length;
      });
    });
    return totalLevels;
  }

  resetProgress() {
    // Track progress reset
    const currentProgress = this.progressService.progress();
    this.analyticsService.trackUserEngagement('reset_progress', 'user_action', {
      completed_levels: currentProgress.completedLevels.length,
      total_stars: currentProgress.totalStars,
    });

    // Use progress service to reset all progress
    this.progressService.resetProgress();
    alert('Progress has been reset!');
  }
}
