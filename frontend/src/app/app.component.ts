import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LearniFy';

  constructor(
    public authService: AuthService,
    private translate: TranslateService
  ) {

    this.translate.addLangs(['en', 'fr']);

    this.translate.setDefaultLang('en');

    const language = localStorage.getItem('language') || 'en';

    this.translate.use(language);

  }

}