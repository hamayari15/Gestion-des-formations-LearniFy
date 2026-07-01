import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ParticipantService } from '../core/services/participant.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-participant-dialog',
  templateUrl: './edit-participant-dialog.component.html',
  styleUrls: ['./edit-participant-dialog.component.css'],
})
export class EditParticipantDialogComponent implements OnInit {

  participantForm!: FormGroup;
  participantId!: string;

  originalParticipant: any;

  constructor(
    private fb: FormBuilder,
    private participantService: ParticipantService,
    private dialogRef: MatDialogRef<EditParticipantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

    const participant = this.data;

    this.participantId = participant._id;

    // init form
    this.participantForm = this.fb.group({
      fullName: [
        participant.fullName,
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      email: [
        participant.email,
        [Validators.required, Validators.email]
      ],
      age: [
        participant.age,
        [Validators.required, Validators.min(16), Validators.max(100)]
      ]
    });

    // keep original for change detection
    this.originalParticipant = JSON.parse(JSON.stringify(this.participantForm.value));
  }

  hasChanges(): boolean {
    return JSON.stringify(this.participantForm.value) !== JSON.stringify(this.originalParticipant);
  }

  isFormValid(): boolean {
    return this.participantForm.valid;
  }

  onSubmit(): void {

    if (!this.participantForm.valid) return;

    this.participantService
      .updateParticipant(this.participantId, this.participantForm.value)
      .subscribe(

        (response: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: response.message,
            timer: 3000,
            timerProgressBar: true
          });

          this.dialogRef.close(true);
        },

        (error) => {

          if (error.status === 409) {
            this.participantForm.get('email')?.setErrors({ emailTaken: true });
            return;
          }

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