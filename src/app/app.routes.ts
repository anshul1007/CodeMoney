import { Routes } from '@angular/router';

import {
  WelcomeComponent,
  ThemeShowcaseComponent,
  CoursesDashboardComponent,
  LevelPlayerComponent,
} from './pages';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'courses', component: CoursesDashboardComponent },
  {
    path: 'level/:courseId/:unitId/:lessonId/:levelId',
    component: LevelPlayerComponent,
  },
  { path: 'theme', component: ThemeShowcaseComponent },
  { path: '**', redirectTo: '' },
];
