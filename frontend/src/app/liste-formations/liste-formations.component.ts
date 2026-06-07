import { Component, OnInit } from '@angular/core';
import { FormationService } from '../core/services/formation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-formations',
  templateUrl: './liste-formations.component.html',
  styleUrls: ['./liste-formations.component.css'],
})
export class ListeFormationsComponent implements OnInit {
  formations: any[] = [];
  errorMessage: string = '';

  constructor(
    private formationService: FormationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFormations();
  }

  getFormations(): void {
    this.formationService.getFormations().subscribe(
      (data) => {
        this.formations = data;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des formations';
        console.error('Erreur:', error);
      }
    );
  }

  deleteFormation(id: string): void {
    const confirmDelete = confirm(
      'Êtes-vous sûr de vouloir supprimer cette formation ?'
    );
    if (confirmDelete) {
      this.formationService.deleteFormation(id).subscribe(
        () => {
          this.formations = this.formations.filter((f) => f._id !== id);
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la suppression de la formation';
          console.error('Erreur:', error);
        }
      );
    }
  }

  editFormation(id: string): void {
    this.router.navigate(['admin-interface/modifier-formation', id]);
  }

  navigateToAddFormation(): void {
    this.router.navigate(['admin-interface/add-formation']);
  }
}
