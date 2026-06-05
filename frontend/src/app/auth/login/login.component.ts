import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  isPasswordVisible: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(8), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      profile: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.error = 'Please enter your email, password, and profile type';
      return;
    }

    const loginData = { ...this.loginForm.value };

    this.authService.login(loginData).subscribe(
      (response) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        if (loginData.profile === 'admin') {
          localStorage.setItem('AdminLoggedIn', 'true');
          this.router.navigate(['/admin-interface/cycle-formation'], {
            state: { AdminLoggedIn: true },
          });
        } else {
          localStorage.setItem('UserLoggedIn', 'true');
          this.router.navigate(['/participant-interface/formations-presensiel'], {
            state: { UserLoggedIn: true },
          });
        }
      },
      (error) => {
        console.error('An error occurred during connection', error);
        this.error = 'Invalid email or password';
      }
    );
  }

  onInputChange() {
    this.error = '';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get profile() {
    return this.loginForm.get('profile');
  }
}
