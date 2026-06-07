import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenKey = 'Token';

  constructor() {}

  public saveToken(Token: string): void {
    localStorage.setItem(this.tokenKey, Token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public getUser(): any {
    const Token = this.getToken();
    if (Token) {
      const Payload = Token.split('.')[1];
      return JSON.parse(atob(Payload));
    }
    return null;
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
