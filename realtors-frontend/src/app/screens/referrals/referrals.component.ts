import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-referrals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './referrals.component.html',
  styleUrl: './referrals.component.css'
})
export class ReferralsComponent {
  referredUsers = [
    { name: 'Ravi', capital: 5000, reward: 250 },
    { name: 'Priya', capital: 10000, reward: 500 }
  ];
} 