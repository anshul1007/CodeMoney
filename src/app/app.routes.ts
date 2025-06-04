import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome.component';
import { GameBoardComponent } from './components/game-board.component';
import { ThemeShowcaseComponent } from './components/theme-showcase.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'game', component: GameBoardComponent },
  { path: 'theme', component: ThemeShowcaseComponent },
  { path: '**', redirectTo: '' }
];
