// import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { PerformanceService, PerformanceAlert } from './performance.service';
// import { isPlatformBrowser } from '@angular/common';
// import { PLATFORM_ID } from '@angular/core';

// @Component({
//   selector: 'app-performance-monitor',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     @if (showMonitor() && (performanceService.hasPerformanceIssues() || isDevelopment)) {
//       <div class="fixed bottom-4 right-4 z-50 max-w-sm">
//         <!-- Performance Alerts -->
//         @for (alert of performanceService.performanceAlerts(); track trackByAlert($index, alert)) {
//           <div
//             class="mb-2 p-3 rounded-lg shadow-lg border transition-all duration-300"
//             [ngClass]="{
//               'bg-yellow-50 border-yellow-200 text-yellow-800': alert.severity === 'warning',
//               'bg-red-50 border-red-200 text-red-800': alert.severity === 'critical',
//             }"
//             role="alert"
//             [attr.aria-live]="alert.severity === 'critical' ? 'assertive' : 'polite'"
//           >
//             <div class="flex items-start justify-between">
//               <div class="flex-1">
//                 <div class="flex items-center space-x-2">
//                   <span [innerHTML]="getAlertIcon(alert.severity)"></span>
//                   <span class="text-sm font-medium">
//                     Performance
//                     {{ alert.severity === 'critical' ? 'Issue' : 'Warning' }}
//                   </span>
//                 </div>
//                 <p class="text-xs mt-1">
//                   {{ formatMetricName(alert.metric) }}:
//                   {{ formatMetricValue(alert.metric, alert.value) }}
//                   <span class="opacity-75">
//                     (threshold:
//                     {{ formatMetricValue(alert.metric, alert.threshold) }})
//                   </span>
//                 </p>
//               </div>
//               <button
//                 (click)="dismissAlert(alert)"
//                 class="text-xs opacity-50 hover:opacity-100 transition-opacity ml-2"
//                 aria-label="Dismiss alert"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//         }

//         <!-- Performance Dashboard Toggle -->
//         <div
//           class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3"
//         >
//           <div class="flex items-center justify-between mb-2">
//             <h3 class="text-sm font-medium text-slate-800 dark:text-slate-200">Performance</h3>
//             <button
//               (click)="toggleExpanded()"
//               class="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
//               [attr.aria-expanded]="isExpanded()"
//               aria-label="Toggle performance details"
//             >
//               {{ isExpanded() ? '▼' : '▶' }}
//             </button>
//           </div>

//           <!-- Quick Status -->
//           <div class="flex items-center space-x-2 text-xs">
//             <div
//               class="w-2 h-2 rounded-full"
//               [ngClass]="{
//                 'bg-green-400': performanceScore() >= 80,
//                 'bg-yellow-400': performanceScore() >= 60 && performanceScore() < 80,
//                 'bg-red-400': performanceScore() < 60,
//               }"
//             ></div>
//             <span class="text-slate-600 dark:text-slate-400">
//               Score: {{ performanceScore() }}/100
//             </span>
//           </div>

//           <!-- Expanded Details -->
//           @if (isExpanded()) {
//             <div class="mt-3 space-y-2 text-xs">
//               <div class="grid grid-cols-2 gap-2">
//                 <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded">
//                   <div class="text-slate-500 dark:text-slate-400">LCP</div>
//                   <div class="font-mono text-slate-800 dark:text-slate-200">
//                     {{ formatTime(performanceService.currentMetrics().lcp) }}
//                   </div>
//                 </div>
//                 <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded">
//                   <div class="text-slate-500 dark:text-slate-400">FID</div>
//                   <div class="font-mono text-slate-800 dark:text-slate-200">
//                     {{ formatTime(performanceService.currentMetrics().fid) }}
//                   </div>
//                 </div>
//                 <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded">
//                   <div class="text-slate-500 dark:text-slate-400">CLS</div>
//                   <div class="font-mono text-slate-800 dark:text-slate-200">
//                     {{ formatCLS(performanceService.currentMetrics().cls) }}
//                   </div>
//                 </div>
//                 <div class="bg-slate-50 dark:bg-slate-700 p-2 rounded">
//                   <div class="text-slate-500 dark:text-slate-400">Memory</div>
//                   <div class="font-mono text-slate-800 dark:text-slate-200">
//                     {{ formatMemory(performanceService.currentMetrics().usedJSHeapSize) }}
//                   </div>
//                 </div>
//               </div>

