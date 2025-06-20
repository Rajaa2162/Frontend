import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  totalInvested = 50000;
  totalReturns = 74500;
  dailyGrowth = 3.2;
  referralEarnings = 1250.50;
}
