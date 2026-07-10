import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {

  constructor(private userService: UserService) {}

  get isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }
}