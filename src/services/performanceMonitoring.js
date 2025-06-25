import { analytics } from '../firebase-config';
import { logEvent } from 'firebase/analytics';

class PerformanceMonitoring {
  constructor() {
    this.metrics = {
      navigationStart: 0,
      loadComplete: 0,
      firstContentfulPaint: 0,
      timeToInteractive: 0
    };

    this.errorCount = 0;
    this.slowRequests = [];
    this.resourceMetrics = new Map();

    // Initialize performance observer
    if ('PerformanceObserver' in window) {
      this.initializeObservers();
    }
  }

  initializeObservers() {
    // Observe paint timing
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
          this.logMetric('FCP', entry.startTime);
        }
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });

    // Observe long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          this.logLongTask(entry);
        }
      }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackResourceTiming(entry);
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
  }

  startTracking() {
    this.metrics.navigationStart = performance.now();
    
    // Track page load
    window.addEventListener('load', () => {
      this.metrics.loadComplete = performance.now();
      this.logPageLoad();
    });

    // Track client-side errors
    window.addEventListener('error', (event) => {
      this.logError(event);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event);
    });
  }

  logPageLoad() {
    const loadTime = this.metrics.loadComplete - this.metrics.navigationStart;
    
    if (analytics && process.env.NODE_ENV === 'production') {
      logEvent(analytics, 'page_load', {
        load_time: loadTime,
        page_path: window.location.pathname,
        fcp: this.metrics.firstContentfulPaint
      });
    }

    console.log('Page Load Metrics:', {
      totalLoadTime: loadTime,
      firstContentfulPaint: this.metrics.firstContentfulPaint
    });
  }

  logError(event) {
    this.errorCount++;
    
    const errorDetails = {
      timestamp: new Date().toISOString(),
      type: event.type,
      message: event.message || event.reason,
      stack: event.error?.stack,
      url: window.location.href
    };

    if (analytics && process.env.NODE_ENV === 'production') {
      logEvent(analytics, 'app_error', errorDetails);
    }

    console.error('Application Error:', errorDetails);
  }

  logLongTask(entry) {
    const taskDetails = {
      duration: entry.duration,
      startTime: entry.startTime,
      name: entry.name
    };

    if (analytics && process.env.NODE_ENV === 'production') {
      logEvent(analytics, 'long_task', taskDetails);
    }

    console.warn('Long Task Detected:', taskDetails);
  }

  trackResourceTiming(entry) {
    const timing = {
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      transferSize: entry.transferSize,
      initiatorType: entry.initiatorType
    };

    this.resourceMetrics.set(entry.name, timing);

    // Track slow resources (taking more than 3 seconds)
    if (entry.duration > 3000) {
      this.slowRequests.push(timing);
      
      if (analytics && process.env.NODE_ENV === 'production') {
        logEvent(analytics, 'slow_resource', timing);
      }

      console.warn('Slow Resource Loading:', timing);
    }
  }

  getMetrics() {
    return {
      pageMetrics: this.metrics,
      errorCount: this.errorCount,
      slowRequests: this.slowRequests,
      resourceMetrics: Array.from(this.resourceMetrics.values())
    };
  }

  // Track custom events
  trackEvent(eventName, eventData) {
    if (analytics && process.env.NODE_ENV === 'production') {
      logEvent(analytics, eventName, {
        ...eventData,
        timestamp: new Date().toISOString()
      });
    }

    console.log('Custom Event:', eventName, eventData);
  }
}

export const performanceMonitor = new PerformanceMonitoring();
export default performanceMonitor; 