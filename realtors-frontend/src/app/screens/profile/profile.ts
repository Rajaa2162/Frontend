import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  username = 'realtor_user';
  email = 'user@realtors.ai';
  phone = '9876543210';
  referralCode = 'ref-dhaval123'; // Ideally from backend

  updateProfile() {
    console.log('Updated:', this.username, this.email, this.phone);
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(`https://realtors.ai/register?ref=${code}`);
    alert('Referral link copied!');
  }
}
