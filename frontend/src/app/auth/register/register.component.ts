import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  fullname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profile: string = 'user';
  age: number | null = null;
  gender: string = 'male';
  error: string | null = null;
  success: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  clearError() {
    this.error = null;
    this.success = null;
  }

  onProfileChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.profile = target.value;
    if (this.profile !== 'user') {
      this.age = null;
      this.gender = 'male';
    }
  }

  onSubmit(registrationForm: NgForm) {
    this.error = null;
    this.success = null;

    if (!registrationForm.valid) {
      this.error = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const registerData: any = {
      fullname: this.fullname,
      email: this.email,
      password: this.password,
      profile: this.profile,
    };

    if (this.profile === 'user') {
      if (this.age === null || this.gender === '') {
        this.error = 'Please provide age and gender';
        return;
      }
      registerData.age = this.age;
      registerData.gender = this.gender;
    }

    this.authService.register(registerData).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error =
          'An error occurred during registration. Please try again later.';
        console.error('Registration error:', err);
      },
    });
  }
}
