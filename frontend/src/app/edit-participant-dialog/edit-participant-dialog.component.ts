import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<EditParticipantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.participantId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadParticipantData();
  }

  initForm(): void {
    this.participantForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]],
    });
  }

  loadParticipantData(): void {
    this.participantService.getParticipantById(this.participantId).subscribe({
      next: (participant) => {
        this.participantForm.patchValue(participant); 
      },
      error: (err) => {
        console.error(
          'Erreur lors du chargement des données du participant:',
          err
        );
      },
    });
  }

  onSubmit(): void {
    if (this.participantForm.valid) {
      this.participantService
        .updateParticipant(this.participantId, this.participantForm.value)
        .subscribe({
          next: () => {
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du participant:', err);
            alert('Erreur lors de la mise à jour.');
          },
        });
    }
  }

   closeDialog() {
    this.dialogRef.close();
  }

};
