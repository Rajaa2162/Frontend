import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  transactionType: 'deposit' | 'withdraw' = 'deposit';
  amount: number = 0;

  onSubmit() {
    // TODO: Implement transaction logic
    console.log(`Processing ${this.transactionType} for amount: ${this.amount}`);
  }
} 