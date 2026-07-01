import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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
    return this.http.post(`${this.apiUrl}/Participant/Register`, registerData);
  }

  checkEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(
      `${this.apiUrl}/Participant/CheckEmail`,
      { email: email }
    );
  }

  login(loginData: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/Participant/Login`,
      loginData
    ).pipe(

      catchError(() => {

        return this.http.post(
          `${this.apiUrl}/Admin/Login`,
          loginData
        );

      }),

      tap((response: any) => {

        if (response && response.token) {

          localStorage.setItem("Token", response.token);
          localStorage.setItem("Role", response.role);

          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('Role');

    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('Token');
  }

  getRole(): string | null {
    return localStorage.getItem('Role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isUser(): boolean {
    return this.getRole() === 'User';
  }
}
