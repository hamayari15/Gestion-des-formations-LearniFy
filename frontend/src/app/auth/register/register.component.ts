import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
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

  constructor(
    private fb: FormBuilder,
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

      Email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
    });

    this.securityForm = this.fb.group(
      {
        Password: [
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
      Age: [
        '',
        [
          Validators.required,
          Validators.min(16),
          Validators.max(100),
        ],
      ],
      Gender: [
        'Male',
        Validators.required,
      ],
    });
  }

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('Password')?.value;
    const confirmPassword =
      control.get('confirmPassword')?.value;

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
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
    'Email',
    this.personalForm.value.Email
  );

  formData.append(
    'Password',
    this.securityForm.value.Password
  );

  formData.append(
    'Age',
    this.profileForm.value.Age
  );

  formData.append(
    'Gender',
    this.profileForm.value.Gender
  );

  formData.append(
    'Profile',
    'User'
  );

  if (this.selectedImage) {
    formData.append(
      'Image',
      this.selectedImage
    );
  }

  this.authService.register(formData).subscribe({
    next: () => {
      alert('Registration successful');

      this.router.navigate(['/login']);
    },

    error: (err) => {
      console.error(err);
    }
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