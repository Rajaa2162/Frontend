import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

interface UserProfile {
  userId: string;
  username: string;
  email: string;
  phone?: string;
  country?: string;
  fullName: string;
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  twoFactorEnabled: boolean;
  profilePhoto?: string;
  kycStatus: {
    status: 'Pending' | 'Verified' | 'Rejected';
    documents: {
      aadhar: {
        front?: string;
        back?: string;
        status: 'Pending' | 'Verified' | 'Rejected';
      };
      pan: {
        document?: string;
        status: 'Pending' | 'Verified' | 'Rejected';
      };
      voterId?: {
        document?: string;
        status: 'Pending' | 'Verified' | 'Rejected';
      };
      addressProof?: {
        document?: string;
        status: 'Pending' | 'Verified' | 'Rejected';
      };
    };
  };
  wallet: {
    address: string;
    dailyReturns: number;
    totalEarned: number;
    withdrawable: number;
  };
  investments: {
    date: Date;
    plan: string;
    amount: number;
    dailyReturn: number;
    status: 'Active' | 'Completed' | 'Pending';
  }[];
  aiLogs: {
    timestamp: Date;
    query: string;
    status: 'Success' | 'Failed';
  }[];
  referral: {
    code: string;
    totalReferrals: number;
    earnings: number;
  };
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
  lastLogin: Date;
  accountActivity: {
    date: Date;
    action: string;
    device: string;
    location: string;
  }[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {
    userId: 'USR123456',
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    country: 'India',
    fullName: 'John Doe',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'Male',
    twoFactorEnabled: false,
    profilePhoto: undefined,
    kycStatus: {
      status: 'Pending',
      documents: {
        aadhar: {
          status: 'Pending'
        },
        pan: {
          status: 'Pending'
        }
      }
    },
    wallet: {
      address: '0xABC...1234',
      dailyReturns: 250,
      totalEarned: 25000,
      withdrawable: 5000
    },
    investments: [
      {
        date: new Date('2025-06-10'),
        plan: 'Crypto Growth',
        amount: 10000,
        dailyReturn: 250,
        status: 'Active'
      }
    ],
    aiLogs: [
      {
        timestamp: new Date(),
        query: 'What are my current returns?',
        status: 'Success'
      },
      {
        timestamp: new Date(Date.now() - 86400000),
        query: 'Withdraw ₹5000 to UPI',
        status: 'Success'
      },
      {
        timestamp: new Date(Date.now() - 172800000),
        query: 'Transfer failed – incorrect UPI ID',
        status: 'Failed'
      }
    ],
    referral: {
      code: 'REALTORS123',
      totalReferrals: 5,
      earnings: 1250
    },
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true
    },
    lastLogin: new Date(),
    accountActivity: [
      {
        date: new Date(),
        action: 'Profile Update',
        device: 'Chrome on Windows',
        location: 'Mumbai, India'
      }
    ]
  };

  editableProfile: UserProfile = { ...this.userProfile };
  editMode = {
    account: false,
    password: false,
    notifications: false,
    kyc: false
  };
  loadingStates = {
    profile: false,
    password: false,
    photo: false,
    notifications: false,
    kyc: false,
    withdrawal: false
  };
  toastMessage = {
    show: false,
    message: '',
    type: 'success'
  };
  passwordForm: FormGroup;
  showPassword = false;
  passwordStrength = 0;
  formErrors: { [key: string]: string } = {};
  kycForm: FormGroup;
  personalInfoForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.kycForm = this.fb.group({
      aadharFront: [null],
      aadharBack: [null],
      panCard: [null],
      voterId: [null],
      addressProof: [null]
    });

