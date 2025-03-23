import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService, UserSettings } from '../../services/settings.service';
import { ThemeService } from '../../services/theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings: UserSettings;
  newLocation: string = '';
  isDarkMode: boolean = false;
  
  temperatureUnits = [
    { value: 'C', label: 'Celsius (°C)' },
    { value: 'F', label: 'Fahrenheit (°F)' },
    { value: 'K', label: 'Kelvin (K)' }
  ];
  
  refreshIntervals = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 180, label: '3 hours' }
  ];
  
  dashboardLayouts = [
    { value: 'grid', label: 'Grid View' },
    { value: 'list', label: 'List View' }
  ];
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private settingsService: SettingsService,
    private themeService: ThemeService
  ) {
    this.settings = this.settingsService.currentSettings;
  }

  ngOnInit(): void {
    // Subscribe to settings changes
    this.settingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.settings = { ...settings };
      });
    
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
  
  saveSettings(): void {
    this.settingsService.updateSettings(this.settings);
    alert('Settings saved successfully!');
  }
  
  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.settingsService.resetSettings();
    }
  }
  
  addLocation(): void {
    if (this.newLocation.trim() && !this.settings.favoriteLocations.includes(this.newLocation.trim())) {
      this.settings.favoriteLocations.push(this.newLocation.trim());
      this.newLocation = '';
    }
  }
  
  removeLocation(location: string): void {
    this.settings.favoriteLocations = this.settings.favoriteLocations.filter(loc => loc !== location);
  }
  
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
