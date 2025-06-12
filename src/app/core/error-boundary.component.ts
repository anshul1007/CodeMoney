import {
  Component,
  ErrorHandler,
  Injectable,
  signal,
  computed,
  inject,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface AppError {
  message: string;
  stack?: string;
  timestamp: Date;
  url?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler, OnDestroy {
  private readonly router = inject(Router);
  private readonly errors = signal<AppError[]>([]);

  readonly hasErrors = computed(() => this.errors().length > 0);
  readonly latestError = computed(() => {
    const errorList = this.errors();
    return errorList.length > 0 ? errorList[errorList.length - 1] : null;
  });

  handleError(error: any): void {
    console.error('Global error caught:', error);

    const appError: AppError = {
      message: error?.message || 'An unexpected error occurred',
      stack: error?.stack,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Add to error list (keep only last 10 errors)
    this.errors.update((errors) => [...errors.slice(-9), appError]);

    // Log to external service in production
    this.logErrorToService(appError);
  }

  private logErrorToService(error: AppError): void {
    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (typeof window !== 'undefined' && window.console) {
      console.group('🚨 Error Report');
      console.error('Message:', error.message);
      console.error('Timestamp:', error.timestamp);
      console.error('URL:', error.url);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  }

  clearErrors(): void {
    this.errors.set([]);
  }

  ngOnDestroy(): void {
    this.clearErrors();
  }
}

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (errorHandler.hasErrors()) {
      <div
        class="fixed top-4 right-4 z-50 max-w-sm bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 animate-slide-in"
        role="alert"
        aria-live="assertive"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <span class="text-red-500 text-xl">⚠️</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-red-800">
              Something went wrong
            </h3>
            <p class="text-xs text-red-700 mt-1 line-clamp-2">
              {{ errorHandler.latestError()?.message }}
            </p>
            <div class="mt-3 flex space-x-2">
              <button
                (click)="reloadPage()"
                class="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded transition-colors"
              >
                Reload
              </button>
              <button
                (click)="dismissError()"
                class="text-xs text-red-600 hover:text-red-800 px-2 py-1 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorBoundaryComponent {
  readonly errorHandler = inject(GlobalErrorHandler);

  reloadPage(): void {
    window.location.reload();
  }

  dismissError(): void {
    this.errorHandler.clearErrors();
  }
}
