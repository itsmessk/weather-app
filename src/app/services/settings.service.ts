import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserSettings {
  temperatureUnit: 'C' | 'F' | 'K';
  defaultCity: string;
  refreshInterval: number; // in minutes
  showNotifications: boolean;
  dashboardLayout: 'grid' | 'list';
  favoriteLocations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'weather_app_settings';
  
  private defaultSettings: UserSettings = {
    temperatureUnit: 'C',
    defaultCity: 'London',
    refreshInterval: 30,
    showNotifications: true,
    dashboardLayout: 'grid',
    favoriteLocations: ['London', 'New York', 'Tokyo', 'Sydney', 'Paris']
  };
  
  private settingsSubject = new BehaviorSubject<UserSettings>(this.defaultSettings);
  
  constructor() {
    this.loadSettings();
  }
  
  get settings$(): Observable<UserSettings> {
    return this.settingsSubject.asObservable();
  }
  
  get currentSettings(): UserSettings {
    return this.settingsSubject.getValue();
  }
  
  updateSettings(settings: Partial<UserSettings>): void {
    const updatedSettings = { ...this.currentSettings, ...settings };
    this.settingsSubject.next(updatedSettings);
    this.saveSettings(updatedSettings);
  }
  
  resetSettings(): void {
    this.settingsSubject.next(this.defaultSettings);
    this.saveSettings(this.defaultSettings);
  }
  
  addFavoriteLocation(location: string): void {
    if (!this.currentSettings.favoriteLocations.includes(location)) {
      const updatedFavorites = [...this.currentSettings.favoriteLocations, location];
      this.updateSettings({ favoriteLocations: updatedFavorites });
    }
  }
  
  removeFavoriteLocation(location: string): void {
    const updatedFavorites = this.currentSettings.favoriteLocations.filter(loc => loc !== location);
    this.updateSettings({ favoriteLocations: updatedFavorites });
  }
  
  private loadSettings(): void {
    try {
      const storedSettings = localStorage.getItem(this.SETTINGS_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        this.settingsSubject.next({ ...this.defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  private saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
}
