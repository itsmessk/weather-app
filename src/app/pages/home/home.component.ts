import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsService } from '../../services/settings.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  isDarkMode: boolean = false;
  featuredCities: string[] = ['Chennai', 'London', 'New York', 'Tokyo', 'Sydney', 'Paris', 'Dubai'];
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/city-weather', this.searchQuery.trim()]);
    }
  }

  navigateToCity(city: string): void {
    if (city) {
      this.router.navigate(['/city-weather', city]);
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
