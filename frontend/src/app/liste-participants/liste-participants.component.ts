import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../core/services/participant.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { EditParticipantDialogComponent } from '../edit-participant-dialog/edit-participant-dialog.component';

@Component({
  selector: 'app-liste-participants',
  templateUrl: './liste-participants.component.html',
  styleUrls: ['./liste-participants.component.css'],
})
export class ListeParticipantsComponent implements OnInit {

  environment = environment;

  participants: any[] = [];
  filteredParticipants: any[] = [];

  page: number = 1;
  limit: number = 4;
  totalPages: number = 0;
  totalItems: number = 0;

  searchTerm: string = '';
  selectedStatus: string = '';

  loading: boolean = false;
  errorKey: string = '';
  hasAnyParticipants: boolean = true;

  constructor(
    private participantService: ParticipantService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getParticipants();
  }

  getParticipants(): void {
    
    this.loading = true;
    this.errorKey = '';

    this.participantService.getParticipants(
      this.page,
      this.limit,
      this.searchTerm,
      this.selectedStatus
    ).subscribe({

      next: (response: any) => {

        this.participants = response.data.participants;
        this.filteredParticipants = response.data.participants;

        this.totalPages = response.data.totalPages;
        this.totalItems = response.data.totalItems;

        if (!this.searchTerm && !this.selectedStatus) {
          this.hasAnyParticipants = this.totalItems > 0;
        }

        this.loading = false;

      },

      error: (error) => {

        this.loading = false;

        this.errorKey = this.resolveErrorKey(
          error,
          'LISTE_PARTICIPANTS.ERROR_FALLBACK'
        );

      }

    });

  }

  applyFilters(): void {

    this.page = 1;
    this.getParticipants();

  }

  clearFilters(): void {

    this.searchTerm = '';
    this.selectedStatus = '';

    this.page = 1;

    this.getParticipants();

  }

  prevPage(): void {

    if (this.page > 1) {

      this.page--;

      this.getParticipants();

    }

  }

  nextPage(): void {

    if (this.page < this.totalPages) {

      this.page++;

      this.getParticipants();

    }

  }

  goToPage(page: number): void {

    this.page = page;

    this.getParticipants();

  }

  editParticipant(participant: any): void {
    const dialogRef = this.dialog.open(EditParticipantDialogComponent, {
      width: '450',
      disableClose: true,
      data: participant
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getParticipants();
      }
    });
  }

  deleteParticipant(id: string): void {
    Swal.fire({
      icon: 'warning',
      title: this.translate.instant('LISTE_PARTICIPANTS.DELETE_CONFIRM_TITLE'),
      text: this.translate.instant('LISTE_PARTICIPANTS.DELETE_CONFIRM_TEXT'),
      width: 550,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('LISTE_PARTICIPANTS.DELETE_CONFIRM_BTN'),
      cancelButtonText: this.translate.instant('LISTE_PARTICIPANTS.DELETE_CANCEL_BTN'),
      confirmButtonColor: '#dc2626',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.participantService.deleteParticipant(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('LISTE_PARTICIPANTS.DELETE_SUCCESS_TITLE'),
            text: this.translate.instant('LISTE_PARTICIPANTS.DELETE_SUCCESS_TEXT'),
            width: 500,
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            if (this.filteredParticipants.length === 1 && this.page > 1) {
              this.page--;
            }
            this.getParticipants();
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('LISTE_PARTICIPANTS.DELETE_ERROR_TITLE'),
            text: this.translate.instant(
              this.resolveErrorKey(error, 'LISTE_PARTICIPANTS.DELETE_ERROR_FALLBACK')
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

}