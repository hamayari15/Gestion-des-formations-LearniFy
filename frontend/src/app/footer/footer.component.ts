import { Component } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {

  constructor(private userService: UserService, private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }
  
  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }
}