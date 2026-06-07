import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AdminGuard: Checking admin access...');

    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      console.log('AdminGuard: Admin access granted.');
      return true;
    } else {
      console.log('AdminGuard: Access denied, redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
