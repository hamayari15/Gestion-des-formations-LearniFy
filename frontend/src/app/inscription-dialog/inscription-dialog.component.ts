import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { InscriptionService } from '../core/services/incription.service';

@Component({
  selector: 'app-inscription-dialog',
  templateUrl: './inscription-dialog.component.html',
  styleUrls: ['./inscription-dialog.component.css']
})
export class InscriptionDialogComponent implements OnInit {

  formation: any;
  participant: any;

  theme: string = '';
  modeFormation: string = '';
  numSalle: string = '';

  fullname: string = '';
  email: string = '';
  entreprise: string = '';
  service: string = '';

  loading = false;

  constructor(
    private inscriptionService: InscriptionService,
    private dialogRef: MatDialogRef<InscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

    this.formation = this.data.formation;
    this.participant = this.data.participant;

    this.theme = this.formation.theme;
    this.modeFormation = this.formation.modeFormation;
    this.numSalle = this.formation.numSalle;

    if (this.participant) {
      this.fullname = this.participant.fullname || '';
      this.email = this.participant.email || '';
      this.entreprise = this.participant.entreprise || '';
      this.service = this.participant.service || '';
    }

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {

    return (
      this.fullname.trim() !== '' &&
      this.email.trim() !== '' &&
      this.entreprise.trim() !== '' &&
      this.service.trim() !== ''
    );

  }

  addInscription(): void {

    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;

    const body = {
      theme: this.theme,
      numSalle: this.numSalle,
      fullname: this.fullname,
      email: this.email,
      entreprise: this.entreprise,
      service: this.service
    };

    this.inscriptionService.addInscription(
      body,
      this.participant._id,
      this.formation._id
    ).subscribe({

      next: () => {

        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Votre inscription a été enregistrée.',
          confirmButtonColor: '#4f46e5'
        });

        this.dialogRef.close(true);

      },

      error: (error) => {

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error?.message || 'Une erreur est survenue.',
          confirmButtonColor: '#dc2626'
        });

      }

    });

  }

}