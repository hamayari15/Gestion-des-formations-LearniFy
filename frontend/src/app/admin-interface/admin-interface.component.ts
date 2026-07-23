import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-interface',
  templateUrl: './admin-interface.component.html',
  styleUrls: ['./admin-interface.component.css'],
})
export class AdminInterfaceComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {}

  showLanguages = false;
  currentLanguage = this.translate.currentLang || 'en';
  sidebarOpen = false;

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.currentLanguage = lang;

    this.sidebarOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {}

};
