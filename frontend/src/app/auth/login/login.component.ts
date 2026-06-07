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
  Error: string = '';
  isPasswordVisible: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.minLength(8), Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Profile: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.Error = 'Please enter your email, password, and profile type';
      return;
    }

    const loginData = { ...this.loginForm.value };

    this.authService.login(loginData).subscribe(
      (response) => {
        console.log(response);
        console.log(loginData);
        localStorage.setItem('Token', response.Token);
        if (loginData.Profile === 'Admin') {
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
        this.Error = 'Invalid email or password';
      }
    );
  }

  onInputChange() {
    this.Error = '';
  }

  get email() {
    return this.loginForm.get('Email');
  }

  get password() {
    return this.loginForm.get('Password');
  }

  get profile() {
    return this.loginForm.get('Profile');
  }
}
