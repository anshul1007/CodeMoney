import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AccessibilityService } from './accessibility.service';

@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 left-4 z-50">
      <!-- Accessibility Toggle Button -->
      <button
        (click)="togglePanel()"
        class="p-3 text-white bg-blue-600 rounded-full shadow-lg transition-all duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        [attr.aria-expanded]="isPanelOpen()"
        [attr.aria-label]="isPanelOpen() ? 'Close accessibility panel' : 'Open accessibility panel'"
        title="Accessibility Options"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.846-.615a1 1 0 01.894 1.79l-1.846.615 1.846 3.382a1 1 0 01-1.788.894L13.06 8.688 10 7.323V16a1 1 0 11-2 0V7.323L5.06 8.688l-1.846 2.293a1 1 0 01-1.788-.894L3.272 6.705 1.426 6.09a1 1 0 01.894-1.79l1.846.615L8.12 3.333A1.001 1.001 0 0110 2z"
          />
        </svg>
      </button>

      <!-- Accessibility Panel -->
      @if (isPanelOpen()) {
        <div
          class="p-4 mt-2 w-80 bg-white rounded-lg border shadow-xl border-slate-200 animate-fade-in dark:bg-slate-800 dark:border-slate-700"
          role="dialog"
          aria-label="Accessibility settings"
          [attr.aria-hidden]="!isPanelOpen()"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Accessibility Options
            </h2>
            <button
              (click)="togglePanel()"
              class="p-1 rounded transition-colors text-slate-500 dark:text-slate-400 dark:hover:text-slate-300 hover:text-slate-700"
              aria-label="Close panel"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Accessibility Settings -->
          <div class="space-y-4">
            <!-- High Contrast -->
            <div class="flex justify-between items-center">
              <label
                for="high-contrast"
                class="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                High Contrast
              </label>
              <button
                id="high-contrast"
                (click)="accessibilityService.toggleSetting('highContrast')"
                class="inline-flex relative items-center w-11 h-6 rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                [class.bg-blue-600]="accessibilityService.currentSettings().highContrast"
                [class.bg-slate-300]="!accessibilityService.currentSettings().highContrast"
                role="switch"
                [attr.aria-checked]="accessibilityService.currentSettings().highContrast"
              >
                <span
                  class="inline-block w-4 h-4 bg-white rounded-full transition-transform transform"
                  [class.translate-x-6]="accessibilityService.currentSettings().highContrast"
                  [class.translate-x-1]="!accessibilityService.currentSettings().highContrast"
                ></span>
              </button>
            </div>

            <!-- Large Text -->
            <div class="flex justify-between items-center">
              <label
                for="large-text"
                class="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Large Text
              </label>
              <button
                id="large-text"
                (click)="accessibilityService.toggleSetting('largeText')"
                class="inline-flex relative items-center w-11 h-6 rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                [class.bg-blue-600]="accessibilityService.currentSettings().largeText"
                [class.bg-slate-300]="!accessibilityService.currentSettings().largeText"
                role="switch"
                [attr.aria-checked]="accessibilityService.currentSettings().largeText"
              >
                <span
                  class="inline-block w-4 h-4 bg-white rounded-full transition-transform transform"
                  [class.translate-x-6]="accessibilityService.currentSettings().largeText"
                  [class.translate-x-1]="!accessibilityService.currentSettings().largeText"
                ></span>
              </button>
            </div>

            <!-- Reduced Motion -->
            <div class="flex justify-between items-center">
              <label
                for="reduced-motion"
                class="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Reduced Motion
              </label>
              <button
                id="reduced-motion"
                (click)="accessibilityService.toggleSetting('reducedMotion')"
                class="inline-flex relative items-center w-11 h-6 rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                [class.bg-blue-600]="accessibilityService.currentSettings().reducedMotion"
                [class.bg-slate-300]="!accessibilityService.currentSettings().reducedMotion"
                role="switch"
                [attr.aria-checked]="accessibilityService.currentSettings().reducedMotion"
              >
                <span
                  class="inline-block w-4 h-4 bg-white rounded-full transition-transform transform"
                  [class.translate-x-6]="accessibilityService.currentSettings().reducedMotion"
                  [class.translate-x-1]="!accessibilityService.currentSettings().reducedMotion"
                ></span>
              </button>
            </div>

            <!-- Screen Reader Mode -->
            <div class="flex justify-between items-center">
              <label
                for="screen-reader"
                class="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Screen Reader Mode
              </label>
              <button
                id="screen-reader"
                (click)="accessibilityService.toggleSetting('screenReaderMode')"
                class="inline-flex relative items-center w-11 h-6 rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                [class.bg-blue-600]="accessibilityService.currentSettings().screenReaderMode"
                [class.bg-slate-300]="!accessibilityService.currentSettings().screenReaderMode"
                role="switch"
                [attr.aria-checked]="accessibilityService.currentSettings().screenReaderMode"
              >
                <span
                  class="inline-block w-4 h-4 bg-white rounded-full transition-transform transform"
                  [class.translate-x-6]="accessibilityService.currentSettings().screenReaderMode"
                  [class.translate-x-1]="!accessibilityService.currentSettings().screenReaderMode"
                ></span>
              </button>
            </div>
          </div>
          <!-- Accessibility Alerts -->
          @if (accessibilityService.hasAccessibilityAlerts()) {
            <div class="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Accessibility Issues
              </h3>
              <div class="overflow-y-auto space-y-2 max-h-32">
                @for (alert of accessibilityService.accessibilityAlerts(); track $index) {
                  <div
                    class="p-2 text-xs rounded"
                    [ngClass]="{
                      'bg-blue-50 text-blue-800 border border-blue-200': alert.level === 'info',
                      'bg-yellow-50 text-yellow-800 border border-yellow-200':
                        alert.level === 'warning',
                      'bg-red-50 text-red-800 border border-red-200': alert.level === 'error',
                    }"
                  >
                    <div class="flex items-center space-x-2">
                      <span [innerHTML]="getAlertIcon(alert.level)"></span>
                      <span>{{ alert.message }}</span>
                    </div>
                  </div>
                }
              </div>
              <button
                (click)="accessibilityService.clearAlerts()"
                class="mt-2 text-xs text-slate-500 dark:text-slate-400 dark:hover:text-slate-300 hover:text-slate-700"
              >
                Clear all alerts
              </button>
            </div>
          }

          <!-- Quick Actions -->
          <div class="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Quick Actions
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                (click)="focusMainContent()"
                class="p-2 text-xs rounded transition-colors bg-slate-100 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Focus Main Content
              </button>
              <button
                (click)="announcePageContent()"
                class="p-2 text-xs rounded transition-colors bg-slate-100 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Announce Page
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fade-in 0.2s ease-out;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPanelComponent {
  readonly accessibilityService = inject(AccessibilityService);
  readonly isPanelOpen = signal(false);

  togglePanel(): void {
    this.isPanelOpen.update((open) => !open);

    if (this.isPanelOpen()) {
      this.accessibilityService.announceToScreenReader('Accessibility panel opened');
    } else {
      this.accessibilityService.announceToScreenReader('Accessibility panel closed');
    }
  }

  focusMainContent(): void {
    this.accessibilityService.focusElement('main, [role="main"], #main-content');
    this.togglePanel();
  }

  announcePageContent(): void {
    const title = document.title;
    const mainContent = document.querySelector('main, [role="main"]');
    const contentText = mainContent?.textContent?.slice(0, 100) || 'Main content area';

    this.accessibilityService.announceToScreenReader(
      `Page: ${title}. ${contentText}${contentText.length === 100 ? '...' : ''}`,
    );
  }

  getAlertIcon(level: 'info' | 'warning' | 'error'): string {
    switch (level) {
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '🚨';
      default:
        return 'ℹ️';
    }
  }
}
