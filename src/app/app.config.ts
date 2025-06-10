import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  ErrorHandler,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { CourseService } from './services/course.service';
import {
  PerformanceService,
  AccessibilityService,
  GlobalErrorHandler,
} from './core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    CourseService,
    PerformanceService,
    AccessibilityService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
