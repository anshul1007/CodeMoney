import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  private readonly progressService = inject(ProgressService);

  startGame() {
    // This will be handled by routing to courses
  }

  resetProgress() {
    // Use progress service to reset all progress
    this.progressService.resetProgress();
    alert('Progress has been reset!');
  }
}
