import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormationService } from '../core/services/formation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';


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
    private dialogRef: MatDialogRef<AddFormationDialogComponent>,
    private translate: TranslateService
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
        (this.numSalle !== null && this.numSalle > 0)
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
      () => {
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('ADD_FORMATION_DIALOG.SUCCESS_TITLE'),
          text: this.translate.instant('ADD_FORMATION_DIALOG.SUCCESS_TEXT'),
          width: 500,
          timer: 2500,
          timerProgressBar: true,
        }).then(() => {
          this.dialogRef.close(true);
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('ADD_FORMATION_DIALOG.ERROR_TITLE'),
          text: this.translate.instant(this.resolveErrorKey(error)),
          width: 500,
        });
      }
    );
  }

  closeDialog(){
    this.dialogRef.close();
  }

  private resolveErrorKey(error: any): string {
    const code = error?.error?.code;
    if (code) {
      const key = `BACKEND_ERRORS.${code}`;
      if (this.translate.instant(key) !== key) {
        return key;
      }
    }
    return 'ADD_FORMATION_DIALOG.ERROR_FALLBACK';
  }
}