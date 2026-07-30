import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ParticipantService } from '../core/services/participant.service';
import Swal from 'sweetalert2';

interface PasswordFormState {
  actualPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent {
  form: PasswordFormState = {
    actualPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  showActualPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  submitting = false;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private participantService: ParticipantService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { participantId: string }
  ) {}

  get passwordsMismatch(): boolean {
    return (
      this.form.confirmNewPassword.length > 0 &&
      this.form.newPassword !== this.form.confirmNewPassword
    );
  }

  get newPasswordTooShort(): boolean {
    return this.form.newPassword.length > 0 && this.form.newPassword.length < 6;
  }

  get samePassword(): boolean {
    return (
      this.form.newPassword.length > 0 &&
      this.form.newPassword === this.form.actualPassword
    );
  }

  get formInvalid(): boolean {
    return (
      !this.form.actualPassword ||
      !this.form.newPassword ||
      !this.form.confirmNewPassword ||
      this.passwordsMismatch ||
      this.newPasswordTooShort ||
      this.samePassword
    );
  }

  updatePassword(): void {

    if (this.formInvalid) {
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('CHANGE_PASSWORD_DIALOG.ERROR_TITLE'),
        text: this.translate.instant('CHANGE_PASSWORD_DIALOG.ERRORS.FIX_FIELDS'),
        width: 520,
      });
      return;
    }

    this.submitting = true;

    this.participantService
    .updatePassword(this.data.participantId, {
      actualPassword: this.form.actualPassword,
      newPassword: this.form.newPassword,
    })
    .subscribe({
      next: () => {

        this.submitting = false;
        this.resetForm();

        Swal.fire({
          icon: 'success',
          title: this.translate.instant('CHANGE_PASSWORD_DIALOG.SUCCESS_TITLE'),
          text: this.translate.instant('CHANGE_PASSWORD_DIALOG.SUCCESS_TEXT'),
          width: 520,
          timer: 2500,
          timerProgressBar: true,
        }).then(() => {
          this.closeDialog(true);
        });

      },
      error: (error) => {

        this.submitting = false;

        Swal.fire({
          icon: 'error',
          title: this.translate.instant('CHANGE_PASSWORD_DIALOG.ERROR_TITLE'),
          text: this.translate.instant(
            this.mapBackendError(error?.error?.message || '')
          ),
          width: 520,
        });

      },
    });
  }

  private mapBackendError(message: string): string {

  const msg = message.toLowerCase();

  if (msg.includes('incorrect')) {
    return 'CHANGE_PASSWORD_DIALOG.ERRORS.WRONG_CURRENT_PASSWORD';
  }

  if (msg.includes('different')) {
    return 'CHANGE_PASSWORD_DIALOG.ERRORS.SAME_PASSWORD';
  }

  if (msg.includes('6 characters')) {
    return 'CHANGE_PASSWORD_DIALOG.ERRORS.TOO_SHORT';
  }

  if (msg.includes('missing')) {
    return 'CHANGE_PASSWORD_DIALOG.ERRORS.FIX_FIELDS';
  }

  return 'CHANGE_PASSWORD_DIALOG.ERROR_FALLBACK';
}

  private resetForm(): void {
    this.form = { actualPassword: '', newPassword: '', confirmNewPassword: '' };
    this.showActualPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  closeDialog(success: boolean = false): void {
    this.dialogRef.close(success);
  }
}