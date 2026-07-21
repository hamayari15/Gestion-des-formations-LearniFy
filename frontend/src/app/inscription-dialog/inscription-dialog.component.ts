import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { InscriptionService } from '../core/services/incription.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inscription-dialog',
  templateUrl: './inscription-dialog.component.html',
  styleUrls: ['./inscription-dialog.component.css'],
})
export class InscriptionDialogComponent implements OnInit {
  formation: any;
  participant: any;

  theme = '';
  modeFormation = '';
  numSalle = '';

  fullName = '';
  email = '';
  entreprise = '';
  service = '';

  loading = false;

  constructor(
    private inscriptionService: InscriptionService,
    private dialogRef: MatDialogRef<InscriptionDialogComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.formation = this.data?.formation;
    this.participant = this.data?.participant;

    if (!this.formation?._id || !this.participant?._id) {
      console.error('Missing formation or participant data');

      this.dialogRef.close();

      return;
    }

    this.theme = this.formation.theme;
    this.modeFormation = this.formation.modeFormation;
    this.numSalle = this.formation.numSalle;

    this.fullName = this.participant.fullName || '';
    this.email = this.participant.email || '';
    this.entreprise = this.participant.entreprise || '';
    this.service = this.participant.service || '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    const emailPattern = /^\S+@\S+\.\S+$/;

    return (
      this.fullName.trim().length >= 2 &&
      emailPattern.test(this.email.trim()) &&
      this.entreprise.trim() !== '' &&
      this.service.trim() !== ''
    );
  }

  addInscription(): void {
    if (!this.isFormValid() || this.loading) {
      return;
    }

    this.loading = true;

    const body = {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      entreprise: this.entreprise.trim(),
      service: this.service.trim(),
    };

    this.inscriptionService
      .addInscription(body, this.participant._id, this.formation._id)
      .subscribe({
        next: (response) => {
          this.loading = false;

          Swal.fire({
            icon: 'success',

            title: this.translate.instant('INSCRIPTION_DIALOG.SUCCESS_TITLE'),

            text: this.translate.instant(this.resolveSuccessKey(response)),

            width: 500,

            timer: 2500,

            timerProgressBar: true,
          }).then(() => {
            this.dialogRef.close(true);
          });
        },

        error: (error) => {
          this.loading = false;

          Swal.fire({
            icon: 'error',

            title: this.translate.instant('INSCRIPTION_DIALOG.ERROR_TITLE'),

            text: this.translate.instant(this.resolveErrorKey(error)),

            width: 500,
          });
        },
      });
  }

  private resolveSuccessKey(response: any): string {
    const code = response?.code;

    if (code === 'INSCRIPTION_CREATED') {
      return 'INSCRIPTION_DIALOG.SUCCESS_TEXT';
    }

    return 'INSCRIPTION_DIALOG.SUCCESS_TEXT';
  }

  private resolveErrorKey(error: any): string {
    const code = error?.error?.code;

    switch (code) {
      case 'ALREADY_REGISTERED':
        return 'INSCRIPTION_DIALOG.ALREADY_REGISTERED';

      default:
        return 'INSCRIPTION_DIALOG.ERROR_FALLBACK';
    }
  }
}
