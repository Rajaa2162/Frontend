import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  transactions = [
    { date: '2025-06-15', type: 'Deposit', amount: 10000 },
    { date: '2025-06-14', type: 'Profit', amount: 500 },
    { date: '2025-06-13', type: 'Withdraw', amount: 2000 },
  ];
} 