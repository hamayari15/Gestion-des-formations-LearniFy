import { Component, OnInit } from '@angular/core';
import { FormationService } from '../core/services/formation.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { AddFormationDialogComponent }
from '../add-formation-dialog/add-formation-dialog.component';
import { EditFormationDialogComponent } from '../edit-formation-dialog/edit-formation-dialog.component';

@Component({
  selector: 'app-cycle-formations',
  templateUrl: './cycle-formations.component.html',
  styleUrls: ['./cycle-formations.component.css'],
})
export class CycleFormationsComponent implements OnInit {

  formations: any[] = [];
  filteredFormations: any[] = [];

  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  searchTerm = '';
  selectedMode: string = '';
  statusFilter: 'all' | 'active' | 'archived' = 'all';

  loading: boolean = false;
  errorKey: string = '';
  hasAnyFormations: boolean = true;

  constructor(
    private formationService: FormationService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getFormations();
  }

  getFormations(): void {

    this.errorKey = '';
    this.loading = true

    this.formationService.getFormations(
      this.page,
      this.limit,
      this.searchTerm,
      this.selectedMode,
      this.statusFilter
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
          'CYCLE_FORMATIONS.ERROR_FALLBACK'
        );
      }
    });
  }

  setStatusFilter(status: 'all' | 'active' | 'archived'): void {
    if (this.statusFilter === status) return;
    this.statusFilter = status;
    this.page = 1;
    this.getFormations();
  }

  applyFilters(): void {
    this.page = 1;
    this.getFormations();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMode = '';
    this.page = 1
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

  goToPage(p: number): void {
    this.page = p;
    this.getFormations();
  }

  navigateToAddFormation(): void {
    const dialogRef = this.dialog.open(AddFormationDialogComponent, {
      width: '550px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getFormations();
      }
    });
  }

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'Présentiel': return 'CYCLE_FORMATIONS.PRESENTIEL';
      case 'En ligne': return 'CYCLE_FORMATIONS.ONLINE';
      case 'Hybride': return 'CYCLE_FORMATIONS.HYBRID';
      default: return mode;
    }
  }

  editFormation(formation: any): void {
    const dialogRef = this.dialog.open(EditFormationDialogComponent, {
      width: '550px',
      disableClose: true,
      data: formation
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getFormations();
      }
    });
  }

  archiveFormation(id: string): void {
    Swal.fire({
      icon: 'warning',
      title: this.translate.instant('CYCLE_FORMATIONS.ARCHIVE_CONFIRM_TITLE'),
      text: this.translate.instant('CYCLE_FORMATIONS.ARCHIVE_CONFIRM_TEXT'),
      width: 550,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('CYCLE_FORMATIONS.ARCHIVE_CONFIRM_BTN'),
      cancelButtonText: this.translate.instant('CYCLE_FORMATIONS.ARCHIVE_CANCEL_BTN'),
      confirmButtonColor: '#d97706',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.formationService.archiveFormation(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('CYCLE_FORMATIONS.ARCHIVE_SUCCESS_TITLE'),
            text: this.translate.instant('CYCLE_FORMATIONS.ARCHIVE_SUCCESS_TEXT'),
            width: 500,
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getFormations();
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('CYCLE_FORMATIONS.ARCHIVE_ERROR_TITLE'),
            text: this.translate.instant(
              this.resolveErrorKey(error, 'CYCLE_FORMATIONS.ARCHIVE_ERROR_FALLBACK')
            ),
            width: 500,
          });
        },
      });
    });
  }

  unarchiveFormation(id: string): void {
  Swal.fire({
    icon: 'question',
    title: this.translate.instant('CYCLE_FORMATIONS.UNARCHIVE_CONFIRM_TITLE'),
    text: this.translate.instant('CYCLE_FORMATIONS.UNARCHIVE_CONFIRM_TEXT'),
    width: 550,
    showCancelButton: true,
    confirmButtonText: this.translate.instant('CYCLE_FORMATIONS.UNARCHIVE_CONFIRM_BTN'),
    cancelButtonText: this.translate.instant('CYCLE_FORMATIONS.UNARCHIVE_CANCEL_BTN'),
    confirmButtonColor: '#185fa5',
  }).then((result) => {
    if (!result.isConfirmed) return;

    this.formationService.unarchiveFormation(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('CYCLE_FORMATIONS.UNARCHIVE_SUCCESS_TITLE'),
          text: this.translate.instant('CYCLE_FORMATIONS.UNARCHIVE_SUCCESS_TEXT'),
          width: 500,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.getFormations();
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('CYCLE_FORMATIONS.UNARCHIVE_ERROR_TITLE'),
          text: this.translate.instant(
            this.resolveErrorKey(error, 'CYCLE_FORMATIONS.UNARCHIVE_ERROR_FALLBACK')
          ),
          width: 500,
        });
      },
    });
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

};