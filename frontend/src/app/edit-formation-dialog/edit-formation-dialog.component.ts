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

    this.formationService.updateFormation(this.id, formation)

      .subscribe(

      (response: any) => {

        Swal.fire({

          icon: 'success',

          title: 'Succès',
          width: 550,

          text: response.message,

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