import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  register(registerData: any): Observable<any> {
    const endpoint =
      registerData.profile === 'admin'
        ? 'Admin/register'
        : 'Participant/register';
    return this.http.post(`${this.apiUrl}/${endpoint}`, registerData);
  }

  login(loginData: any): Observable<any> {
    const endpoint =
      loginData.profile === 'admin' ? 'Admin/login' : 'Participant/login';
    return this.http.post(`${this.apiUrl}/${endpoint}`, loginData).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token, loginData.profile);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');

    this.loggedIn.next(false);
    console.log('logging out...');
  }

  private setToken(token: string, profile: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('profile', profile);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getProfile(): string | null {
    return localStorage.getItem('profile');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getProfile() === 'admin';
  }

  isUser(): boolean {
    return this.getProfile() === 'participant';
  }
}
