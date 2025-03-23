import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();
  private renderer: Renderer2;
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkMode.next(savedTheme === 'true');
    } else {
      // Check if user prefers dark mode based on system preference
      this.darkMode.next(this.mediaQuery.matches);
    }
    
    // Listen for system preference changes
    this.mediaQuery.addEventListener('change', e => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('darkMode')) {
        this.darkMode.next(e.matches);
        this.applyTheme(e.matches);
      }
    });
    
    // Apply theme on initialization
    this.applyTheme(this.darkMode.value);
  }

  toggleDarkMode(): void {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    localStorage.setItem('darkMode', newValue.toString());
    this.applyTheme(newValue);
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);
    localStorage.setItem('darkMode', isDark.toString());
    this.applyTheme(isDark);
  }

  resetToSystemPreference(): void {
    localStorage.removeItem('darkMode');
    const systemPrefersDark = this.mediaQuery.matches;
    this.darkMode.next(systemPrefersDark);
    this.applyTheme(systemPrefersDark);
  }

  private applyTheme(isDark: boolean): void {
    // Add transition class first for smooth transition
    this.renderer.addClass(document.body, 'theme-transition');
    
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.setAttribute(document.documentElement, 'data-bs-theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.setAttribute(document.documentElement, 'data-bs-theme', 'light');
    }
    
    // Remove transition class after transition completes
    setTimeout(() => {
      this.renderer.removeClass(document.body, 'theme-transition');
    }, 300);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#121212' : '#ffffff');
    }
  }
}
