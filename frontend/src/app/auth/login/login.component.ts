import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  loginForm: FormGroup;
  Error: string = '';
  isPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.Error = 'Please enter valid email and password';
      return;
    }

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response: any) => {

        localStorage.setItem('Token', response.token);
        localStorage.setItem('Role', response.role);

        if (response.role === 'Admin') {
          console.log('go admin');
          this.router.navigate(['/admin-interface/cycle-formation']);
        } else {
          this.router.navigate(['/participant-interface/formations-presensiel']);
          console.log('go user');
          console.log(response)
        }
      },

      error: () => {
        this.Error = 'Invalid email or password';
      }
    });
  }

  onInputChange() {
    this.Error = '';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}