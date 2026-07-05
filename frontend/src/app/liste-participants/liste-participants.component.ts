import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../core/services/participant.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
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
  limit: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  searchTerm: string = '';
  selectedStatus: string = '';

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private participantService: ParticipantService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getParticipants();
    this.loading = true;
  }

  getParticipants(): void {

    this.errorMessage = '';

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

        this.loading = false;

      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Erreur lors de la récupération des participants';

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
      title: 'Supprimer ce participant ?',
      text: 'Cette action est irréversible.',
      width: 550,
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc2626',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.participantService.deleteParticipant(id).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: response.message,
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
            title: 'Erreur',
            text: error?.error.message || 'Une erreur est survenue lors de la suppression.',
            width: 500,
          });
        },
      });
    });
  }

}