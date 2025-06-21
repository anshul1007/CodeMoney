// Infrastructure components index
export { ErrorBoundaryComponent, GlobalErrorHandler } from './error-boundary.component';
export { PerformanceMonitorComponent } from './performance-monitor.component';
export { AccessibilityPanelComponent } from './accessibility-panel.component';

// Infrastructure services
export {
  PerformanceService,
  type PerformanceMetrics,
  type PerformanceAlert,
} from './performance.service';
export {
  AccessibilityService,
  type AccessibilitySettings,
  type AccessibilityAlert,
} from './accessibility.service';
