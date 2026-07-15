import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  menuOpen = false;

  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
      }
    );
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  navigateToLogin(): void {
    this.menuOpen = false;
    this.router.navigate(['login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}