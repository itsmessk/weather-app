import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLogged = false;

  constructor() { 
    this.isLogged = localStorage.getItem('isLogged') === 'true';
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.isLogged = true;
      localStorage.setItem('isLogged', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLogged = false;
    localStorage.setItem('isLogged', 'false');
  }

  isAuthenticated(): boolean {
    return this.isLogged;
  }
}