//               <div class="flex space-x-2 mt-3">
//                 <button
//                   (click)="showReport()"
//                   class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors"
//                 >
//                   Report
//                 </button>
//                 <button
//                   (click)="clearAlerts()"
//                   class="flex-1 bg-slate-500 hover:bg-slate-600 text-white text-xs py-1 px-2 rounded transition-colors"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           }
//         </div>
//       </div>
//     }
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class PerformanceMonitorComponent {
//   readonly performanceService = inject(PerformanceService);
//   private readonly platformId = inject(PLATFORM_ID);

//   readonly isExpanded = signal(false);
//   readonly showMonitor = signal(false);

//   readonly isDevelopment =
//     this.isClientSide() &&
//     ((typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
//       window.location.hostname === '127.0.0.1' ||
//       window.location.hostname.startsWith('192.168.') ||
//       window.location.search.includes('dev=true'));

//   readonly performanceScore = computed(() => {
//     const metrics = this.performanceService.currentMetrics();
//     let score = 100;

//     // Deduct points based on Core Web Vitals
//     if (metrics.lcp && metrics.lcp > 2500) score -= 20;
//     if (metrics.fid && metrics.fid > 100) score -= 20;
//     if (metrics.cls && metrics.cls > 0.1) score -= 20;
//     if (metrics.fcp && metrics.fcp > 1800) score -= 20;
//     if (metrics.ttfb && metrics.ttfb > 800) score -= 20;

//     return Math.max(0, score);
//   });
//   constructor() {
//     // Show monitor in development or when there are performance issues
//     this.showMonitor.set(this.isDevelopment || this.performanceService.hasPerformanceIssues());

//     // Auto-expand if there are critical issues
//     if (this.performanceService.criticalIssues().length > 0) {
//       this.isExpanded.set(true);
//     }
//   }

//   private isClientSide(): boolean {
//     return isPlatformBrowser(this.platformId);
//   }

//   toggleExpanded(): void {
//     this.isExpanded.update((expanded) => !expanded);
//   }

//   dismissAlert(alert: PerformanceAlert): void {
//     // In a real implementation, you might want to dismiss individual alerts
//     // For now, we'll clear all alerts
//     this.performanceService.clearAlerts();
//   }

//   clearAlerts(): void {
//     this.performanceService.clearAlerts();
//   }
//   showReport(): void {
//     const report = this.performanceService.getPerformanceReport();
//     console.log('📊 Performance Report Generated:', report);

//     // Create detailed report with recommendations
//     const detailedReport = this.generateDetailedReport();

//     // Show in modal if available, otherwise copy to clipboard
//     if (this.isClientSide()) {
//       if (navigator.clipboard) {
//         navigator.clipboard
//           .writeText(detailedReport)
//           .then(() => {
//             console.log('📋 Detailed performance report copied to clipboard');
//             this.showNotification('Performance report copied to clipboard!', 'success');
//           })
//           .catch(() => {
//             console.warn('📋 Could not copy to clipboard, logging report instead');
//             console.log(detailedReport);
//           });
//       } else {
//         console.log('📊 Detailed Performance Report:\n', detailedReport);
//       }
//     }

//     // Send to external monitoring if configured
//     this.sendToExternalMonitoring(report);
//   }

//   private generateDetailedReport(): string {
//     const metrics = this.performanceService.currentMetrics();
//     const alerts = this.performanceService.performanceAlerts();
//     const score = this.performanceScore();

//     const report = [
//       '🚀 PERFORMANCE ANALYSIS REPORT',
//       '═'.repeat(50),
//       `Generated: ${new Date().toLocaleString()}`,
//       `Overall Score: ${score}/100 ${this.getScoreRating(score)}`,
//       '',
//       '📊 CORE WEB VITALS',
//       '─'.repeat(30),
//       `• LCP (Largest Contentful Paint): ${this.formatTime(metrics.lcp)} ${this.getMetricRating('lcp', metrics.lcp)}`,
//       `• FID (First Input Delay): ${this.formatTime(metrics.fid)} ${this.getMetricRating('fid', metrics.fid)}`,
//       `• CLS (Cumulative Layout Shift): ${this.formatCLS(metrics.cls)} ${this.getMetricRating('cls', metrics.cls)}`,
//       '',
//       '⚡ OTHER METRICS',
//       '─'.repeat(30),
//       `• FCP (First Contentful Paint): ${this.formatTime(metrics.fcp)} ${this.getMetricRating('fcp', metrics.fcp)}`,
//       `• TTFB (Time to First Byte): ${this.formatTime(metrics.ttfb)} ${this.getMetricRating('ttfb', metrics.ttfb)}`,
//       `• Memory Usage: ${this.formatMemory(metrics.usedJSHeapSize)}`,
//       '',
//       '🚨 ACTIVE ALERTS',
//       '─'.repeat(30),
//     ];

//     if (alerts.length > 0) {
//       alerts.forEach((alert) => {
//         const icon = alert.severity === 'critical' ? '🔴' : '🟡';
//         report.push(
//           `${icon} ${this.formatMetricName(alert.metric)}: ${this.formatMetricValue(alert.metric, alert.value)} (threshold: ${this.formatMetricValue(alert.metric, alert.threshold)})`,
//         );
//       });
//     } else {
//       report.push('✅ No active alerts');
//     }

//     report.push('');
//     report.push('💡 RECOMMENDATIONS');
//     report.push('─'.repeat(30));
//     report.push(...this.getPerformanceRecommendations(metrics, score));

//     return report.join('\n');
//   }

//   private getScoreRating(score: number): string {
//     if (score >= 90) return '🟢 Excellent';
//     if (score >= 80) return '🟡 Good';
//     if (score >= 60) return '🟠 Needs Improvement';
//     return '🔴 Poor';
//   }

//   private getMetricRating(metric: string, value?: number): string {
//     if (!value) return '❓ Unknown';

//     const thresholds: Record<string, { good: number; needs: number }> = {
//       lcp: { good: 2500, needs: 4000 },
//       fid: { good: 100, needs: 300 },
//       cls: { good: 0.1, needs: 0.25 },
//       fcp: { good: 1800, needs: 3000 },
//       ttfb: { good: 800, needs: 1500 },
//     };

//     const threshold = thresholds[metric];
//     if (!threshold) return '';

//     if (value <= threshold.good) return '🟢 Good';
//     if (value <= threshold.needs) return '🟡 Needs Improvement';
//     return '🔴 Poor';
//   }

//   private getPerformanceRecommendations(metrics: any, score: number): string[] {
//     const recommendations: string[] = [];

//     if (metrics.lcp && metrics.lcp > 2500) {
//       recommendations.push(
//         '• Optimize LCP: Consider lazy loading, image optimization, or reduce server response times',
//       );
//     }

//     if (metrics.fid && metrics.fid > 100) {
//       recommendations.push(
//         '• Improve FID: Break up long-running JavaScript tasks, use web workers for heavy computations',
//       );
//     }

//     if (metrics.cls && metrics.cls > 0.1) {
//       recommendations.push(
//         '• Fix CLS: Set size attributes on images/videos, avoid inserting content above existing content',
//       );
//     }

//     if (metrics.fcp && metrics.fcp > 1800) {
//       recommendations.push(
//         '• Optimize FCP: Reduce server response time, eliminate render-blocking resources',
//       );
//     }

//     if (metrics.ttfb && metrics.ttfb > 800) {
//       recommendations.push(
//         '• Improve TTFB: Optimize server response time, use CDN, optimize database queries',
//       );
//     }

//     if (score < 80) {
//       recommendations.push('• Consider implementing service worker for caching');
//       recommendations.push('• Enable gzip/brotli compression');
//       recommendations.push('• Optimize JavaScript bundle size');
//     }

//     if (recommendations.length === 0) {
//       recommendations.push('✅ Performance looks good! Consider monitoring trends over time.');
//     }

//     return recommendations;
//   }

//   private sendToExternalMonitoring(report: string): void {
//     // Placeholder for external monitoring integration
//     // In production, you would send to services like:
//     // - Google Analytics 4 (Web Vitals)
//     // - New Relic
//     // - DataDog
//     // - Custom analytics endpoint

//     if (this.isDevelopment) {
//       console.log('🔄 Would send to external monitoring:', {
//         timestamp: new Date().toISOString(),
//         report: report,
//         url: this.isClientSide() ? window.location.href : 'unknown',
//         userAgent: this.isClientSide() ? navigator.userAgent : 'unknown',
//       });
//     }
//   }

//   private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
//     // Simple notification - in production you might use a toast library
//     if (this.isClientSide()) {
//       const notification = document.createElement('div');
//       notification.className = `fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
//         type === 'success'
//           ? 'bg-green-500 text-white'
//           : type === 'error'
//             ? 'bg-red-500 text-white'
//             : 'bg-blue-500 text-white'
//       }`;
//       notification.textContent = message;
//       document.body.appendChild(notification);

//       setTimeout(() => {
//         notification.remove();
//       }, 3000);
//     }
//   }

//   trackByAlert = (index: number, alert: PerformanceAlert): string =>
//     `${alert.metric}-${alert.timestamp.getTime()}`;

//   getAlertIcon(severity: 'warning' | 'critical'): string {
//     return severity === 'critical' ? '🚨' : '⚠️';
//   }

//   formatMetricName(metric: string): string {
//     const names: Record<string, string> = {
//       lcp: 'Largest Contentful Paint',
//       fid: 'First Input Delay',
//       cls: 'Cumulative Layout Shift',
//       fcp: 'First Contentful Paint',
//       ttfb: 'Time to First Byte',
//       memory: 'Memory Usage',
//       routeChangeTime: 'Route Change Time',
//       componentLoadTime: 'Component Load Time',
//     };
//     return names[metric] || metric;
//   }

//   formatMetricValue(metric: string, value: number): string {
//     if (metric === 'cls') {
//       return value.toFixed(3);
//     } else if (metric === 'memory') {
//       return `${value.toFixed(1)}%`;
//     } else {
//       return `${value.toFixed(0)}ms`;
//     }
//   }

//   formatTime(time?: number): string {
//     return time ? `${time.toFixed(0)}ms` : 'N/A';
//   }

//   formatCLS(cls?: number): string {
//     return cls ? cls.toFixed(3) : 'N/A';
//   }
//   formatMemory(memory?: number): string {
//     return memory ? `${(memory / 1024 / 1024).toFixed(1)}MB` : 'N/A';
//   }
// }
