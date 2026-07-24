import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ParticipantService } from '../core/services/participant.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

    const participant = this.data;

    this.participantId = participant._id;

    this.participantForm = this.fb.group({
      fullName: [
        participant.fullName,
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
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

    this.participantService.updateParticipant(this.participantId, this.participantForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('EDIT_PARTICIPANT_DIALOG.SUCCESS_TITLE'),
          text: this.translate.instant('EDIT_PARTICIPANT_DIALOG.SUCCESS_TEXT'),
          width: 500,
          timer: 2500,
          timerProgressBar: true,
        }).then(() => {
          this.dialogRef.close(true);
        });
      },
      error: (error) => {
        if (error.status === 409) {
          this.participantForm.get('email')?.setErrors({ emailTaken: true });
          return;
        }

        Swal.fire({
          icon: 'error',
          title: this.translate.instant('EDIT_PARTICIPANT_DIALOG.ERROR_TITLE'),
          text: this.translate.instant(this.resolveErrorKey(error)),
          width: 500,
        });
      },
    });
  }

  closeDialog() {
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
    return 'EDIT_PARTICIPANT_DIALOG.ERROR_FALLBACK';
  }

}