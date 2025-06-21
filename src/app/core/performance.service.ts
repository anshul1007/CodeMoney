// import { Injectable, signal, computed, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// export interface PerformanceMetrics {
//   // Core Web Vitals
//   lcp?: number; // Largest Contentful Paint
//   fid?: number; // First Input Delay
//   cls?: number; // Cumulative Layout Shift

//   // Additional metrics
//   fcp?: number; // First Contentful Paint
//   ttfb?: number; // Time to First Byte

//   // Custom metrics
//   routeChangeTime?: number;
//   componentLoadTime?: number;

//   // Memory usage
//   usedJSHeapSize?: number;
//   totalJSHeapSize?: number;
//   jsHeapSizeLimit?: number;
// }

// export interface PerformanceAlert {
//   metric: string;
//   value: number;
//   threshold: number;
//   severity: 'warning' | 'critical';
//   timestamp: Date;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class PerformanceService {
//   private readonly platformId = inject(PLATFORM_ID);
//   private readonly destroyRef = inject(DestroyRef);
//   private readonly isBrowser = isPlatformBrowser(this.platformId);

//   private readonly metrics = signal<PerformanceMetrics>({});
//   private readonly alerts = signal<PerformanceAlert[]>([]);

//   // Store references for cleanup
//   private performanceInterval?: number;
//   private performanceObservers: PerformanceObserver[] = [];

//   // Performance thresholds (in milliseconds)
//   private readonly thresholds = {
//     lcp: { warning: 2500, critical: 4000 },
//     fid: { warning: 100, critical: 300 },
//     cls: { warning: 0.1, critical: 0.25 },
//     fcp: { warning: 1800, critical: 3000 },
//     ttfb: { warning: 800, critical: 1800 },
//     routeChangeTime: { warning: 500, critical: 1000 },
//     componentLoadTime: { warning: 200, critical: 500 },
//   };

//   readonly currentMetrics = this.metrics.asReadonly();
//   readonly performanceAlerts = this.alerts.asReadonly();

//   readonly hasPerformanceIssues = computed(() => this.alerts().length > 0);
//   readonly criticalIssues = computed(() =>
//     this.alerts().filter((alert) => alert.severity === 'critical'),
//   );
//   constructor() {
//     if (this.isBrowser) {
//       this.initializePerformanceMonitoring();

//       // Setup cleanup on destroy
//       this.destroyRef.onDestroy(() => {
//         this.cleanup();
//       });
//     }
//   }

//   private cleanup(): void {
//     // Clear interval
//     if (this.performanceInterval) {
//       clearInterval(this.performanceInterval);
//       this.performanceInterval = undefined;
//     }

//     // Disconnect all performance observers
//     this.performanceObservers.forEach((observer) => {
//       observer.disconnect();
//     });
//     this.performanceObservers = [];
//   }

//   private initializePerformanceMonitoring(): void {
//     // Monitor Core Web Vitals
//     this.observeWebVitals();

//     // Monitor navigation timing
//     this.measureNavigationTiming();

//     // Monitor memory usage
//     this.monitorMemoryUsage(); // Set up periodic checks
//     this.performanceInterval = setInterval(() => this.checkPerformanceThresholds(), 5000) as any;
//   }
//   private observeWebVitals(): void {
//     if (!this.isBrowser || !('PerformanceObserver' in window)) return;

//     // Largest Contentful Paint
//     const lcpObserver = new PerformanceObserver((entryList) => {
//       const entries = entryList.getEntries();
//       const lastEntry = entries[entries.length - 1] as any;
//       this.updateMetric('lcp', lastEntry.startTime);
//     });
//     lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
//     this.performanceObservers.push(lcpObserver);

//     // First Input Delay
//     const fidObserver = new PerformanceObserver((entryList) => {
//       const entries = entryList.getEntries();
//       entries.forEach((entry: any) => {
//         this.updateMetric('fid', entry.processingStart - entry.startTime);
//       });
//     });
//     fidObserver.observe({ entryTypes: ['first-input'] });
//     this.performanceObservers.push(fidObserver);

//     // Cumulative Layout Shift
//     const clsObserver = new PerformanceObserver((entryList) => {
//       let clsValue = 0;
//       const entries = entryList.getEntries();
//       entries.forEach((entry: any) => {
//         if (!entry.hadRecentInput) {
//           clsValue += entry.value;
//         }
//       });
//       this.updateMetric('cls', clsValue);
//     });
//     clsObserver.observe({ entryTypes: ['layout-shift'] });
//     this.performanceObservers.push(clsObserver);

//     // First Contentful Paint
//     const fcpObserver = new PerformanceObserver((entryList) => {
//       const entries = entryList.getEntries();
//       entries.forEach((entry: any) => {
//         if (entry.name === 'first-contentful-paint') {
//           this.updateMetric('fcp', entry.startTime);
//         }
//       });
//     });
//     fcpObserver.observe({ entryTypes: ['paint'] });
//     this.performanceObservers.push(fcpObserver);
//   }

//   private measureNavigationTiming(): void {
//     if (!this.isBrowser || !performance.timing) return;

//     const timing = performance.timing;
//     const navigationStart = timing.navigationStart;

