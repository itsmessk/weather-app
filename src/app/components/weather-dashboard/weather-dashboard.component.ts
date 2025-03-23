import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

import { WeatherService } from '../../services/weather.service';
import { SettingsService } from '../../services/settings.service';
import { ThemeService } from '../../services/theme.service';

import { 
  CurrentWeatherResponse, 
  WeatherLocation
} from '../../models/weather';

interface WeatherResult {
  city: string;
  data?: CurrentWeatherResponse;
  error?: boolean;
}

@Component({
  selector: 'app-weather-dashboard',
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.css']
})
export class WeatherDashboardComponent implements OnInit, OnDestroy {
  favoriteLocations: string[] = [];
  weatherData: { [city: string]: CurrentWeatherResponse } = {};
  loading: boolean = true;
  error: string = '';
  temperatureUnit: 'C' | 'F' | 'K' = 'C';
  dashboardLayout: 'grid' | 'list' = 'grid';
  refreshInterval: number = 30; // minutes
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    public settingsService: SettingsService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to settings changes
    this.settingsService.settings$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(settings => {
      this.temperatureUnit = settings.temperatureUnit;
      this.favoriteLocations = settings.favoriteLocations;
      this.dashboardLayout = settings.dashboardLayout;
      this.refreshInterval = settings.refreshInterval;
      
      // Load weather data for all favorite locations
      this.loadAllWeatherData();
    });

    // Setup auto-refresh
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllWeatherData(): void {
    this.loading = true;
    this.error = '';

    if (this.favoriteLocations.length === 0) {
      // Add default locations if no favorites
      this.favoriteLocations = ['London', 'New York', 'Tokyo', 'Sydney'];
      this.settingsService.updateSettings({
        favoriteLocations: this.favoriteLocations
      });
    }

    const weatherPromises = this.favoriteLocations.map(city => 
      this.weatherService.getCurrentWeather(city).toPromise()
        .then(data => ({ city, data } as WeatherResult))
        .catch(err => {
          console.error(`Error fetching weather for ${city}:`, err);
          return { city, error: true } as WeatherResult;
        })
    );

    Promise.all(weatherPromises)
      .then(results => {
        this.weatherData = {};
        results.forEach(result => {
          if (result.data && !result.error) {
            this.weatherData[result.city] = result.data;
          }
        });
        this.loading = false;
      })
      .catch(err => {
        console.error('Error loading weather data:', err);
        this.error = 'Failed to load weather data. Please try again later.';
        this.loading = false;
      });
  }

  setupAutoRefresh(): void {
    // Auto refresh weather data at specified interval
    interval(this.refreshInterval * 60 * 1000) // Convert minutes to milliseconds
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          console.log('Auto-refreshing weather data...');
          return new Promise<void>(resolve => {
            this.loadAllWeatherData();
            resolve();
          });
        })
      )
      .subscribe();
  }

  viewCityDetails(city: string): void {
    this.router.navigate(['/city', city]);
  }

  getBackgroundClass(code: number): string {
    // Map weather code to CSS class for background
    if (code >= 200 && code < 300) return 'weather-thunderstorm';
    if (code >= 300 && code < 400) return 'weather-drizzle';
    if (code >= 500 && code < 600) return 'weather-rain';
    if (code >= 600 && code < 700) return 'weather-snow';
    if (code >= 700 && code < 800) return 'weather-atmosphere';
    if (code === 800) return 'weather-clear';
    if (code > 800) return 'weather-clouds';
    return 'weather-default';
  }

  addToFavorites(city: string): void {
    if (!this.favoriteLocations.includes(city)) {
      const updatedLocations = [...this.favoriteLocations, city];
      this.settingsService.updateSettings({
        favoriteLocations: updatedLocations
      });
    }
  }

  removeFromFavorites(city: string, event: Event): void {
    event.stopPropagation(); // Prevent card click event
    const updatedLocations = this.favoriteLocations.filter(loc => loc !== city);
    this.settingsService.updateSettings({
      favoriteLocations: updatedLocations
    });
    delete this.weatherData[city];
  }
}
