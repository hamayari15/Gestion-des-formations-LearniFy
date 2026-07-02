import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';
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
  errorMessage = '';

  constructor(
    private formationService: FormationService,
    private inscriptionService: InscriptionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getFormations();
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

    this.inscriptionService.setformation(formation);

    const dialogRef = this.dialog.open(InscriptionDialogComponent, {
      width: '550px',
      disableClose: true,
      data: formation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getFormations();
      }
    });

  }

}