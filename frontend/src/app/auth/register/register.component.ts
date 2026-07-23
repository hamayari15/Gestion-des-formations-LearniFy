import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
    private router: Router,
    private translate: TranslateService
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
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
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

    error: (error) => {

      this.emailChecking = false;

      this.snackBar.open(
        this.translate.instant(this.resolveErrorKey(error, 'REGISTER.ERRORS.EMAIL_CHECK_SERVER_FALLBACK')),
        this.translate.instant('REGISTER.CLOSE'),
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
      this.imageError = this.translate.instant('REGISTER.ERRORS.IMAGE_TYPE');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageError = this.translate.instant('REGISTER.ERRORS.IMAGE_SIZE');
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

  formData.append(
    'language',
    this.translate.currentLang || 'fr'
  );

  if (this.selectedImage) {
    formData.append(
      'image',
      this.selectedImage
    );
  }

  this.authService.register(formData).subscribe({
    next: () => {
       this.snackBar.open(
        this.translate.instant('REGISTER.SUCCESS'),
        'Close',
        { duration: 3000 }
      );
      this.router.navigate(['/login']);
    },

    error: (error) => {

      let key: string;

      if (error.status === 500 || error.status === 0) {
        key = 'REGISTER.ERRORS.REGISTER_SERVER_FALLBACK';
      } else {
        key = 'REGISTER.ERRORS.REGISTER_GENERIC_FALLBACK';
      }

      this.snackBar.open(
        this.translate.instant(this.resolveErrorKey(error, key)),
        'Close',
        { duration: 4000 }
      );
    }
  });
  }

  private resolveErrorKey(error: any, fallbackKey: string): string {
    
    const code = error?.error?.code;
    if (code) {
      const key = `BACKEND_ERRORS.${code}`;
      if (this.translate.instant(key) !== key) {
        return key;
      }
    }

    return fallbackKey;
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