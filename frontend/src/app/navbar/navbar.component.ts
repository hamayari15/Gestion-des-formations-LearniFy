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

  showLanguages = false;
  currentLanguage = this.translate.currentLang || 'en';

  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
      }
    );
    
    this.currentLanguage = localStorage.getItem('userLanguage') || 'en';
  }

  get isParticipant(): boolean {
    return this.authService.getRole() === 'User';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('userLanguage', lang);
    this.currentLanguage = lang;

    this.closeMenu();
  }
  
  navigateToRegister(): void {
    this.closeMenu();
    this.router.navigate(['register']);
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
    
    this.menuOpen = false;
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}