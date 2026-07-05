import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { InscriptionService } from '../core/services/incription.service';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formation = this.data?.formation;
    this.participant = this.data?.participant;

    console.log('Formation:', this.formation);
    console.log('Part:', this.participant);

    // Garde-fou : si les données essentielles manquent, on ferme le dialog
    // plutôt que de laisser l'utilisateur soumettre un formulaire cassé.
    if (!this.formation?._id || !this.participant?._id) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Données de formation ou de participant manquantes.',
        confirmButtonColor: '#dc2626',
      });
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
          title: 'Succès',
          text: response.message,
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
          title: 'Erreur',
          text: error.error?.message || 'Une erreur est survenue.',
          width: 500,
        });
      },
    });
  }
}