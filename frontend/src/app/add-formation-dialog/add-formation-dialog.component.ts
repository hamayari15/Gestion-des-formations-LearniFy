import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormationService } from '../core/services/formation.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-formation-dialog',
  templateUrl: './add-formation-dialog.component.html',
  styleUrls: ['./add-formation-dialog.component.css'],
})

export class AddFormationDialogComponent {
  theme: string = '';
  modeFormation: string = '';
  numSalle: number | null = null;
  creditImpot: boolean = false;
  droitIndividuel: boolean = false;
  droitCollectif: boolean = false;
  periodeDu: string = '';
  periodeA: string = '';
  horaireDu: string = '';
  horaireA: string = '';

  constructor(
    private formationService: FormationService,
    private router: Router,
    private dialogRef: MatDialogRef<AddFormationDialogComponent>
  ) {}

  selectMode(mode: string) {

    this.creditImpot = false;
    this.droitIndividuel = false;
    this.droitCollectif = false;

    switch (mode) {

      case 'creditImpot':
        this.creditImpot = true;
        break;

      case 'droitIndividuel':
        this.droitIndividuel = true;
        break;

      case 'droitCollectif':
        this.droitCollectif = true;
        break;
    }

  }

  isFormValid(): boolean {

    return (

      this.theme.trim() !== '' &&

      this.modeFormation !== '' &&

      (this.creditImpot ||
      this.droitIndividuel ||
      this.droitCollectif) &&

      this.periodeDu !== '' &&

      this.periodeA !== '' &&

      this.horaireDu !== '' &&

      this.horaireA !== '' 
      &&

      (
        this.modeFormation !== 'Présentiel'
        ||
        (!this.numSalle || this.numSalle > 0)
      )

    );

  }

  addFormation() {
    const formation = {
      theme: this.theme,
      modeFormation: this.modeFormation,
      numSalle: this.numSalle,
      creditImpot: this.creditImpot,
      droitIndividuel: this.droitIndividuel,
      droitCollectif: this.droitCollectif,
      periodeDu: this.periodeDu,
      periodeA: this.periodeA,
      horaireDu: this.horaireDu,
      horaireA: this.horaireA,
    };

    this.formationService.addFormation(formation).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message,
          width: 550,
          timer: 3000,
          timerProgressBar: true,
        });
        this.dialogRef.close();
        this.router.navigate(['admin-interface/cycle-formations']);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.error.message || 'Une erreur est survenue.',
        });
        console.error('Error:', error);
      }
    );
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
