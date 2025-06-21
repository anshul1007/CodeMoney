import { isPlatformBrowser } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

export interface AccessibilityAlert {
  message: string;
  level: 'info' | 'warning' | 'error';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly settings = signal<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true,
  });

  private readonly alerts = signal<AccessibilityAlert[]>([]);

  // Store references for comprehensive memory leak prevention
  private eventListeners: {
    element: Element | Document | MediaQueryList;
    event: string;
    handler: EventListener;
  }[] = [];
  private auditTimeouts: ReturnType<typeof setTimeout>[] = [];
  private mutationObserver?: MutationObserver;

  readonly currentSettings = this.settings.asReadonly();
  readonly accessibilityAlerts = this.alerts.asReadonly();
  readonly hasAccessibilityAlerts = computed(() => this.alerts().length > 0);
  readonly isAccessibilityOptimized = computed(() => {
    const settings = this.settings();
    return settings.highContrast || settings.largeText || settings.screenReaderMode;
  });

  constructor() {
    if (this.isBrowser) {
      this.initializeAccessibility();
      this.detectUserPreferences();

      // Setup comprehensive cleanup on destroy
      this.destroyRef.onDestroy(() => {
        this.cleanup();
      });
    }
  }

  private cleanup(): void {
    // Remove all event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      if ('removeEventListener' in element) {
        element.removeEventListener(event, handler);
      }
    });
    this.eventListeners = [];

    // Clear all timeouts
    this.auditTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.auditTimeouts = [];

    // Disconnect mutation observer
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  private addEventListener(
    element: Element | Document | MediaQueryList,
    event: string,
    handler: EventListener,
  ): void {
    if ('addEventListener' in element) {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    }
  }

  private initializeAccessibility(): void {
    // Load saved preferences
    this.loadAccessibilitySettings();

    // Apply current settings
    this.applyAccessibilitySettings();

    // Set up keyboard navigation
    this.setupKeyboardNavigation();

    // Monitor for accessibility violations
    this.monitorAccessibility();
  }

  private detectUserPreferences(): void {
    if (!window.matchMedia) return;

    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.updateSettingInternal('reducedMotion', motionQuery.matches);
    const motionHandler = (e: Event) => {
      const event = e as MediaQueryListEvent;
      this.updateSettingInternal('reducedMotion', event.matches);
    };
    this.addEventListener(motionQuery, 'change', motionHandler);

    // Detect prefers-contrast
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    this.updateSettingInternal('highContrast', contrastQuery.matches);
    const contrastHandler = (e: Event) => {
      const event = e as MediaQueryListEvent;
      this.updateSettingInternal('highContrast', event.matches);
    };
    this.addEventListener(contrastQuery, 'change', contrastHandler);

    // Detect screen reader usage
    const screenReaderQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce) and (prefers-color-scheme: no-preference)',
    );
    this.updateSettingInternal('screenReaderMode', screenReaderQuery.matches);
  }

  private loadAccessibilitySettings(): void {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.settings.set({ ...this.settings(), ...settings });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load accessibility settings:', error);
      }
    }
  }

  private saveAccessibilitySettings(): void {
    localStorage.setItem('accessibility-settings', JSON.stringify(this.settings()));
  }

  private applyAccessibilitySettings(): void {
    const settings = this.settings();
    const root = document.documentElement;

    // High contrast mode
    root.classList.toggle('high-contrast', settings.highContrast);

    // Large text mode
    root.classList.toggle('large-text', settings.largeText);

    // Reduced motion
    root.classList.toggle('reduced-motion', settings.reducedMotion);

    // Screen reader mode
    root.classList.toggle('screen-reader', settings.screenReaderMode);

    // Update meta tags for better accessibility
    this.updateMetaTags();
  }

  private updateMetaTags(): void {
    const settings = this.settings();

    // Add viewport meta for better mobile accessibility
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }

    const viewportContent = settings.largeText
      ? 'width=device-width, initial-scale=1.2, maximum-scale=3.0, user-scalable=yes'
      : 'width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes';

    viewport.content = viewportContent;
  }

  private setupKeyboardNavigation(): void {
    if (!this.isBrowser) return;

    let isKeyboardNavigation = false;

    // Track keyboard usage
    const keydownHandler = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === 'Tab') {
        isKeyboardNavigation = true;
        document.body.classList.add('keyboard-navigation');
        this.updateSettingInternal('keyboardNavigation', true);
      }
    };
    this.addEventListener(document, 'keydown', keydownHandler);

    // Track mouse usage
    const mousedownHandler = () => {
      if (isKeyboardNavigation) {
        isKeyboardNavigation = false;
        document.body.classList.remove('keyboard-navigation');
      }
    };
    this.addEventListener(document, 'mousedown', mousedownHandler);

    // Add skip links for better navigation
    this.addSkipLinks();
  }

  private addSkipLinks(): void {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 4px;
      transition: top 0.3s;
    `;

    const focusHandler = () => {
      skipLink.style.top = '6px';
    };
    this.addEventListener(skipLink, 'focus', focusHandler);

    const blurHandler = () => {
      skipLink.style.top = '-40px';
    };
    this.addEventListener(skipLink, 'blur', blurHandler);

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  private monitorAccessibility(): void {
    // Initial accessibility check
    const auditTimeout1 = setTimeout(() => this.performAccessibilityAudit(), 2000);
    this.auditTimeouts.push(auditTimeout1);

    // Re-audit on route changes with MutationObserver
    this.mutationObserver = new MutationObserver(() => {
      const auditTimeout2 = setTimeout(() => this.performAccessibilityAudit(), 500);
      this.auditTimeouts.push(auditTimeout2);
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private performAccessibilityAudit(): void {
    const issues: AccessibilityAlert[] = []; // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push({
        message: `${images.length} images missing alt text`,
        level: 'warning',
        timestamp: new Date(),
      });
    }

    // Check for missing form labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const unlabeledInputs = Array.from(inputs).filter((input) => {
      const labels = document.querySelectorAll(`label[for="${input.id}"]`);
      return labels.length === 0;
    });

    if (unlabeledInputs.length > 0) {
      issues.push({
        message: `${unlabeledInputs.length} form inputs missing labels`,
        level: 'error',
        timestamp: new Date(),
      });
    }

    // Check for color contrast issues
    this.checkColorContrast(issues);

    // Update alerts
    this.alerts.set(issues);
  }

  private checkColorContrast(issues: AccessibilityAlert[]): void {
    // Simplified contrast check - in production, use a proper contrast ratio library
    const textElements = document.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, span, div, button, a',
    );

    let lowContrastCount = 0;
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;

      if (this.isLowContrast(backgroundColor, color)) {
        lowContrastCount++;
      }
    });
    if (lowContrastCount > 0) {
      issues.push({
        message: `${lowContrastCount} elements may have low color contrast`,
        level: 'warning',
        timestamp: new Date(),
      });
    }
  }

  private isLowContrast(bg: string, fg: string): boolean {
    // Simple contrast check - in production, use proper contrast ratio calculation
    return bg === fg || (bg.includes('rgb(255') && fg.includes('rgb(255'));
  }

  private updateSettingInternal<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ): void {
    this.settings.update((current) => ({
      ...current,
      [key]: value,
    }));

    this.saveAccessibilitySettings();
    this.applyAccessibilitySettings();
    this.addAlert({
      message: `${key} ${value ? 'enabled' : 'disabled'}`,
      level: 'info',
      timestamp: new Date(),
    });
  }

  // Public API methods
  updateSetting<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ): void {
    this.updateSettingInternal(key, value);
  }

  toggleSetting(key: keyof AccessibilitySettings): void {
    const current = this.settings()[key] as boolean;
    this.updateSettingInternal(key, !current);
  }

  private addAlert(alert: AccessibilityAlert): void {
    this.alerts.update((alerts) => [...alerts.slice(-4), alert]);
  }

  clearAlerts(): void {
    this.alerts.set([]);
  }

  announceToScreenReader(message: string): void {
    if (!this.isBrowser) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;

    document.body.appendChild(announcement);
    announcement.textContent = message;

    // Clean up announcement after screen reader processes it
    const cleanupTimeout = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
    this.auditTimeouts.push(cleanupTimeout);
  }

  focusElement(selector: string): void {
    if (!this.isBrowser) return;

    const element = document.querySelector(selector) as HTMLElement;
    if (element && typeof element.focus === 'function') {
      element.focus();

      // Announce focus change to screen readers
      if (element.getAttribute('aria-label') || element.textContent) {
        const label = element.getAttribute('aria-label') || element.textContent?.trim();
        this.announceToScreenReader(`Focused on ${label}`);
      }
    }
  }
}
