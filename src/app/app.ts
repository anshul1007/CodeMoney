import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ErrorBoundaryComponent,
  PerformanceMonitorComponent,
  AccessibilityPanelComponent,
} from './core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ErrorBoundaryComponent,
    // PerformanceMonitorComponent,
    // AccessibilityPanelComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected title = 'CodeMoney';

  // // Only show accessibility panel in development or when explicitly enabled
  // readonly showAccessibilityPanel = signal(
  //   !!(
  //     localStorage.getItem('show-accessibility-panel') === 'true' ||
  //     window.location.hostname === 'localhost' ||
  //     window.location.search.includes('accessibility=true')
  //   ),
  // );

  // // Only show performance monitor in development
  // readonly isProduction = signal(window.location.hostname !== 'localhost');

  // // Keyboard shortcut to toggle accessibility panel (Alt+A)
  // @HostListener('window:keydown', ['$event'])
  // handleKeydown(event: KeyboardEvent): void {
  //   if (event.altKey && event.key === 'a') {
  //     this.toggleAccessibilityPanel();
  //     event.preventDefault();
  //   }
  // }

  // toggleAccessibilityPanel(): void {
  //   const currentValue = this.showAccessibilityPanel();
  //   this.showAccessibilityPanel.set(!currentValue);

  //   // Persist the preference
  //   if (!currentValue) {
  //     localStorage.setItem('show-accessibility-panel', 'true');
  //   } else {
  //     localStorage.removeItem('show-accessibility-panel');
  //   }
  // }
}
