import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InscriptionService } from '../core/services/incription.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-mes-formations',
  templateUrl: './mes-formations.component.html',
  styleUrls: ['./mes-formations.component.css'],
})
export class MesFormationsComponent implements OnInit {
  inscriptions: any[] = [];
  participantid: string = '';

  loading: boolean = false;
  errorKey: string = '';

  constructor(
    private inscriptionService: InscriptionService,
    private userService: UserService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.participantid = this.userService.getUser().id;
    this.getInscriptions();
  }

  getInscriptions(): void {
    this.loading = true;
    this.errorKey = '';

    this.inscriptionService.getInscriptionsByParticipant(this.participantid).subscribe({
      next: (response: any) => {
        this.inscriptions = response.data.inscriptions;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorKey = this.resolveErrorKey(
          error,
          'MES_FORMATIONS.ERROR_FALLBACK'
        );
      }
    });
  }

  private resolveErrorKey(error: any, fallbackKey: string): string {
    const code = error?.error?.code;
    if (code) {
      const key = `BACKEND_ERRORS.${code}`;
      if (this.translate.instant(key) !== key) {
        return key;
      }
    }
    return fallbackKey;
  }
}