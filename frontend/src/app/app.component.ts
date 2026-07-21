import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LearniFy';
    isAdminRoute = false;


  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {

    this.translate.addLangs(['en', 'fr']);

    this.translate.setDefaultLang('en');

    const language = localStorage.getItem('language') || 'en';

    this.translate.use(language);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdminRoute = this.router.url.startsWith('/admin-interface');
    });

  }

}