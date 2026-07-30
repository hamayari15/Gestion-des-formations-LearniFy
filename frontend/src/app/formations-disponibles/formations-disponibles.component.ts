import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FormationService } from '../core/services/formation.service';
import { UserService } from '../core/services/user.service';
import { ParticipantService } from '../core/services/participant.service';
import { InscriptionDialogComponent } from '../inscription-dialog/inscription-dialog.component';

@Component({
  selector: 'app-formations-disponibles',
  templateUrl: './formations-disponibles.component.html',
  styleUrls: ['./formations-disponibles.component.css']
})
export class FormationsDisponiblesComponent implements OnInit {

  formations: any[] = [];
  filteredFormations: any[] = [];

  page = 1;
  limit = 5;
  totalPages = 0;
  totalItems = 0;

  searchTerm = '';
  selectedMode = '';

  loading = false;
  errorKey = '';
  hasAnyFormations: boolean = true;

  constructor(
    private formationService: FormationService,
    private userService: UserService,
    private participantService: ParticipantService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getFormations();
  }

  getFormations(): void {

    this.errorKey = '';
    this.loading = true;

    this.formationService.getFormations(
      this.page,
      this.limit,
      this.searchTerm,
      this.selectedMode
    ).subscribe({

      next: (response: any) => {

        this.formations = response.data.formations;
        this.filteredFormations = response.data.formations;

        this.totalPages = response.data.totalPages;
        this.totalItems = response.data.totalItems;

        if (!this.searchTerm && !this.selectedMode) {
          this.hasAnyFormations = this.totalItems > 0;
        }

        this.loading = false;
      },

      error: (error) => {

        this.loading = false;

        this.errorKey = this.resolveErrorKey(
          error,
          'FORMATIONS_DISPONIBLES.ERROR_FALLBACK'
        );
      }

    });

  }

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'Présentiel': return 'FORMATIONS_DISPONIBLES.PRESENTIEL';
      case 'En ligne': return 'FORMATIONS_DISPONIBLES.ONLINE';
      case 'Hybride': return 'FORMATIONS_DISPONIBLES.HYBRID';
      default: return mode;
    }
  }

  applyFilters(): void {
    this.page = 1;
    this.getFormations();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMode = '';
    this.page = 1;
    this.getFormations();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getFormations();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getFormations();
    }
  }

  goToPage(page: number): void {
    this.page = page;
    this.getFormations();
  }

  inscrire(formation: any): void {

    const payload = this.userService.getUser();

    this.participantService.getParticipantById(payload.id).subscribe({
      next: (participant) => {

        this.dialog.open(InscriptionDialogComponent, {
          width: '550px',
          disableClose: true,
          data: {
            formation,
            participant
          }
        });

      }
    });

  }

  isExpired(periodeDu: string | Date): boolean {
    return new Date() > new Date(periodeDu);
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