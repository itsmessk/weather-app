import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '3333e945a3dc4f3198f190338252303';
  private apiUrlCurrent = 'https://api.weatherapi.com/v1/current.json';
  private apiUrlForecast = 'https://api.weatherapi.com/v1/forecast.json';
  private apiUrlSearch = 'https://api.weatherapi.com/v1/search.json';
  private apiUrlHistory = 'https://api.weatherapi.com/v1/history.json';
  private apiUrlAlerts = 'https://api.weatherapi.com/v1/alert.json';
  private apiUrlFuture = 'https://api.weatherapi.com/v1/future.json';
  private apiUrlAstronomy = 'https://api.weatherapi.com/v1/astronomy.json';
  private apiUrlMarine = 'https://api.weatherapi.com/v1/marine.json';
  private apiUrlSports = 'https://api.weatherapi.com/v1/sports.json';
  private apiUrlTimezone = 'https://api.weatherapi.com/v1/timezone.json';

  

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlCurrent}?key=${this.apiKey}&q=${city}`);
  }
  getForecastWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlForecast}?key=${this.apiKey}&q=${city}`);
  }

  getSearchWeather(query: string): Observable<any> {
    return this.http.get(`${this.apiUrlSearch}?key=${this.apiKey}&q=${query}`);
  }

  getHistoryWeather(city: string, dt: string): Observable<any> {
    return this.http.get(`${this.apiUrlHistory}?key=${this.apiKey}&q=${city}&dt=${dt}`);
  }

  getAlertsWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlAlerts}?key=${this.apiKey}&q=${city}`);
  }

  getFutureWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlFuture}?key=${this.apiKey}&q=${city}`);
  }

  getAstronomyWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlAstronomy}?key=${this.apiKey}&q=${city}`);
  }

  getMarineWeather(query: string): Observable<any> {
    return this.http.get(`${this.apiUrlMarine}?key=${this.apiKey}&q=${query}`);
  }

  getSportsWeather(query: string): Observable<any> {
    return this.http.get(`${this.apiUrlSports}?key=${this.apiKey}&q=${query}`);
  }

  getTimezoneWeather(query: string): Observable<any> {
    return this.http.get(`${this.apiUrlTimezone}?key=${this.apiKey}&q=${query}`);
  }

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrlCurrent}?key=${this.apiKey}&q=${city}`);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.apiUrlCurrent}?key=${this.apiKey}&q=${lat},${lon}`);
  }

  getWeatherByZip(zip: string): Observable<any> {
    return this.http.get(`${this.apiUrlCurrent}?key=${this.apiKey}&q=${zip}`);
  }

  
}
