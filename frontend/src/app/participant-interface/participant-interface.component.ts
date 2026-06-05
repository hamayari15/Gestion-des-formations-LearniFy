import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-interface',
  templateUrl: './participant-interface.component.html',
  styleUrls: ['./participant-interface.component.css'],
})
export class ParticipantInterfaceComponent implements OnInit {
  message: string = '';
  showMessage: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { AdminLoggedIn?: boolean };

    if (state?.AdminLoggedIn || localStorage.getItem('UserLoggedIn') === 'true') {
      this.displayMessage('User access successfully');
    }
  }

  displayMessage(message: string) {
    this.message = message;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 3000); 
  }

  closeMessage() {
    this.showMessage = false;
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('UserLoggedIn');
    this.router.navigate(['/login']);
  }
}
