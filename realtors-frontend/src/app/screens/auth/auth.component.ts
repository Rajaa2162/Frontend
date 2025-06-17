import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AuthComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';

  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';
  passwordVisible: boolean = false;
  referralCodePreFilled: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for 'ref' query parameter to pre-fill referral code
    this.route.queryParams.subscribe(params => {
      const refCode = params['ref'];
      if (refCode) {
        this.registerForm.referralCode = refCode;
        this.referralCodePreFilled = true;
        this.setActiveTab('register');
      }
    });
  }

  setActiveTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.isLoading = false;
    // If switching back to register, re-check if code was pre-filled
    if (tab === 'register' && this.registerForm.referralCode && this.route.snapshot.queryParams['ref'] === this.registerForm.referralCode) {
      this.referralCodePreFilled = true;
    } else {
      this.referralCodePreFilled = false;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;
    if (this.activeTab === 'login') {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Please enter both email and password.';
      this.isLoading = false;
      return;
    }
    setTimeout(() => {
      if (this.loginForm.email === 'test@example.com' && this.loginForm.password === 'password123') {
        this.errorMessage = '';
        alert('Login successful! Redirecting to dashboard...');
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
      this.isLoading = false;
    }, 1500);
  }

  private handleRegister(): void {
    if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.password || !this.registerForm.confirmPassword) {
      this.errorMessage = 'All fields are required for registration.';
      this.isLoading = false;
      return;
    }
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.isLoading = false;
      return;
    }
    if (this.registerForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      this.isLoading = false;
      return;
    }

    const registrationData = {
      username: this.registerForm.username,
      email: this.registerForm.email,
      password: this.registerForm.password,
      referralCode: this.registerForm.referralCode || null
    };

    setTimeout(() => {
      console.log('Attempting registration with:', registrationData);
      this.errorMessage = '';
      alert('Registration successful! You can now log in.');
      this.setActiveTab('login');
      this.isLoading = false;
    }, 1500);
  }
} 