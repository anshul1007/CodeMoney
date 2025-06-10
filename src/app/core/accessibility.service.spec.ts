import { TestBed } from '@angular/core/testing';
import { AccessibilityService } from './accessibility.service';

describe('AccessibilityService', () => {
  let service: AccessibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessibilityService],
    });
    service = TestBed.inject(AccessibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default settings', () => {
    const settings = service.currentSettings();
    expect(settings.highContrast).toBeFalsy();
    expect(settings.largeText).toBeFalsy();
    expect(settings.reducedMotion).toBeFalsy();
    expect(settings.screenReaderMode).toBeFalsy();
    expect(settings.keyboardNavigation).toBeTruthy();
  });

  it('should toggle settings', () => {
    const initialHighContrast = service.currentSettings().highContrast;
    service.toggleSetting('highContrast');
    expect(service.currentSettings().highContrast).toBe(!initialHighContrast);
  });

  it('should update individual settings', () => {
    service.updateSetting('largeText', true);
    expect(service.currentSettings().largeText).toBeTruthy();
  });

  it('should clear alerts', () => {
    service.clearAlerts();
    expect(service.accessibilityAlerts().length).toBe(0);
  });

  it('should announce to screen reader', () => {
    // This is a visual test - we can't actually test screen reader announcements
    // but we can ensure the method doesn't throw errors
    expect(() => service.announceToScreenReader('Test message')).not.toThrow();
  });

  it('should focus element', () => {
    // Create a test element
    const testElement = document.createElement('button');
    testElement.id = 'test-button';
    document.body.appendChild(testElement);

    service.focusElement('#test-button');
    expect(document.activeElement).toBe(testElement);

    // Cleanup
    document.body.removeChild(testElement);
  });
});
