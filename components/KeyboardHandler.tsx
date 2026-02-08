'use client';
import { useEffect } from 'react';

export function KeyboardHandler() {
  useEffect(() => {
    let initialViewportHeight = window.innerHeight;
    
    // Store initial viewport dimensions
    const setInitialHeight = () => {
      initialViewportHeight = window.innerHeight;
      document.documentElement.style.setProperty('--initial-vh', `${initialViewportHeight}px`);
    };
    
    // Prevent layout shifts when keyboard appears
    const handleViewportChange = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      
      // If height decreased significantly (keyboard appeared), don't adjust layout
      if (heightDiff > 150) {
        // Keyboard is open - keep layout fixed
        const appLayout = document.querySelector('.app-layout') as HTMLElement;
        if (appLayout) {
          appLayout.style.height = `${initialViewportHeight}px`;
          appLayout.style.maxHeight = `${initialViewportHeight}px`;
        }
      } else {
        // Keyboard closed - restore normal height
        const appLayout = document.querySelector('.app-layout') as HTMLElement;
        if (appLayout) {
          appLayout.style.height = '100vh';
          appLayout.style.maxHeight = '100vh';
        }
      }
    };
    
    // Initialize
    setInitialHeight();
    
    // Listen for viewport changes
    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('orientationchange', setInitialHeight, { passive: true });
    
    // Use visual viewport API if available (better for keyboard handling)
    if ('visualViewport' in window && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange, { passive: true });
    }
    
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', setInitialHeight);
      
      if ('visualViewport' in window && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  return null;
}