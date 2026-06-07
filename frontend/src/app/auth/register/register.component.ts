import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  fullName: string = '';
  Email: string = '';
  Password: string = '';
  confirmPassword: string = '';
  Profile: string = 'User';
  Age: number | null = null;
  Gender: string = 'Male';
  Error: string | null = null;
  Success: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  clearError() {
    this.Error = null;
    this.Success = null;
  }

  onProfileChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.Profile = target.value;
    if (this.Profile !== 'User') {
      this.Age = null;
      this.Gender = 'Male';
    }
  }

  onSubmit(registrationForm: NgForm) {
    this.Error = null;
    this.Success = null;

    if (!registrationForm.valid) {
      this.Error = 'All fields are required';
      return;
    }

    if (this.Password !== this.confirmPassword) {
      this.Error = 'Passwords do not match';
      return;
    }

    const registerData: any = {
      fullName: this.fullName,
      Email: this.Email,
      Password: this.Password,
      Profile: this.Profile,
    };

    if (this.Profile === 'User') {
      if (this.Age === null || this.Gender === '') {
        this.Error = 'Please provide age and gender';
        return;
      }
      registerData.Age = this.Age;
      registerData.Gender = this.Gender;
    }

    this.authService.register(registerData).subscribe({
      next: () => {
        this.Success = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.Error =
        'An error occurred during registration. Please try again later.';
        console.error('Registration error:', err);
        console.log(registerData)
      },
    });
  }
}
