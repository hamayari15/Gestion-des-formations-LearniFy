import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  loginForm: FormGroup;
  isPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({

      next: (response: any) => {

        if (response.role === 'Admin') {

          this.router.navigate([
            '/admin-interface/admin-dashboard'
          ]);

        } else {

          this.router.navigate([
            '/participant-interface/formations-disponibles'
          ]);
        }
      },

      error: (err) => {

        let key: string;

        if (err.status === 400 || err.status === 401) {
          key = 'LOGIN.ERRORS.INVALID_CREDENTIALS';
        } else if (err.status === 500 || err.status === 0) {
          key = 'LOGIN.ERRORS.LOGIN_SERVER_FALLBACK';
        } else {
          key = 'LOGIN.ERRORS.LOGIN_GENERIC_FALLBACK';
        }

        this.snackBar.open(
          this.translate.instant(key),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 4000 }
        );
      }
    });
    
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

};