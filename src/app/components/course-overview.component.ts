import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course, Unit, Lesson, Level } from '../models/game.models';

@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4"
    >
      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-8">
        <!-- Navigation Bar -->
        <div class="flex items-center justify-between mb-6">
          <button
            routerLink="/"
            class="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg shadow-md transition-colors duration-200"
          >
            <span class="text-xl">🏠</span>
            <span class="font-medium text-gray-700">Back to Home</span>
          </button>
          <!-- Logo in top right -->
          <div class="hidden md:block">
            <img
              src="/assets/logo-code-money.svg"
              alt="CodeMoney Monkey Mascot"
              class="h-10 w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">
            💰 Money Mission Academy
          </h1>
          <p class="text-lg text-gray-600">
            Learn about money, business, and finance through fun games!
          </p>
        </div>

        <!-- Progress Overview -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="text-3xl">🌟</div>
              <div>
                <h3 class="font-bold text-gray-800">Your Progress</h3>
                <p class="text-gray-600">
                  {{ progress.totalStars }} stars earned
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600">
                {{ progress.completedLevels.length }}
              </div>
              <div class="text-sm text-gray-500">Levels Completed</div>
            </div>
          </div>
        </div>

        <!-- Courses -->
        <div class="space-y-8">
          <div
            *ngFor="let course of courses"
            class="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <!-- Course Header -->
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6"
            >
              <div class="flex items-center space-x-4">
                <span class="text-4xl">{{ course.icon }}</span>
                <div>
                  <h2 class="text-2xl font-bold">{{ course.title }}</h2>
                  <p class="text-blue-100">{{ course.description }}</p>
                </div>
              </div>
            </div>

            <!-- Units -->
            <div class="p-6 space-y-6">
              <div
                *ngFor="let unit of course.units"
                class="border border-gray-200 rounded-xl overflow-hidden"
              >
                <!-- Unit Header -->
                <div class="bg-gray-50 p-4 border-b border-gray-200">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">{{ unit.icon }}</span>
                    <div>
                      <h3 class="text-lg font-bold text-gray-800">
                        {{ unit.title }}
                      </h3>
                      <p class="text-sm text-gray-600">
                        {{ unit.description }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Lessons -->
                <div class="p-4 space-y-4">
                  <div
                    *ngFor="let lesson of unit.lessons"
                    class="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <!-- Lesson Header -->
                    <div class="bg-gray-25 p-3 border-b border-gray-100">
                      <div class="flex items-center space-x-2">
                        <span class="text-xl">{{ lesson.icon }}</span>
                        <div>
                          <h4 class="font-semibold text-gray-800">
                            {{ lesson.title }}
                          </h4>
                          <p class="text-xs text-gray-500">
                            {{ lesson.description }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Levels -->
                    <div class="p-3">
                      <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                      >
                        <div
                          *ngFor="let level of lesson.levels"
                          class="level-card cursor-pointer transition-all duration-200 hover:shadow-md"
                          [class.completed]="level.isCompleted"
                          [class.unlocked]="level.isUnlocked"
                          [class.locked]="!level.isUnlocked"
                          (click)="
                            playLevel(course.id, unit.id, lesson.id, level.id)
                          "
                          [routerLink]="
                            level.isUnlocked
                              ? [
                                  '/level',
                                  course.id,
                                  unit.id,
                                  lesson.id,
                                  level.id,
                                ]
                              : null
                          "
                        >
                          <div
                            class="border rounded-lg p-4 relative"
                            [ngClass]="{
                              'border-green-300 bg-green-50': level.isCompleted,
                              'border-blue-300 bg-blue-50':
                                level.isUnlocked && !level.isCompleted,
                              'border-gray-200 bg-gray-50 opacity-50':
                                !level.isUnlocked,
                            }"
                          >
                            <!-- Level Icon/Status -->
                            <div class="text-center mb-2">
                              <div
                                *ngIf="level.isCompleted"
                                class="text-2xl text-green-600"
                              >
                                ✅
                              </div>
                              <div
                                *ngIf="!level.isCompleted && level.isUnlocked"
                                class="text-2xl text-blue-600"
                              >
                                🎯
                              </div>
                              <div
                                *ngIf="!level.isUnlocked"
                                class="text-2xl text-gray-400"
                              >
                                🔒
                              </div>
                            </div>

                            <!-- Level Info -->
                            <h5
                              class="font-medium text-sm text-center mb-1"
                              [ngClass]="{
                                'text-green-800': level.isCompleted,
                                'text-blue-800':
                                  level.isUnlocked && !level.isCompleted,
                                'text-gray-500': !level.isUnlocked,
                              }"
                            >
                              {{ level.title }}
                            </h5>

                            <p class="text-xs text-center text-gray-500 mb-2">
                              {{ level.description }}
                            </p>

                            <!-- Stars -->
                            <div
                              *ngIf="level.isCompleted"
                              class="flex justify-center space-x-1"
                            >
                              <span
                                *ngFor="let star of getStarsArray(level.stars)"
                                class="text-yellow-400"
                                >⭐</span
                              >
                            </div>

                            <!-- Play Button -->
                            <div
                              *ngIf="level.isUnlocked && !level.isCompleted"
                              class="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            >
                              ▶
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .level-card.unlocked:hover {
        transform: translateY(-2px);
      }

      .level-card.locked {
        cursor: not-allowed;
      }

      .bg-gray-25 {
        background-color: #fafafa;
      }
    `,
  ],
})
export class CourseOverviewComponent implements OnInit {
  courses: Course[] = [];
  progress: any = {
    totalStars: 0,
    completedLevels: [],
  };

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courses = this.courseService.getCourses();
    this.courseService.getProgress().subscribe((progress) => {
      this.progress = progress;
    });
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  playLevel(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
  ): void {
    const level = this.courseService.getLevel(
      courseId,
      unitId,
      lessonId,
      levelId,
    );
    if (level?.isUnlocked) {
      // Navigation will be handled by routerLink
      console.log(`Playing level: ${levelId}`);
    }
  }
}