    this.personalInfoForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      username: ['', [Validators.required]],
      dateOfBirth: [''],
      gender: ['']
    });
  }

  ngOnInit(): void {
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(password => {
      this.calculatePasswordStrength(password);
      this.validatePassword(password);
    });

    this.passwordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });

    this.personalInfoForm.patchValue({
      fullName: this.userProfile.fullName,
      email: this.userProfile.email,
      phone: this.userProfile.phone,
      username: this.userProfile.username,
      dateOfBirth: this.userProfile.dateOfBirth ? this.toDateInputValue(this.userProfile.dateOfBirth) : '',
      gender: this.userProfile.gender
    });
    // Disable personal info form by default
    this.personalInfoForm.disable();
    // Disable KYC form by default
    this.kycForm.disable();
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = {
      show: true,
      message,
      type
    };
    setTimeout(() => {
      this.toastMessage.show = false;
    }, 3000);
  }

  private validatePassword(password: string): void {
    const errors: string[] = [];
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[@$!%*?&]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)');
      }
    }
    this.formErrors['newPassword'] = errors.join(', ');
  }

  private validatePasswordMatch(): void {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      this.formErrors['confirmPassword'] = 'Passwords do not match';
    } else {
      this.formErrors['confirmPassword'] = '';
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    this.passwordStrength = Math.min(strength, 100);
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength <= 25) return 'bg-red-500';
    if (this.passwordStrength <= 50) return 'bg-orange-500';
    if (this.passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getPasswordStrengthText(): string {
    if (this.passwordStrength <= 25) return 'Very Weak';
    if (this.passwordStrength <= 50) return 'Weak';
    if (this.passwordStrength <= 75) return 'Moderate';
    return 'Strong';
  }

  toggleEditMode(section: 'account' | 'password' | 'notifications' | 'kyc'): void {
    this.editMode[section] = !this.editMode[section];
    if (section === 'account') {
      if (this.editMode.account) {
        // Enable personal info controls
        this.personalInfoForm.enable();
      } else {
        // Disable personal info controls
        this.personalInfoForm.disable();
        this.editableProfile = { ...this.userProfile };
      }
    } else if (section === 'kyc') {
      if (this.editMode.kyc) {
        this.kycForm.enable();
      } else {
        this.kycForm.disable();
      }
    } else if (!this.editMode[section]) {
      if (section === 'password') {
        this.passwordForm.reset();
        this.formErrors = {};
      }
    }
  }

  async saveProfile(): Promise<void> {
    try {
      this.loadingStates.profile = true;
      // Call backend API to update profile
      const updated = await this.userService.updateProfile(this.personalInfoForm.value).toPromise();
      this.userProfile = { ...this.userProfile, ...updated };
      // Patch the form with the new values from backend
      this.personalInfoForm.patchValue({
        fullName: this.userProfile.fullName,
        email: this.userProfile.email,
        phone: this.userProfile.phone,
        username: this.userProfile.username,
        dateOfBirth: this.userProfile.dateOfBirth ? this.toDateInputValue(this.userProfile.dateOfBirth) : '',
        gender: this.userProfile.gender
      });
      this.editMode.account = false;
      this.showToast('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      this.showToast('Failed to update profile', 'error');
    } finally {
      this.loadingStates.profile = false;
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.showToast('Please fix the form errors', 'error');
      return;
    }

    try {
      this.loadingStates.password = true;
      // TODO: Implement password change API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.passwordForm.reset();
      this.editMode.password = false;
      this.formErrors = {};
      this.showToast('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      this.showToast('Failed to change password', 'error');
    } finally {
      this.loadingStates.password = false;
    }
  }

  async toggle2FA(): Promise<void> {
    try {
      this.loadingStates.profile = true;
      // TODO: Implement 2FA toggle logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.userProfile.twoFactorEnabled = !this.userProfile.twoFactorEnabled;
      this.showToast(
        this.userProfile.twoFactorEnabled 
          ? 'Two-factor authentication enabled' 
          : 'Two-factor authentication disabled'
      );
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      this.showToast('Failed to update 2FA settings', 'error');
    } finally {
      this.loadingStates.profile = false;
    }
  }

  async updateNotificationPreferences(): Promise<void> {
    try {
      this.loadingStates.notifications = true;
      // TODO: Implement notification preferences update
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.editMode.notifications = false;
      this.showToast('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      this.showToast('Failed to update notification preferences', 'error');
    } finally {
      this.loadingStates.notifications = false;
    }
  }

  async onPhotoUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    try {
      this.loadingStates.photo = true;
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
      
      // TODO: Implement actual file upload to server
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.profilePhoto = e.target.result;
        this.editableProfile.profilePhoto = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.showToast('Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      this.showToast(error instanceof Error ? error.message : 'Failed to upload photo', 'error');
    } finally {
      this.loadingStates.photo = false;
    }
  }

  async submitKYC(): Promise<void> {
    try {
      this.loadingStates.kyc = true;
      // TODO: Implement KYC submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.showToast('KYC documents submitted successfully');
      this.editMode.kyc = false;
    } catch (error) {
      console.error('Error submitting KYC:', error);
      this.showToast('Failed to submit KYC documents', 'error');
    } finally {
      this.loadingStates.kyc = false;
    }
  }

  async withdrawFunds(): Promise<void> {
    try {
      this.loadingStates.withdrawal = true;
      // TODO: Implement withdrawal logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.showToast('Withdrawal request submitted successfully');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      this.showToast('Failed to process withdrawal', 'error');
    } finally {
      this.loadingStates.withdrawal = false;
    }
  }

  copyReferralCode(): void {
    navigator.clipboard.writeText(this.userProfile.referral.code)
      .then(() => this.showToast('Referral code copied to clipboard'))
      .catch(() => this.showToast('Failed to copy referral code', 'error'));
  }

  copyToClipboard(value: string): void {
    navigator.clipboard.writeText(value)
      .then(() => this.showToast('Wallet address copied!'))
      .catch(() => this.showToast('Failed to copy address', 'error'));
  }

  // Helper to format date for input type="date"
  toDateInputValue(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
} 