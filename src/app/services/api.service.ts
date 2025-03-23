import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WeatherNews } from '../models/weatherNews';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = '4df5844d4b98433fa31c0d92247ee3c5' 
  private apiUrl = 'https://newsapi.org/v2/everything?q=weather&from=2025-03-10&sortBy=popularity';

  constructor(private http: HttpClient) { }

  addEnquiry(data: any): Observable<any> {
    return this.http.post('http://localhost:4500/Enquiry', data);
  }

  getNewsAPI(): Observable<WeatherNews> {
    return this.http.get<WeatherNews>(`${this.apiUrl}&apiKey=${this.apiKey}`);
  }
}
