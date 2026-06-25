import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormationService } from '../core/services/formation.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-formation-dialog',
  templateUrl: './edit-formation-dialog.component.html',
  styleUrls: ['./edit-formation-dialog.component.css']
})

export class EditFormationDialogComponent implements OnInit {

  originalFormation: any;

  id!: string;

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

    private dialogRef: MatDialogRef<EditFormationDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any

  ) {}

 ngOnInit(): void {

  const formation = this.data;

  this.originalFormation = JSON.parse(JSON.stringify(formation));

  this.id = formation._id;

  this.theme = formation.theme;
  this.modeFormation = formation.modeFormation;
  this.numSalle = formation.numSalle;

  this.creditImpot = formation.creditImpot;
  this.droitIndividuel = formation.droitIndividuel;
  this.droitCollectif = formation.droitCollectif;

  this.periodeDu = formation.periodeDu;
  this.periodeA = formation.periodeA;

  this.horaireDu = formation.horaireDu;
  this.horaireA = formation.horaireA;
}

  hasChanges(): boolean {

  return (
    this.theme !== this.originalFormation.theme ||
    this.modeFormation !== this.originalFormation.modeFormation ||
    this.numSalle !== this.originalFormation.numSalle ||
    this.creditImpot !== this.originalFormation.creditImpot ||
    this.droitIndividuel !== this.originalFormation.droitIndividuel ||
    this.droitCollectif !== this.originalFormation.droitCollectif ||
    this.periodeDu !== this.originalFormation.periodeDu ||
    this.periodeA !== this.originalFormation.periodeA ||
    this.horaireDu !== this.originalFormation.horaireDu ||
    this.horaireA !== this.originalFormation.horaireA
  );

}

  isFormValid(): boolean {

    return (

      this.theme.trim() !== '' &&

      this.modeFormation !== '' &&

      (
        this.creditImpot ||

        this.droitIndividuel ||

        this.droitCollectif
      ) &&

      this.periodeDu !== '' &&

      this.periodeA !== '' &&

      this.horaireDu !== '' &&

      this.horaireA !== '' &&

     (
        this.modeFormation !== 'Présentiel'
        ||
        (this.numSalle !== null && this.numSalle > 0)
      )

    );

  }

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

  updateFormation() {

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

    console.log('ID:', this.id);
    console.log('Formation:', formation);

    this.formationService.updateFormation(this.id, formation)

      .subscribe(

      (response: any) => {

        Swal.fire({

          icon: 'success',
          title: 'Succès',
          text: response.message,
          width: 550,
          timer: 3000,
          timerProgressBar: true
        });

        this.dialogRef.close(true);
        this.router.navigate(['admin-interface/cycle-formations']);
      },

      (error) => {

        Swal.fire({

          icon: 'error',

          title: 'Erreur',

          text: error?.error?.message || 'Une erreur est survenue.'

        });

      }

    );

  }

  closeDialog() {

    this.dialogRef.close();

  }

}