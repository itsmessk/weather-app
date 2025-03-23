import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  CurrentWeatherResponse, 
  ForecastResponse, 
  AstronomyResponse, 
  AlertsResponse, 
  SportsResponse, 
  HistoricalResponse 
} from '../models/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '3333e945a3dc4f3198f190338252303';
  private apiUrlCurrent = 'https://api.weatherapi.com/v1/current.json';
  private apiUrlForecast = 'https://api.weatherapi.com/v1/forecast.json';
  private apiUrlSearch = 'https://api.weatherapi.com/v1/search.json';
  private apiUrlHistory = 'https://api.weatherapi.com/v1/history.json';
  private apiUrlAlerts = 'https://api.weatherapi.com/v1/forecast.json';
  private apiUrlFuture = 'https://api.weatherapi.com/v1/future.json';
  private apiUrlAstronomy = 'https://api.weatherapi.com/v1/astronomy.json';
  private apiUrlMarine = 'https://api.weatherapi.com/v1/marine.json';
  private apiUrlSports = 'https://api.weatherapi.com/v1/sports.json';
  private apiUrlTimezone = 'https://api.weatherapi.com/v1/timezone.json';

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string): Observable<CurrentWeatherResponse> {
    return this.http.get<CurrentWeatherResponse>(`${this.apiUrlCurrent}?key=${this.apiKey}&q=${city}`);
  }
  
  getForecastWeather(city: string, days: number = 7): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(`${this.apiUrlForecast}?key=${this.apiKey}&q=${city}&days=${days}`);
  }

  getSearchWeather(query: string): Observable<any> {
    return this.http.get(`${this.apiUrlSearch}?key=${this.apiKey}&q=${query}`);
  }

  getHistoryWeather(city: string, dt: string): Observable<HistoricalResponse> {
    return this.http.get<HistoricalResponse>(`${this.apiUrlHistory}?key=${this.apiKey}&q=${city}&dt=${dt}`);
  }

  getAlertsWeather(city: string): Observable<AlertsResponse> {
    return this.http.get<AlertsResponse>(`${this.apiUrlAlerts}?key=${this.apiKey}&q=${city}&alerts=yes`);
  }

  getFutureWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlFuture}?key=${this.apiKey}&q=${city}`);
  }

  getAstronomyWeather(city: string): Observable<AstronomyResponse> {
    return this.http.get<AstronomyResponse>(`${this.apiUrlAstronomy}?key=${this.apiKey}&q=${city}`);
  }

  getMarineWeather(query: string): Observable<any> {
    return this.http.get(`${this.apiUrlMarine}?key=${this.apiKey}&q=${query}`);
  }

  getSportsWeather(query: string): Observable<SportsResponse> {
    return this.http.get<SportsResponse>(`${this.apiUrlSports}?key=${this.apiKey}&q=${query}`);
  }

  getTimezoneWeather(query: string): Observable<any> {
    return this.http.get(`${this.apiUrlTimezone}?key=${this.apiKey}&q=${query}`);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<CurrentWeatherResponse> {
    return this.http.get<CurrentWeatherResponse>(`${this.apiUrlCurrent}?key=${this.apiKey}&q=${lat},${lon}`);
  }

  getWeatherByZip(zip: string): Observable<CurrentWeatherResponse> {
    return this.http.get<CurrentWeatherResponse>(`${this.apiUrlCurrent}?key=${this.apiKey}&q=${zip}`);
  }
}
