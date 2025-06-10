import { TestBed } from '@angular/core/testing';
import { PerformanceService } from './performance.service';

describe('PerformanceService', () => {
  let service: PerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerformanceService],
    });
    service = TestBed.inject(PerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty metrics', () => {
    const metrics = service.currentMetrics();
    expect(metrics).toEqual({});
  });

  it('should have no performance issues initially', () => {
    expect(service.hasPerformanceIssues()).toBeFalsy();
  });

  it('should track route change time', () => {
    const startTime = performance.now();
    service.measureRouteChange(startTime);

    const metrics = service.currentMetrics();
    expect(metrics.routeChangeTime).toBeGreaterThan(0);
  });

  it('should track component load time', () => {
    const startTime = performance.now();
    service.measureComponentLoad('TestComponent', startTime);

    const metrics = service.currentMetrics();
    expect(metrics.componentLoadTime).toBeGreaterThan(0);
  });

  it('should generate performance report', () => {
    const report = service.getPerformanceReport();
    expect(report).toContain('Performance Report');
    expect(report).toContain('LCP:');
    expect(report).toContain('FID:');
  });

  it('should clear alerts', () => {
    service.clearAlerts();
    expect(service.performanceAlerts().length).toBe(0);
  });
});
