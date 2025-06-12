import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  startGame() {
    // This will be handled by routing to courses
  }

  resetProgress() {
    // Clear any saved progress
    localStorage.removeItem('codeMoney_progress');
    localStorage.removeItem('course_progress');
    alert('Progress has been reset!');
  }
}
