import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  personalForm!: FormGroup;
  securityForm!: FormGroup;
  profileForm!: FormGroup;

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  imageError: string | null = null;

  emailChecking = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\S+@\S+\.\S+$/)
        ],
      ],
    });

    this.securityForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
          ],
        ],

        confirmPassword: [
          '',
          Validators.required,
        ],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

     this.profileForm = this.fb.group({
      age: [
        '',
        [
          Validators.required,
          Validators.min(16),
          Validators.max(100),
        ],
      ],
      gender: [
        'Male',
        Validators.required,
      ],
    });
  }

  checkEmailAndNext(stepper: any) {

  const email = this.personalForm.value.email;

  if (this.personalForm.invalid) return;

  this.emailChecking = true;

  this.authService.checkEmail(email).subscribe({

    next: (res) => {

      this.emailChecking = false;

      if (res.exists) {

        this.personalForm.get('email')?.setErrors({
          emailExists: true
        });

        return;
      }

      stepper.next();

    },

    error: () => {

      this.emailChecking = false;

      this.snackBar.open(
        'Server error while checking email',
        'Close',
        { duration: 3000 }
      );

    }

    });
  }

  passwordMatchValidator(control: AbstractControl) {

  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {

    confirmPassword.setErrors({
      ...confirmPassword.errors,
      passwordMismatch: true
    });

  } else {

    if (confirmPassword.hasError('passwordMismatch')) {

      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];

      confirmPassword.setErrors(
        Object.keys(errors).length ? errors : null
      );
    }
  }

  return null;
}

  onFileSelected(event: Event): void {
    this.imageError = null;

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.imageError =
        'Only JPG, PNG and WEBP files are allowed';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageError =
        'Maximum image size is 5 MB';
      return;
    }

    this.selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview =
        reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  register(): void {

  const formData = new FormData();

  formData.append(
    'fullName',
    this.personalForm.value.fullName
  );

  formData.append(
    'email',
    this.personalForm.value.email
  );

  formData.append(
    'password',
    this.securityForm.value.password
  );

  formData.append(
    'age',
    this.profileForm.value.age
  );

  formData.append(
    'gender',
    this.profileForm.value.gender
  );

  if (this.selectedImage) {
    formData.append(
      'image',
      this.selectedImage
    );
  }

  this.authService.register(formData).subscribe({
    next: (res) => {
       this.snackBar.open(
        res.message,
        'Close',
        { duration: 3000 }
      );
      this.router.navigate(['/login']);
    },

    error: (err) => {
      if (err.status === 409) {

        this.snackBar.open(
          err.error?.message,
          'Close',
          { duration: 4000 }
        );

      } else if (err.status === 500) {

        this.snackBar.open(
          err.error?.message || 'Something went wrong, Please try again later.',
          'Close',
          { duration: 4000 }
        );

      } else {

        this.snackBar.open(
          'Something went wrong',
          'Close',
          { duration: 4000 }
        );
    }}
  });
  }

  get p() {
    return this.personalForm.controls;
  }

  get s() {
    return this.securityForm.controls;
  }

  get pr() {
    return this.profileForm.controls;
  }

};