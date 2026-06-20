import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipantGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('UserGuard: Checking user access...');

    if (this.authService.isLoggedIn() && this.authService.isUser()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
