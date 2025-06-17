import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ReferredUser {
  name: string;
  capital: number;
  reward: number;
}

interface RecentEarning {
  referredUsername: string;
  period: string;
  amount: number;
}

@Component({
  selector: 'app-referrals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './referrals.component.html',
  styleUrl: './referrals.component.css'
})
export class ReferralsComponent implements OnInit {
  userReferralCode: string = 'RAI-123456'; // This should come from your user service
  referralLink: string = 'https://realtorsai.com/auth?ref=RAI-123456'; // This should be constructed from your environment config
  totalReferredUsers: number = 0;
  totalEarned: number = 0;
  recentEarnings: RecentEarning[] = [];
  referredUsers: ReferredUser[] = [];

  constructor() {}

  ngOnInit(): void {
    // This should be replaced with actual API calls
    this.loadReferralData();
  }

  private loadReferralData(): void {
    // Mock data - replace with actual API calls
    this.referredUsers = [
      { name: 'John Doe', capital: 10000, reward: 10 },
      { name: 'Jane Smith', capital: 15000, reward: 15 }
    ];

    this.totalReferredUsers = this.referredUsers.length;
    this.totalEarned = this.referredUsers.reduce((sum, user) => sum + user.reward, 0);

    this.recentEarnings = [
      {
        referredUsername: 'John Doe',
        period: 'March 2024',
        amount: 10
      },
      {
        referredUsername: 'Jane Smith',
        period: 'March 2024',
        amount: 15
      }
    ];
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard:', text);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
} 