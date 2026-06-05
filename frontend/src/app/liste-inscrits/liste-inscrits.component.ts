import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InscriptionService } from '../services/incription.service';

@Component({
  selector: 'app-liste-inscrits',
  templateUrl: './liste-inscrits.component.html',
  styleUrls: ['./liste-inscrits.component.css'],
})
export class ListeInscritsComponent implements OnInit {
  inscriptions: any[] = [];
  filteredInscriptions: any[] = [];
  searchTheme: string = '';
  searchNumSalle: string = '';

  constructor(
    private inscriptionService: InscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInscriptions();
  }

  getInscriptions() {
    this.inscriptionService.getInscriptions().subscribe(
      (data) => {
        this.inscriptions = data;
        this.filteredInscriptions = data;
        console.log('Inscriptions récupérées avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des inscriptions', error);
      }
    );
  }

  updateStatus(inscription: any, status: string): void {
    this.inscriptionService
      .updateInscriptionStatus(inscription._id, status)
      .subscribe(
        (response) => {
          console.log('Statut mis à jour:', response);
          this.getInscriptions();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du statut', error);
        }
      );
  }

  search() {
    this.filteredInscriptions = this.inscriptions.filter((inscription) => {
      const matchesTheme =
        !this.searchTheme ||
        inscription.theme
          .toLowerCase()
          .includes(this.searchTheme.toLowerCase());
      const matchesNumSalle =
        !this.searchNumSalle ||
        inscription.numSalle.toString().includes(this.searchNumSalle);
      return matchesTheme && matchesNumSalle;
    });
  }

  searchByTheme() {
    this.filteredInscriptions = this.inscriptions.filter((inscription) =>
      inscription.theme.toLowerCase().includes(this.searchTheme.toLowerCase())
    );
  }

  resetSearch() {
    this.searchTheme = '';
    this.searchNumSalle = '';
    this.filteredInscriptions = this.inscriptions;
  }
}
