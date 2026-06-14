import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  register(registerData: any): Observable<any> {
    const endpoint =
      registerData.Profile === 'Admin'
        ? 'Admin/Register'
        : 'Participant/Register';
    return this.http.post(`${this.apiUrl}/${endpoint}`, registerData);
  }

checkEmail(email: string): Observable<{ exists: boolean }> {
  return this.http.post<{ exists: boolean }>(
    `${this.apiUrl}/Participant/CheckEmail`,
    { Email: email }
  );
}

  login(loginData: any): Observable<any> {
    const endpoint =
      loginData.Profile === 'Admin' ? 'Admin/Login' : 'Participant/Login';
    return this.http.post(`${this.apiUrl}/${endpoint}`, loginData).pipe(
      tap((response: any) => {
        if (response && response.Token) {
          this.setToken(response.Token, loginData.Profile);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('Profile');

    this.loggedIn.next(false);
    console.log('logging out...');
  }

  private setToken(Token: string, Profile: string): void {
    localStorage.setItem('Token', Token);
    localStorage.setItem('Profile', Profile);
  }

  getToken(): string | null {
    return localStorage.getItem('Token');
  }

  getProfile(): string | null {
    return localStorage.getItem('Profile');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getProfile() === 'Admin';
  }

  isUser(): boolean {
    return this.getProfile() === 'Participant';
  }
}
