import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
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
  settingsForm: FormGroup = new FormGroup({});
  newLocationControl = new FormControl('');
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
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private themeService: ThemeService
  ) {
    this.settings = this.settingsService.currentSettings;
    this.initForm();
  }

  ngOnInit(): void {
    // Subscribe to settings changes
    this.settingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.settings = { ...settings };
        this.updateForm(settings);
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
  
  initForm(): void {
    this.settingsForm = this.fb.group({
      temperatureUnit: [this.settings.temperatureUnit, Validators.required],
      defaultCity: [this.settings.defaultCity, Validators.required],
      refreshInterval: [this.settings.refreshInterval, Validators.required],
      dashboardLayout: [this.settings.dashboardLayout, Validators.required],
      showNotifications: [this.settings.showNotifications],
      favoriteLocations: this.fb.array(
        this.settings.favoriteLocations.map(location => this.fb.control(location))
      )
    });
  }
  
  updateForm(settings: UserSettings): void {
    this.settingsForm.patchValue({
      temperatureUnit: settings.temperatureUnit,
      defaultCity: settings.defaultCity,
      refreshInterval: settings.refreshInterval,
      dashboardLayout: settings.dashboardLayout,
      showNotifications: settings.showNotifications
    });
    
    // Update favorite locations FormArray
    const locationsArray = this.settingsForm.get('favoriteLocations') as FormArray;
    locationsArray.clear();
    settings.favoriteLocations.forEach(location => {
      locationsArray.push(this.fb.control(location));
    });
  }
  
  get favoriteLocations(): FormArray {
    return this.settingsForm.get('favoriteLocations') as FormArray;
  }
  
  saveSettings(): void {
    if (this.settingsForm.valid) {
      const formValue = this.settingsForm.value;
      this.settingsService.updateSettings(formValue);
      alert('Settings saved successfully!');
    }
  }
  
  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.settingsService.resetSettings();
    }
  }
  
  addLocation(): void {
    const newLocation = this.newLocationControl.value;
    if (newLocation && newLocation.trim() && !this.favoriteLocations.value.includes(newLocation.trim())) {
      this.favoriteLocations.push(this.fb.control(newLocation.trim()));
      this.newLocationControl.reset('');
    }
  }
  
  removeLocation(index: number): void {
    this.favoriteLocations.removeAt(index);
  }
  
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
