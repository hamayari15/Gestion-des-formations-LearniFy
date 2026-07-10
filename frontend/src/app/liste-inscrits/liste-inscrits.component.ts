import { Component, OnInit } from '@angular/core';
import { InscriptionService } from '../core/services/incription.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-inscrits',
  templateUrl: './liste-inscrits.component.html',
  styleUrls: ['./liste-inscrits.component.css'],
})
export class ListeInscritsComponent implements OnInit {

  inscriptions: any[] = [];

  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  search: string = '';
  sort: string = 'desc';

  loading: boolean = false;
  errorMessage: string = '';
  hasAnyInscriptions: boolean = true;

  constructor(private inscriptionService: InscriptionService) {}

  ngOnInit(): void {
    this.getInscriptions();
  }

  getInscriptions(): void {

    this.errorMessage = '';
    this.loading = true

    this.inscriptionService.getInscriptions(
      this.page,
      this.limit,
      this.search,
      this.sort
    ).subscribe({

      next: (res: any) => {

        this.inscriptions = res.data.inscriptions;

        this.totalPages = res.data.totalPages;
        this.totalItems = res.data.totalItems;

        if (!this.search && !this.sort) {
          this.hasAnyInscriptions = this.totalItems > 0;
        }

        this.loading = false;
      },

      error: () => {

        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des inscriptions';

      }

    });

  }

  applyFilters(): void {
    this.page = 1;
    this.getInscriptions();
  }

  clearFilters(): void {
    this.search = '';
    this.page = 1;
    this.getInscriptions();
  }

  toggleSort(): void {
    this.sort = this.sort === 'desc' ? 'asc' : 'desc';
    this.getInscriptions();
    this.loading = false;
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getInscriptions();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getInscriptions();
    }
  }

  goToPage(p: number): void {
    this.page = p;
    this.getInscriptions();
  }

  updateStatus(inscription: any, status: string): void {

    this.inscriptionService.updateInscriptionStatus(
      inscription._id,
      status
    ).subscribe({

      next: () => {
        this.getInscriptions();
      },

      error: () => {
        Swal.fire('Error', 'Status update failed', 'error');
      }

    });

  }

}