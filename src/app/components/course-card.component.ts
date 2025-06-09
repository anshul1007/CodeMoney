import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Course } from '../models/course.models';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-card.component.html',
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Output() levelClick = new EventEmitter<{
    courseId: string;
    unitId: string;
    lessonId: string;
    levelId: string;
  }>();

  onLevelClick(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
  ): void {
    this.levelClick.emit({ courseId, unitId, lessonId, levelId });
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
}
