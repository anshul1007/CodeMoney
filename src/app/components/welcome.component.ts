import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  constructor(private gameService: GameService) {}

  startGame() {
    // This will be handled by routing
  }

  resetProgress() {
    this.gameService.resetProgress();
  }
}
