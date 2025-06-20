import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      username: [''],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['']
    });
    console.log('AuthComponent constructed');
  }

  ngOnInit() {
    this.setLoginValidators();
    console.log('AuthComponent initialized');
  }

  setLoginValidators() {
    this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.authForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.authForm.get('firstName')?.clearValidators();
    this.authForm.get('lastName')?.clearValidators();
    this.authForm.get('mobile')?.clearValidators();
    this.authForm.get('username')?.clearValidators();
    this.authForm.updateValueAndValidity();
  }

  setRegisterValidators() {
    this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.authForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.authForm.get('firstName')?.setValidators([Validators.required]);
    this.authForm.get('lastName')?.setValidators([Validators.required]);
    this.authForm.get('mobile')?.setValidators([Validators.required]);
    // username is optional
    this.authForm.updateValueAndValidity();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
    this.errorMessage = '';
    if (this.isLoginMode) {
      this.setLoginValidators();
    } else {
      this.setRegisterValidators();
    }
  }

  onSubmit() {
    console.log('Login/Register form submitted', this.authForm.value, this.authForm.valid, this.isLoginMode);
    if (this.authForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const formData = this.authForm.value;
    this.isLoading = true;
    this.errorMessage = '';

    if (this.isLoginMode) {
      this.http.post('http://localhost:5000/api/auth/login', {
        email: formData.email?.trim(),
        password: formData.password
      }).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: (res: any) => {
          console.log('Login response:', res);
          localStorage.setItem('token', res.token || res.accessToken);
          if (res.firstName) {
            localStorage.setItem('username', res.firstName);
          }
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          console.error('Login error:', err);
        }
      });
      return;
    }
    // Register API
    // Extra validation for required fields
    if (!formData.username || !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.mobile) {
      this.errorMessage = 'All fields are required.';
      this.isLoading = false;
      return;
    }
    const registerPayload = {
      username: formData.username?.trim(),
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      email: formData.email?.trim(),
      password: formData.password,
      mobile: formData.mobile?.trim()
    };
    console.log('Register payload:', registerPayload);
    this.http.post('http://localhost:5000/api/auth/register', registerPayload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          console.log('Register response:', res);
          // Auto-login after registration
          this.http.post('http://localhost:5000/api/auth/login', {
            email: registerPayload.email,
            password: registerPayload.password,
          }).pipe(finalize(() => this.isLoading = false)).subscribe({
            next: (loginRes: any) => {
              console.log('Auto-login response:', loginRes);
              localStorage.setItem('token', loginRes.token || loginRes.accessToken);
              if (loginRes.username || loginRes.firstName) {
                localStorage.setItem('username', loginRes.username || loginRes.firstName);
              }
              this.router.navigate(['/dashboard']);
            },
            error: err => {
              console.error('Auto-login error:', err);
              this.errorMessage = 'Registration succeeded, but auto-login failed. Please login manually.';
              this.toggleMode();
            }
          });
        },
        error: err => {
          console.error('Registration error:', err);
          this.errorMessage = 'Registration failed. Email or username might already be in use.';
        }
      });
  }

  onForgotPassword() {
    const email = this.authForm.get('email')?.value;
    if (email) {
      this.isLoading = true;
      this.http.post('http://localhost:5000/api/auth/forgot-password', { email })
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            alert('Password recovery link sent to your email.');
          },
          error: () => {
            alert('Failed to send password recovery email.');
          }
        });
    } else {
      alert('Please enter your email to reset password.');
    }
  }
} 