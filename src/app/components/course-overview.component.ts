import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course, Unit, Lesson, Level } from '../models/game.models';

@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-overview.component.html',
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
