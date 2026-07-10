import { Component } from '@angular/core';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {

  constructor(private userService: UserService) {}

  get isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }
}