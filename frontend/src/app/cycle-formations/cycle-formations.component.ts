import { Component, OnInit } from '@angular/core';
import { FormationService } from '../core/services/formation.service';
import { MatDialog } from '@angular/material/dialog';
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

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private formationService: FormationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getFormations();
    this.loading = true
  }

  getFormations(): void {
    this.errorMessage = '';

    this.formationService.getFormations(
      this.page,
      this.limit,
      this.searchTerm,
      this.selectedMode
    ).subscribe({
      next: (response: any) => {
        console.log(response)
        this.formations = response.data.formations;
        this.filteredFormations = response.data.formations;

        this.totalPages = response.data.totalPages;
        this.totalItems = response.data.totalItems;

        this.loading = false; 
      },

      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'Erreur lors de la récupération des formations';
      }
    });
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
      width: '500',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getFormations();
      }
    });
  }

  editFormation(formation: any): void {
    const dialogRef = this.dialog.open(EditFormationDialogComponent, {
      width: '520px',
      disableClose: true,
      data: formation
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getFormations();
      }
    });
  }

  deleteFormation(id: string): void {

  Swal.fire({
    title: 'Delete formation ?',
    text: 'This action cannot be undone',
    icon: 'warning',
    width: 550,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {

    if (result.isConfirmed) {

      this.formationService.deleteFormation(id).subscribe({

        next: () => {

            Swal.fire(
              'Deleted!',
              'Formation deleted successfully',
              'success'
            );
            this.getFormations();
          },

          error: (error) => {

            Swal.fire(
              'Error',
              error.error?.message ||
              'Failed to delete formation',
              'error'
            );
          }
        });
      }
    });
  }

};