//     // Time to First Byte
//     const ttfb = timing.responseStart - navigationStart;
//     this.updateMetric('ttfb', ttfb);
//   }

//   private monitorMemoryUsage(): void {
//     if (!this.isBrowser || !(performance as any).memory) return;

//     const memory = (performance as any).memory;
//     this.updateMetric('usedJSHeapSize', memory.usedJSHeapSize);
//     this.updateMetric('totalJSHeapSize', memory.totalJSHeapSize);
//     this.updateMetric('jsHeapSizeLimit', memory.jsHeapSizeLimit);
//   }

//   private updateMetric(key: keyof PerformanceMetrics, value: number): void {
//     this.metrics.update((current) => ({
//       ...current,
//       [key]: value,
//     }));

//     this.checkThreshold(key, value);
//   }

//   private checkThreshold(metric: string, value: number): void {
//     const threshold = this.thresholds[metric as keyof typeof this.thresholds];
//     if (!threshold) return;

//     if (value > threshold.critical) {
//       this.addAlert(metric, value, threshold.critical, 'critical');
//     } else if (value > threshold.warning) {
//       this.addAlert(metric, value, threshold.warning, 'warning');
//     }
//   }

//   private addAlert(
//     metric: string,
//     value: number,
//     threshold: number,
//     severity: 'warning' | 'critical',
//   ): void {
//     const alert: PerformanceAlert = {
//       metric,
//       value,
//       threshold,
//       severity,
//       timestamp: new Date(),
//     };

//     this.alerts.update((alerts) => [...alerts.slice(-9), alert]);
//   }

//   private checkPerformanceThresholds(): void {
//     if (!this.isBrowser) return;

//     // Check memory usage
//     if ((performance as any).memory) {
//       const memory = (performance as any).memory;
//       const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

//       if (memoryUsagePercent > 90) {
//         this.addAlert('memory', memoryUsagePercent, 90, 'critical');
//       } else if (memoryUsagePercent > 70) {
//         this.addAlert('memory', memoryUsagePercent, 70, 'warning');
//       }
//     }
//   }

//   // Public API methods
//   measureRouteChange(startTime: number): void {
//     const duration = performance.now() - startTime;
//     this.updateMetric('routeChangeTime', duration);
//   }

//   measureComponentLoad(componentName: string, startTime: number): void {
//     const duration = performance.now() - startTime;
//     this.updateMetric('componentLoadTime', duration);

//     console.log(`📊 Component ${componentName} loaded in ${duration.toFixed(2)}ms`);
//   }

//   clearAlerts(): void {
//     this.alerts.set([]);
//   }
//   getPerformanceReport(): string {
//     const metrics = this.metrics();
//     const alerts = this.alerts();

//     const report = [
//       '🚀 Performance Report',
//       '━━━━━━━━━━━━━━━━━━━',
//       `Generated at: ${new Date().toISOString()}`,
//       '',
//       'Core Web Vitals:',
//       `  LCP: ${metrics.lcp?.toFixed(2) || 'N/A'}ms`,
//       `  FID: ${metrics.fid?.toFixed(2) || 'N/A'}ms`,
//       `  CLS: ${metrics.cls?.toFixed(3) || 'N/A'}`,
//       '',
//       'Other Metrics:',
//       `  FCP: ${metrics.fcp?.toFixed(2) || 'N/A'}ms`,
//       `  TTFB: ${metrics.ttfb?.toFixed(2) || 'N/A'}ms`,
//       '',
//       'Memory Usage:',
//       `  Used: ${metrics.usedJSHeapSize ? (metrics.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}`,
//       `  Total: ${metrics.totalJSHeapSize ? (metrics.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}`,
//       `  Limit: ${metrics.jsHeapSizeLimit ? (metrics.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}`,
//       '',
//       `Active Alerts: ${alerts.length}`,
//       ...alerts.map(
//         (alert) => `  • ${alert.metric}: ${alert.value.toFixed(2)} (${alert.severity})`,
//       ),
//     ].join('\n');

//     return report;
//   }

//   // Method to get structured data for external services
//   getStructuredMetrics(): {
//     metrics: PerformanceMetrics;
//     alerts: PerformanceAlert[];
//     timestamp: string;
//     url?: string;
//     userAgent?: string;
//   } {
//     return {
//       metrics: this.metrics(),
//       alerts: this.alerts(),
//       timestamp: new Date().toISOString(),
//       url: this.isBrowser ? window.location.href : undefined,
//       userAgent: this.isBrowser ? navigator.userAgent : undefined,
//     };
//   }

//   // Method to send metrics to external monitoring services
//   async sendToExternalService(endpoint: string, apiKey?: string): Promise<boolean> {
//     if (!this.isBrowser) return false;

//     try {
//       const data = this.getStructuredMetrics();
//       const headers: Record<string, string> = {
//         'Content-Type': 'application/json',
//       };

//       if (apiKey) {
//         headers['Authorization'] = `Bearer ${apiKey}`;
//       }

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(data),
//       });

//       return response.ok;
//     } catch (error) {
//       console.error('Failed to send metrics to external service:', error);
//       return false;
//     }
//   }
// }
