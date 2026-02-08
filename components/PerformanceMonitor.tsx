'use client';
import React, { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Android device performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor critical metrics for Android WebView
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Focus on metrics that matter for mobile devices
          if (entry.entryType === 'largest-contentful-paint' && entry.startTime > 2500) {
            // LCP over 2.5s is poor on mobile
            console.warn('LCP performance issue:', entry.startTime);
          }
          
          if (entry.entryType === 'layout-shift') {
            const clsEntry = entry as any; // CLS entries have a value property
            if (clsEntry.value > 0.1) {
              // CLS over 0.1 affects mobile UX
              console.warn('Layout shift detected:', clsEntry.value);
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
      
      // Monitor memory usage on Android
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage detected');
        }
      }
      
      // Cleanup
      return () => observer.disconnect();
    }
  }, []);

  return null; // This component doesn't render anything
}