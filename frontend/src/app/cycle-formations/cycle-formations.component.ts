import { Component, OnInit } from '@angular/core';
import { FormationService } from '../core/services/formation.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

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
  errorMessage: string = '';

  constructor(
    private formationService: FormationService,
    private router: Router,
    private dialog: MatDialog
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

  navigateToAddFormation(): void {

    this.dialog.open(

      AddFormationDialogComponent,

      {

        width: '500px',

        disableClose: true

      }

    );

    }

  editFormation(formation: any): void {

    this.dialog.open(

      EditFormationDialogComponent,

      {

        width: '500px',

        disableClose: true,

        data: formation

      }

    );

  }

}
