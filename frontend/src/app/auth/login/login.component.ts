import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    private router: Router
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

      this.snackBar.open(
        'Please enter valid email and password',
        'Close',
        { duration: 3000 }
      );

      return;
    }

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({

      next: (response: any) => {

        if (response.role === 'Admin') {

          this.router.navigate([
            '/admin-interface/cycle-formation'
          ]);

        } else {

          this.router.navigate([
            '/participant-interface/formations-presensiel'
          ]);
        }

      },

      error: (err) => {

        if (
          err.status === 400 ||
          err.status === 401
        ) {

          this.snackBar.open(
            err.error?.message,
            'Close',
            { duration: 4000 }
          );

        }

        else if (err.status === 500) {

          this.snackBar.open(
            err.error?.message ||
            'Something went wrong. Please try again later.',
            'Close',
            { duration: 4000 }
          );

        }

        else {

          this.snackBar.open(
            'Something went wrong',
            'Close',
            { duration: 4000 }
          );

        }

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