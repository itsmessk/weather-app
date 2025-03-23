import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) { }

  addEnquiry(data: any): Observable<any> {
    return this.http.post('http://localhost:4500/Enquiry', data);
  }
}
