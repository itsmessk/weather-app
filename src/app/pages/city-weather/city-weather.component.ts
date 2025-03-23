import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';
import * as L from 'leaflet';
import { 
  CurrentWeatherResponse, 
  ForecastResponse, 
  AstronomyResponse, 
  AlertsResponse, 
  SportsResponse, 
  HistoricalResponse,
  CurrentWeather,
  Location as WeatherLocation,
  Forecast,
  ForecastDay
} from '../../models/weather';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.css']
})
export class CityWeatherComponent implements OnInit, AfterViewInit, OnDestroy {
  cityName: string = 'London'; // Default city
  weatherData: any = null;
  currentWeather: CurrentWeather | null = null;
  location: WeatherLocation | null = null;
  forecast: Forecast | null = null;
  forecastData: ForecastDay[] = [];
  loading: boolean = false;
  error: string = '';
  map: L.Map | null = null;
  weatherTypes: string[] = ['Current', 'Forecast', 'Astronomy', 'Alerts', 'Air Quality', 'Sports', 'Historical'];
  selectedWeatherType: string = 'Current';
  mapMarkers: L.Marker[] = [];
  defaultCities: string[] = ['London', 'New York', 'Tokyo', 'Sydney', 'Mumbai', 'Paris'];
  mapInitialized: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private themeService: ThemeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fix Leaflet icon issues
    this.fixLeafletIconIssue();
    
    // Get city name from route parameter or URL query parameters
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const cityParam = params.get('cityName');
      if (cityParam) {
        this.cityName = cityParam;
      } else {
        // If no route param, check for query param
        this.route.queryParamMap.subscribe(queryParams => {
          const cityQuery = queryParams.get('city');
          if (cityQuery) {
            this.cityName = cityQuery;
          }
        });
      }
      
