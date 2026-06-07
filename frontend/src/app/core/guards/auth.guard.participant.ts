import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipantGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('Userguard: Checking user access...');

    if (this.authService.isLoggedIn() && this.authService.isUser()) {
      console.log('Userguard: User access granted.');
      return true;
    } else {
      console.log('Userguard: Access denied, redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
