import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome.component';
import { ThemeShowcaseComponent } from './components/theme-showcase.component';
import { CourseOverviewComponent } from './components/course-overview.component';
import { LevelPlayerComponent } from './components/level-player.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'courses', component: CourseOverviewComponent },
  {
    path: 'level/:courseId/:unitId/:lessonId/:levelId',
    component: LevelPlayerComponent,
  },
  { path: 'theme', component: ThemeShowcaseComponent },
  { path: '**', redirectTo: '' },
];