      // Load city weather
      this.getWeatherData();
    });
    
    // Subscribe to theme changes
    this.themeService.darkMode$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isDark => {
      if (this.map && this.mapInitialized) {
        this.updateMapTiles(isDark);
      }
    });

    // Listen for window refresh events
    window.addEventListener('beforeunload', () => {
      // Store current city in sessionStorage to restore after refresh
      sessionStorage.setItem('lastViewedCity', this.cityName);
    });

    // Check if there's a stored city from a previous session
    const lastViewedCity = sessionStorage.getItem('lastViewedCity');
    if (lastViewedCity && !this.route.snapshot.paramMap.get('cityName')) {
      this.cityName = lastViewedCity;
      this.getWeatherData();
    }
  }

  ngAfterViewInit(): void {
    // Initialize map with delay to ensure the container is ready
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up map resources
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // Fix for Leaflet marker icon issue
  private fixLeafletIconIssue(): void {
    // Fix Leaflet's default icon path issues
    const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';
    const iconDefault = L.icon({
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  initMap(): void {
    try {
      // Check if map container exists
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map container not found');
        return;
      }
      
      // If map already exists, remove it first to prevent duplicates
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
      
      // Create map instance
      this.map = L.map('map', {
        center: [51.505, -0.09], // Default to London
        zoom: 10,
        attributionControl: true
      });
      
      // Add tile layer based on theme
      this.themeService.darkMode$
        .pipe(takeUntil(this.destroy$))
        .subscribe(isDark => {
          if (this.map) {
            this.updateMapTiles(isDark);
          }
        });
      
      // Add scale control
      L.control.scale().addTo(this.map);
      
      this.mapInitialized = true;
      console.log('Map initialized successfully');
      
      // Force a redraw of the map to ensure it renders properly
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          
          // If we already have weather data, update the map
          if (this.location && this.currentWeather) {
            this.updateMapWithLocation(this.location.lat, this.location.lon, this.currentWeather.condition.text);
          }
        }
      }, 500);
    } catch (error) {
      console.error('Error initializing map:', error);
      this.mapInitialized = false;
    }
  }

  updateMapTiles(isDark: boolean): void {
    if (!this.map) {
      return;
    }
    
    try {
      // Remove existing tile layers
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer && this.map) {
          this.map.removeLayer(layer);
        }
      });

      // Add appropriate tile layer based on theme
      if (isDark) {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        }).addTo(this.map);
      } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(this.map);
      }
    } catch (error) {
      console.error('Error updating map tiles:', error);
    }
  }

  loadRandomCity(): void {
    const randomIndex = Math.floor(Math.random() * this.defaultCities.length);
    this.cityName = this.defaultCities[randomIndex];
    this.getWeatherData();
  }

  getWeatherData(): void {
    this.loading = true;
    this.error = '';
    
    // Clear existing data to avoid showing stale data during loading
    this.weatherData = null;
    this.currentWeather = null;
    this.location = null;
    this.forecast = null;
    this.forecastData = [];
    
    // Get current weather data
    this.weatherService.getCurrentWeather(this.cityName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.currentWeather = data.current;
          this.location = data.location;
          
          // After getting location data, update the map
          if (this.location) {
            // Wait for map to be ready
            if (this.map) {
              this.updateMapWithLocation(this.location.lat, this.location.lon, this.currentWeather?.condition.text || '');
            } else {
              // If map isn't ready yet, initialize it
              this.initMap();
              // Try updating again after a delay
              setTimeout(() => {
                if (this.map && this.location) {
                  this.updateMapWithLocation(this.location.lat, this.location.lon, this.currentWeather?.condition.text || '');
                }
              }, 1000);
            }
          }
          
          this.loading = false;
          
          // After getting current weather, get forecast data
          this.getForecastData();
        },
        error: (err) => {
          console.error('Error fetching weather data:', err);
          this.error = `Could not load weather data for ${this.cityName}. Please try another city.`;
          this.loading = false;
        }
      });
  }

  getForecastData(): void {
    if (!this.cityName.trim()) {
      return;
    }
    
    this.weatherService.getForecastWeather(this.cityName, 7)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.forecast = data.forecast;
          this.forecastData = data.forecast.forecastday;
          
          // Update the UI based on the selected weather type
          this.updateWeatherDisplay();
        },
        error: (err) => {
          console.error('Error fetching forecast data:', err);
          // Don't show error for forecast if we already have current weather
          if (!this.currentWeather) {
            this.error = `Could not load forecast data for ${this.cityName}. Please try another city.`;
          }
        }
      });
  }

  searchWeather(): void {
    if (this.cityName.trim()) {
      this.getWeatherData();
      
      // Force map to reinitialize completely
      if (this.map) {
        this.map.remove();
        this.map = null;
        this.mapInitialized = false;
        
        // Wait for DOM to update before reinitializing
        setTimeout(() => {
          this.initMap();
          
          // After map is initialized, update it with location data once weather data is loaded
          const checkDataAndUpdateMap = () => {
            if (this.location && this.currentWeather) {
              this.updateMapWithLocation(this.location.lat, this.location.lon, this.currentWeather.condition.text);
            } else {
              // Keep checking until data is available
              setTimeout(checkDataAndUpdateMap, 500);
            }
          };
          
          setTimeout(checkDataAndUpdateMap, 1000);
        }, 300);
      }
    }
  }

  getCurrentWeather(): void {
    this.weatherService.getCurrentWeather(this.cityName).subscribe({
      next: (data: CurrentWeatherResponse) => {
        this.currentWeather = data.current;
        this.location = data.location;
        this.weatherData = data;
        this.loading = false;
        
        // Ensure map is updated after getting weather data
        setTimeout(() => {
          this.updateMap();
        }, 300);
      },
      error: (err) => {
        console.error('Error fetching weather data:', err);
        this.error = 'Failed to load weather data. Please check the city name and try again.';
        this.loading = false;
      }
    });
  }

  getForecastWeather(): void {
    this.weatherService.getForecastWeather(this.cityName).subscribe({
      next: (data: ForecastResponse) => {
        this.weatherData = data;
        this.currentWeather = data.current;
        this.location = data.location;
        this.forecast = data.forecast;
        this.forecastData = data.forecast.forecastday;
        this.loading = false;
        
        // Ensure map is initialized before updating
        if (this.mapInitialized && this.map) {
          this.updateMapWithLocation(data.location.lat, data.location.lon, 'Forecast');
        } else {
          // If map isn't initialized yet, try to initialize it
          this.initMap();
          // Then update the map after a delay
          setTimeout(() => {
            this.updateMapWithLocation(data.location.lat, data.location.lon, 'Forecast');
          }, 500);
        }
      },
      error: (err) => {
        console.error('Error fetching forecast data:', err);
        this.error = 'Failed to load forecast data. Please check the city name and try again.';
        this.loading = false;
      }
    });
  }

  getAstronomyWeather(): void {
    this.weatherService.getAstronomyWeather(this.cityName).subscribe({
      next: (data: AstronomyResponse) => {
        this.weatherData = data;
        this.location = data.location;
        this.loading = false;
        
        // Ensure map is initialized before updating
        if (this.mapInitialized && this.map) {
          this.updateMapWithLocation(data.location.lat, data.location.lon, 'Astronomy');
        } else {
          // If map isn't initialized yet, try to initialize it
          this.initMap();
          // Then update the map after a delay
          setTimeout(() => {
            this.updateMapWithLocation(data.location.lat, data.location.lon, 'Astronomy');
          }, 500);
        }
      },
      error: (err) => {
        console.error('Error fetching astronomy data:', err);
        this.error = 'Failed to load astronomy data. Please check the city name and try again.';
        this.loading = false;
      }
    });
  }

  getAlertsWeather(): void {
    this.weatherService.getAlertsWeather(this.cityName).subscribe({
      next: (data: AlertsResponse) => {
        this.weatherData = data;
        this.location = data.location;
        this.loading = false;
        
        // Ensure map is initialized before updating
        if (this.mapInitialized && this.map) {
          this.updateMapWithLocation(data.location.lat, data.location.lon, 'Alerts');
        } else {
          // If map isn't initialized yet, try to initialize it
          this.initMap();
          // Then update the map after a delay
          setTimeout(() => {
            this.updateMapWithLocation(data.location.lat, data.location.lon, 'Alerts');
          }, 500);
        }
      },
      error: (err) => {
        console.error('Error fetching alerts data:', err);
        this.error = 'Failed to load alerts data. Please check the city name and try again.';
        this.loading = false;
      }
    });
  }

  getAirQualityWeather(): void {
    this.weatherService.getCurrentWeather(this.cityName + '&aqi=yes').subscribe({
      next: (data: CurrentWeatherResponse) => {
        this.weatherData = data;
        this.currentWeather = data.current;
        this.location = data.location;
        this.loading = false;
        
        // Ensure map is initialized before updating
        if (this.mapInitialized && this.map) {
          this.updateMapWithLocation(data.location.lat, data.location.lon, 'Air Quality');
        } else {
          // If map isn't initialized yet, try to initialize it
          this.initMap();
          // Then update the map after a delay
          setTimeout(() => {
            this.updateMapWithLocation(data.location.lat, data.location.lon, 'Air Quality');
          }, 500);
        }
      },
      error: (err) => {
        console.error('Error fetching air quality data:', err);
        this.error = 'Failed to load air quality data. Please check the city name and try again.';
        this.loading = false;
      }
    });
  }

  getSportsWeather(): void {
    this.weatherService.getSportsWeather(this.cityName).subscribe({
      next: (data: SportsResponse) => {
        this.weatherData = data;
        this.loading = false;
        
        // Sports API might not return location data, so we need to handle that case
        if (data.location) {
          this.location = data.location;
          // Ensure map is initialized before updating
          if (this.mapInitialized && this.map) {
            this.updateMapWithLocation(data.location.lat, data.location.lon, 'Sports');
          } else {
            // If map isn't initialized yet, try to initialize it
            this.initMap();
            // Then update the map after a delay
            setTimeout(() => {
              if (data.location) {
                this.updateMapWithLocation(data.location.lat, data.location.lon, 'Sports');
              }
            }, 500);
          }
        } else {
          // If location is not available, get the current weather to get the location
          this.weatherService.getCurrentWeather(this.cityName).subscribe({
            next: (weatherData: CurrentWeatherResponse) => {
              this.location = weatherData.location;
              // Update map with the location from current weather
              if (this.mapInitialized && this.map) {
                this.updateMapWithLocation(weatherData.location.lat, weatherData.location.lon, 'Sports');
              } else {
                this.initMap();
                setTimeout(() => {
                  this.updateMapWithLocation(weatherData.location.lat, weatherData.location.lon, 'Sports');
                }, 500);
              }
            },
            error: (err) => {
              console.error('Error fetching location data for sports:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching sports data:', err);
        this.error = 'Failed to load sports data. Please check the city name and try again.';
        this.loading = false;
      }
    });
  }

  getHistoricalWeather(): void {
    // Get date for yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    
    this.weatherService.getHistoryWeather(this.cityName, dateStr).subscribe({
      next: (data: HistoricalResponse) => {
        this.weatherData = data;
        this.location = data.location;
        this.forecast = data.forecast;
        this.forecastData = data.forecast.forecastday;
        this.loading = false;
        
        // Ensure map is initialized before updating
        if (this.mapInitialized && this.map) {
          this.updateMapWithLocation(data.location.lat, data.location.lon, 'Historical');
        } else {
          // If map isn't initialized yet, try to initialize it
          this.initMap();
          // Then update the map after a delay
          setTimeout(() => {
            this.updateMapWithLocation(data.location.lat, data.location.lon, 'Historical');
          }, 500);
        }
      },
      error: (err) => {
        console.error('Error fetching historical data:', err);
        this.error = 'Failed to load historical data. Please check the city name and try again.';
        this.loading = false;
      }
    });
  }

  updateMapWithLocation(lat: number, lon: number, label: string): void {
    if (!this.map) {
      console.warn('Map not initialized yet');
      // Try to initialize the map
      this.initMap();
      // Try again after a delay
      setTimeout(() => {
        this.updateMapWithLocation(lat, lon, label);
      }, 1000);
      return;
    }

    try {
      // Clear existing markers
      this.clearMapMarkers();
      
      // Create custom icon
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Add marker for the location
      const marker = L.marker([lat, lon], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`<b>${this.cityName}</b><br>${label}`)
        .openPopup();
      
      this.mapMarkers.push(marker);
      
      // Center map on the location
      this.map.setView([lat, lon], 10);
      
      // Force a redraw of the map
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 300);
    } catch (error) {
      console.error('Error updating map:', error);
    }
  }

  clearMapMarkers(): void {
    // Remove all markers from the map
    this.mapMarkers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.mapMarkers = [];
  }

  updateMap(): void {
    if (this.location && this.weatherData) {
      // If map is not initialized, initialize it
      if (!this.map || !this.mapInitialized) {
        this.initMap();
        return;
      }

      // Clear existing markers
      this.clearMapMarkers();

      // Add marker for current location
      const lat = this.location.lat;
      const lon = this.location.lon;
      
      if (lat && lon) {
        // Set map view to new location
        this.map.setView([lat, lon], 10);
        
        // Add marker
        const marker = L.marker([lat, lon]).addTo(this.map);
        marker.bindPopup(`<b>${this.location.name}, ${this.location.country}</b><br>Current temperature: ${this.currentWeather?.temp_c}°C`).openPopup();
        this.mapMarkers.push(marker);
      }
    }
  }

  updateWeatherDisplay(): void {
    // Update the UI based on the selected weather type
    switch (this.selectedWeatherType) {
      case 'Current':
        // Current weather is already displayed
        break;
      case 'Forecast':
        // Ensure forecast data is loaded
        if (!this.forecast && this.cityName) {
          this.getForecastData();
        }
        break;
      case 'Astronomy':
        this.getAstronomyWeather();
        break;
      case 'Alerts':
        this.getAlertsWeather();
        break;
      case 'Air Quality':
        this.getAirQualityWeather();
        break;
      case 'Sports':
        this.getSportsWeather();
        break;
      case 'Historical':
        this.getHistoricalWeather();
        break;
    }
  }

  getWeatherIconClass(code: number): string {
    // Map weather condition codes to Bootstrap icons
    // This is a simplified mapping, you may want to expand it
    if (code >= 200 && code < 300) return 'bi-cloud-lightning-rain';
    if (code >= 300 && code < 400) return 'bi-cloud-drizzle';
    if (code >= 500 && code < 600) return 'bi-cloud-rain';
    if (code >= 600 && code < 700) return 'bi-cloud-snow';
    if (code >= 700 && code < 800) return 'bi-cloud-haze';
    if (code === 800) return 'bi-sun';
    if (code > 800) return 'bi-cloud-sun';
    return 'bi-cloud';
  }

  getWeatherEffectClass(code: number): string {
    // Rain conditions: 1063, 1180-1198, 1240-1246, 1273, 1276
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1240, 1243, 1246, 1273, 1276].includes(code)) {
      return 'rain-effect';
    }
    
    // Snow conditions: 1066, 1114, 1117, 1210-1225, 1255-1258, 1279, 1282
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282].includes(code)) {
      return 'snow-effect';
    }
    
    // Cloudy conditions: 1003, 1006, 1009, 1030, 1135, 1147
    if ([1003, 1006, 1009, 1030, 1135, 1147].includes(code)) {
      return 'cloudy-effect';
    }
    
    // Sunny conditions: 1000 (day)
    if (code === 1000 && this.location && this.isDay()) {
      return 'sunny-effect';
    }
    
    // Fog conditions: 1030, 1135, 1147
    if ([1030, 1135, 1147].includes(code)) {
      return 'fog-effect';
    }
    
    // Thunder conditions: 1087, 1273, 1276, 1279, 1282
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
      return 'thunder-effect';
    }
    
    // Default - no special effect
    return '';
  }

  isDay(): boolean {
    if (!this.currentWeather) return true;
    return this.currentWeather.is_day === 1;
  }

  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getHourFromTime(timeString: string): number {
    // Parse the hour from a time string (e.g., "2023-03-24 13:00")
    const date = new Date(timeString);
    return date.getHours();
  }

  getAQIDescription(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  getAQIColor(aqi: number): string {
    if (aqi <= 50) return 'success';
    if (aqi <= 100) return 'info';
    if (aqi <= 150) return 'warning';
    if (aqi <= 200) return 'warning';
    if (aqi <= 300) return 'danger';
    return 'danger';
  }
}
