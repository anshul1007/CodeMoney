import { Injectable, signal, computed } from '@angular/core';

export interface Theme {
  isDark: boolean;
  primaryColor: string;
  accentColor: string;
}

export interface UserPreferences {
  theme: Theme;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  language: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private readonly defaultPreferences: UserPreferences = {
    theme: {
      isDark: false,
      primaryColor: '#0ea5e9',
      accentColor: '#d946ef',
    },
    soundEnabled: true,
    animationsEnabled: true,
    language: 'en',
  };

  // Modern signal-based state management
  private readonly preferencesSignal = signal<UserPreferences>(
    this.loadPreferences(),
  );

  // Public readonly access
  readonly preferences = this.preferencesSignal.asReadonly();

  // Computed signals for specific preferences
  readonly isDarkMode = computed(() => this.preferences().theme.isDark);
  readonly currentLanguage = computed(() => this.preferences().language);
  readonly soundEnabled = computed(() => this.preferences().soundEnabled);
  readonly animationsEnabled = computed(
    () => this.preferences().animationsEnabled,
  );

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('codeMoney_preferences');
      return stored
        ? { ...this.defaultPreferences, ...JSON.parse(stored) }
        : this.defaultPreferences;
    } catch {
      return this.defaultPreferences;
    }
  }

  private savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(
        'codeMoney_preferences',
        JSON.stringify(preferences),
      );
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }

  updateTheme(theme: Partial<Theme>): void {
    const currentPrefs = this.preferencesSignal();
    const updatedPrefs = {
      ...currentPrefs,
      theme: { ...currentPrefs.theme, ...theme },
    };
    this.preferencesSignal.set(updatedPrefs);
    this.savePreferences(updatedPrefs);
  }

  toggleDarkMode(): void {
    this.updateTheme({ isDark: !this.isDarkMode() });
  }

  updateLanguage(language: string): void {
    const updatedPrefs = { ...this.preferencesSignal(), language };
    this.preferencesSignal.set(updatedPrefs);
    this.savePreferences(updatedPrefs);
  }

  toggleSound(): void {
    const updatedPrefs = {
      ...this.preferencesSignal(),
      soundEnabled: !this.soundEnabled(),
    };
    this.preferencesSignal.set(updatedPrefs);
    this.savePreferences(updatedPrefs);
  }

  toggleAnimations(): void {
    const updatedPrefs = {
      ...this.preferencesSignal(),
      animationsEnabled: !this.animationsEnabled(),
    };
    this.preferencesSignal.set(updatedPrefs);
    this.savePreferences(updatedPrefs);
  }

  resetToDefaults(): void {
    this.preferencesSignal.set(this.defaultPreferences);
    this.savePreferences(this.defaultPreferences);
  }
}
