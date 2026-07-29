import { Component, OnInit } from '@angular/core';
import { AdminService } from '../core/services/admin.service';
import { UserService } from '../core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

interface PasswordFormState {
  actualPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Component({
  selector: 'app-admin-profile-settings',
  templateUrl: './admin-profile-settings.component.html',
  styleUrls: ['./admin-profile-settings.component.css'],
})
export class AdminProfileSettingsComponent implements OnInit {
  admin: any = null;
  adminId!: string;

  loadingProfile = true;
  profileError = false;

  loginHistory: any[] = [];
  loadingHistory = true;

  lastLoginAt: string | null = null;

  form: PasswordFormState = {
    actualPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  showActualPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  submitting = false;
  errorMsgKey = '';
  successMsgKey = '';

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.adminId = this.userService.getUser()._id;
    this.loadAdmin();
  }

  private loadAdmin(): void {
    this.loadingProfile = true;
    this.profileError = false;

    this.adminService.getAdminById(this.adminId).subscribe({
      next: (data) => {
        this.admin = data;
        this.loadingProfile = false;
        this.loadLoginHistory();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du profil admin:', error);
        this.profileError = true;
        this.loadingProfile = false;
      },
    });
  }

  private loadLoginHistory(): void {
    this.loadingHistory = true;
    this.adminService.getLoginHistory(this.adminId).subscribe({
      next: (data) => {
        this.loginHistory = data.entries;
        this.lastLoginAt = data.entries[0]?.loginAt ?? null;
        this.loadingHistory = false;
      },
      error: (error) => {
        console.error("Erreur lors de la récupération de l'historique:", error);
        this.loadingHistory = false;
      },
    });
  }

  get initials(): string {
    if (!this.admin?.fullName) return '';
    return this.admin.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n: string) => n[0]?.toUpperCase())
      .join('');
  }

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
    this.errorMsgKey = '';
    this.successMsgKey = '';

    if (this.formInvalid) {
      this.errorMsgKey = 'ADMIN-PROFILE.ERRORS.FIX_FIELDS';
      return;
    }

    this.submitting = true;

    this.adminService
      .updatePassword(this.adminId, {
        actualPassword: this.form.actualPassword,
        newPassword: this.form.newPassword,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMsgKey = 'ADMIN-PROFILE.SUCCESS.PASSWORD_UPDATED';

          Swal.fire({
            icon: 'success',
            title: this.translate.instant('ADMIN-PROFILE.SUCCESS.TITLE'),
            text: this.translate.instant('ADMIN-PROFILE.SUCCESS.PASSWORD_UPDATED'),
            confirmButtonColor: '#4f46e5',
          });

          this.resetForm();
        },
        error: (error) => {
          this.submitting = false;
          console.error('Erreur lors de la mise à jour du mot de passe:', error);

          const backendMsg = error?.error?.message;
          this.errorMsgKey = backendMsg
            ? this.mapBackendError(backendMsg)
            : 'ADMIN-PROFILE.ERRORS.GENERIC';
        },
      });
  }

  private mapBackendError(message: string): string {
    if (message.toLowerCase().includes('incorrect')) {
      return 'ADMIN-PROFILE.ERRORS.WRONG_CURRENT_PASSWORD';
    }
    if (message.toLowerCase().includes('different')) {
      return 'ADMIN-PROFILE.ERRORS.SAME_PASSWORD';
    }
    if (message.toLowerCase().includes('6 characters')) {
      return 'ADMIN-PROFILE.ERRORS.TOO_SHORT';
    }
    return 'ADMIN-PROFILE.ERRORS.GENERIC';
  }

  dismissError(): void {
    this.errorMsgKey = '';
  }

  dismissSuccess(): void {
    this.successMsgKey = '';
  }

  private resetForm(): void {
    this.form = { actualPassword: '', newPassword: '', confirmNewPassword: '' };
    this.showActualPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  retryLoad(): void {
    this.loadAdmin();
  }
}