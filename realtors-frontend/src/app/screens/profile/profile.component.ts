import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface UserProfile {
  userId: string;
  username: string;
  email: string;
  phone?: string;
  country?: string;
  twoFactorEnabled: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {
    userId: 'USR123456',
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    country: 'India',
    twoFactorEnabled: false
  };

  editableProfile: UserProfile = { ...this.userProfile };
  editMode = {
    account: false
  };
  isSaving = false;

  constructor() {}

  ngOnInit(): void {
    // TODO: Load user profile data from service
  }

  toggleEditMode(section: 'account'): void {
    this.editMode[section] = !this.editMode[section];
    if (!this.editMode[section]) {
      this.editableProfile = { ...this.userProfile };
    }
  }

  async saveProfile(): Promise<void> {
    try {
      this.isSaving = true;
      // TODO: Implement API call to save profile changes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.userProfile = { ...this.editableProfile };
      this.editMode.account = false;
    } catch (error) {
      console.error('Error saving profile:', error);
      // TODO: Show error message to user
    } finally {
      this.isSaving = false;
    }
  }

  async toggle2FA(): Promise<void> {
    try {
      // TODO: Implement 2FA toggle logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.userProfile.twoFactorEnabled = !this.userProfile.twoFactorEnabled;
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      // TODO: Show error message to user
    }
  }
} 