import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-interface',
  templateUrl: './admin-interface.component.html',
  styleUrls: ['./admin-interface.component.css'],
})
export class AdminInterfaceComponent implements OnInit {
  message: string = '';
  showMessage: boolean = false;
  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { AdminLoggedIn?: boolean };

    if (state?.AdminLoggedIn || localStorage.getItem('AdminLoggedIn') === 'true') {
      this.displayMessage('Admin access successfully');
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
    localStorage.removeItem('AdminLoggedIn'); 
    this.router.navigate(['/login']);

  }
}
