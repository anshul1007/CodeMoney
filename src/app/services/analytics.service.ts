import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

export interface AnalyticsConfig {
  trackingId: string;
  debug?: boolean;
  anonymizeIp?: boolean;
}

export interface UserProgressEvent {
  courseId: string;
  unitId: string;
  lessonId: string;
  levelId: string;
  action: 'started' | 'completed' | 'failed' | 'abandoned';
  score?: number;
  stars?: number;
  duration?: number;
  attempts?: number;
}

export interface CourseSelectionEvent {
  courseId: string;
  courseName: string;
  previousCourse?: string;
  totalCoursesAvailable: number;
}

export interface LevelProgressEvent {
  courseId: string;
  unitId: string;
  lessonId: string;
  levelId: string;
  levelName: string;
  progress: number; // 0-100
  isCompleted: boolean;
  timeSpent: number; // in seconds
  hintsUsed: number;
  errors: number;
}

export interface UserBehaviorEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private config: AnalyticsConfig = {
    trackingId: 'G-J4FDCGEN5Y',
    debug: !isPlatformBrowser(this.platformId) ? false : window.location.hostname === 'localhost',
    anonymizeIp: true,
  };

  private sessionStartTime = Date.now();
  private levelStartTimes = new Map<string, number>();
  private userInteractionCounts = new Map<string, number>();

  constructor() {
    if (this.isBrowser) {
      this.initializeAnalytics();
    }
  }

  private initializeAnalytics(): void {
    if (!this.isBrowser || !window.gtag) {
      if (this.config.debug) {
        // eslint-disable-next-line no-console
        console.warn('Google Analytics not available');
      }
      return;
    }

    // Enhanced configuration
    window.gtag('config', this.config.trackingId, {
      page_title: 'CodeMoney - Financial Education',
      page_location: window.location.href,
      anonymize_ip: this.config.anonymizeIp,
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      // Enhanced ecommerce for educational tracking
      custom_map: {
        custom_parameter_1: 'course_id',
        custom_parameter_2: 'level_id',
        custom_parameter_3: 'user_progress',
      },
    });

    // Track initial session
    this.trackEvent('session_start', {
      timestamp: new Date().toISOString(),
      platform: this.getUserPlatform(),
    });
  }

  /**
   * Track when user starts a course
   */
  trackCourseStart(courseId: string, courseName: string): void {
    this.trackEvent('course_start', {
      course_id: courseId,
      course_name: courseName,
      timestamp: new Date().toISOString(),
    });

    // Custom event for course selection
    this.trackEvent('select_content', {
      content_type: 'course',
      content_id: courseId,
      content_name: courseName,
    });
  }

  /**
   * Track when user completes a course
   */
  trackCourseComplete(
    courseId: string,
    courseName: string,
    totalStars: number,
    totalTimeSpent: number,
  ): void {
    this.trackEvent('course_complete', {
      course_id: courseId,
      course_name: courseName,
      total_stars: totalStars,
      total_time_spent: totalTimeSpent,
      timestamp: new Date().toISOString(),
    });

    // Achievement unlock
    this.trackEvent('unlock_achievement', {
      achievement_id: `course_${courseId}_complete`,
      achievement_name: `${courseName} Completed`,
    });
  }

  /**
   * Track level start
   */
  trackLevelStart(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
    levelName: string,
  ): void {
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;
    this.levelStartTimes.set(levelKey, Date.now());

    this.trackEvent('level_start', {
      course_id: courseId,
      unit_id: unitId,
      lesson_id: lessonId,
      level_id: levelId,
      level_name: levelName,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track level completion with detailed metrics
   */
  trackLevelComplete(event: LevelProgressEvent): void {
    const levelKey = `${event.courseId}-${event.unitId}-${event.lessonId}-${event.levelId}`;
    const startTime = this.levelStartTimes.get(levelKey);
    const actualTimeSpent = startTime ? Date.now() - startTime : event.timeSpent * 1000;

    this.trackEvent('level_complete', {
      course_id: event.courseId,
      unit_id: event.unitId,
      lesson_id: event.lessonId,
      level_id: event.levelId,
      level_name: event.levelName,
      progress: event.progress,
      time_spent: Math.round(actualTimeSpent / 1000), // Convert to seconds
      hints_used: event.hintsUsed,
      errors: event.errors,
      timestamp: new Date().toISOString(),
    });

    // Track as achievement if completed
    if (event.isCompleted) {
      this.trackEvent('unlock_achievement', {
        achievement_id: `level_${event.levelId}_complete`,
        achievement_name: `${event.levelName} Completed`,
      });
    }

    // Clean up
    this.levelStartTimes.delete(levelKey);
  }

  /**
   * Track level abandonment (user leaves without completing)
   */
  trackLevelAbandonment(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
    progress: number,
  ): void {
    const levelKey = `${courseId}-${unitId}-${lessonId}-${levelId}`;
    const startTime = this.levelStartTimes.get(levelKey);
    const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    this.trackEvent('level_abandon', {
      course_id: courseId,
      unit_id: unitId,
      lesson_id: lessonId,
      level_id: levelId,
      progress: progress,
      time_spent: timeSpent,
      timestamp: new Date().toISOString(),
    });

    this.levelStartTimes.delete(levelKey);
  }

  /**
   * Track user progress milestones
   */
  trackProgressMilestone(
    totalLevelsCompleted: number,
    totalStars: number,
    completionPercentage: number,
  ): void {
    this.trackEvent('progress_milestone', {
      total_levels_completed: totalLevelsCompleted,
      total_stars: totalStars,
      completion_percentage: completionPercentage,
      timestamp: new Date().toISOString(),
    });

    // Track specific milestones
    const milestones = [10, 25, 50, 75, 100];
    milestones.forEach((milestone) => {
      if (completionPercentage >= milestone && completionPercentage < milestone + 5) {
        this.trackEvent('unlock_achievement', {
          achievement_id: `progress_${milestone}_percent`,
          achievement_name: `${milestone}% Progress Achieved`,
        });
      }
    });
  }

  /**
   * Track user engagement patterns
   */
  trackUserEngagement(action: string, category: string, details?: Record<string, unknown>): void {
    const engagementKey = `${category}_${action}`;
    const currentCount = this.userInteractionCounts.get(engagementKey) || 0;
    this.userInteractionCounts.set(engagementKey, currentCount + 1);

    this.trackEvent('user_engagement', {
      action: action,
      category: category,
      interaction_count: currentCount + 1,
      session_duration: Math.round((Date.now() - this.sessionStartTime) / 1000),
      ...details,
    });
  }

  /**
   * Track errors and learning difficulties
   */
  trackLearningDifficulty(
    courseId: string,
    levelId: string,
    difficultyType: string,
    attempts: number,
  ): void {
    this.trackEvent('learning_difficulty', {
      course_id: courseId,
      level_id: levelId,
      difficulty_type: difficultyType,
      attempts: attempts,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track help usage (hints, tutorials, etc.)
   */
  trackHelpUsage(courseId: string, levelId: string, helpType: string, helpId?: string): void {
    this.trackEvent('help_usage', {
      course_id: courseId,
      level_id: levelId,
      help_type: helpType,
      help_id: helpId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track user retention patterns
   */
  trackUserReturn(daysSinceLastVisit: number, totalVisits: number): void {
    this.trackEvent('user_return', {
      days_since_last_visit: daysSinceLastVisit,
      total_visits: totalVisits,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track custom conversion events
   */
  trackConversion(conversionType: string, value?: number, details?: Record<string, unknown>): void {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      value: value,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }

  /**
   * Track page views with enhanced context
   */
  trackPageView(
    pageName: string,
    pageTitle: string,
    courseContext?: Record<string, unknown>,
  ): void {
    this.trackEvent('page_view', {
      page_name: pageName,
      page_title: pageTitle,
      course_context: courseContext,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get session analytics data
   */
  getSessionAnalytics(): Record<string, unknown> {
    return {
      session_duration: Math.round((Date.now() - this.sessionStartTime) / 1000),
      interactions: Object.fromEntries(this.userInteractionCounts),
      active_levels: Array.from(this.levelStartTimes.keys()),
    };
  }

  /**
   * Private helper methods
   */
  private trackEvent(eventName: string, parameters: Record<string, unknown>): void {
    if (!this.isBrowser) return;

    try {
      if (window.gtag) {
        window.gtag('event', eventName, {
          ...parameters,
          send_to: this.config.trackingId,
        });

        if (this.config.debug) {
          // eslint-disable-next-line no-console
          console.log('Analytics Event:', eventName, parameters);
        }
      } else {
        if (this.config.debug) {
          // eslint-disable-next-line no-console
          console.log('Analytics Event (gtag not available):', eventName, parameters);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error tracking event:', error);
    }
  }

  private getUserPlatform(): string {
    if (!this.isBrowser) return 'server';

    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) return 'mobile';
    if (userAgent.includes('tablet')) return 'tablet';
    return 'desktop';
  }

  /**
   * Enable debug mode
   */
  enableDebug(): void {
    this.config.debug = true;
  }

  /**
   * Disable debug mode
   */
  disableDebug(): void {
    this.config.debug = false;
  }
}
