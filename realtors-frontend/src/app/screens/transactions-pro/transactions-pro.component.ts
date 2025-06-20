import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryComponent } from '../history/history.component';

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal';
  amount: number;
  method: string;
  date: Date;
  status: 'Pending' | 'Completed' | 'Failed';
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HistoryComponent],
  templateUrl: './transactions-pro.component.html',
  styleUrls: ['./transactions-pro.component.css']
})
export class WalletComponent {
  activeTab: 'balance' | 'deposit' | 'withdraw' | 'history' = 'balance';
  selectedTransactionType: 'deposit' | 'withdrawal' = 'deposit';
  transactionAmount: number | null = null;
  selectedMethod: string = 'USDT_TRC20';
  withdrawalAddress: string = '';
  bankAccountNum: string = '';
  ifscCode: string = '';
  securityCode: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showWithdrawalConfirmModal: boolean = false;
  currentBalance: number = 12345.67;
  minDeposit: number = 10;
  minWithdrawal: number = 20;
  depositAddresses: { [key: string]: string } = {
    'USDT_TRC20': 'TVf6Sg4Xy2hJ8N9bC7D5E3A1Z0WqR7sF',
    'USDT_ERC20': '0xABc123DeF456Gh789IjKLmN0oPqRsT',
    'BTC': 'bc1qxw5x7yq9r2y6d8c4z2e9t7v8c4z2e9t7v8c4z',
    'ETH': '0xAbCdEf1234567890aBcDeF1234567890aBcDeF12'
  };
  qrCodePlaceholders: { [key: string]: string } = {
    'USDT_TRC20': 'https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=TVf6Sg4Xy2hJ8N9bC7D5E3A1Z0WqR7sF',
    'USDT_ERC20': 'https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=0xABc123DeF456Gh789IjKLmN0oPqRsT',
    'BTC': 'https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=bc1qxw5x7yq9r2y6d8c4z2e9t7v8c4z2e9t7v8c4z',
    'ETH': 'https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=0xAbCdEf1234567890aBcDeF1234567890aBcDeF12'
  };
  transactionHistory: Transaction[] = [];
  show2faForDeposit: boolean = false;

  constructor() {
    this.loadTransactionHistory();
  }

  selectTransactionType(type: 'deposit' | 'withdrawal'): void {
    this.selectedTransactionType = type;
    this.resetForm();
  }

  resetForm(): void {
    this.transactionAmount = null;
    this.selectedMethod = 'USDT_TRC20';
    this.withdrawalAddress = '';
    this.bankAccountNum = '';
    this.ifscCode = '';
    this.securityCode = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
    this.showWithdrawalConfirmModal = false;
  }

  isCryptoMethod(method: string): boolean {
    return ['USDT_TRC20', 'USDT_ERC20', 'BTC', 'ETH'].includes(method);
  }

  getDepositAddress(method: string): string {
    return this.depositAddresses[method] || 'N/A';
  }

  getQrCode(method: string): string {
    return this.qrCodePlaceholders[method] || 'https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=NoQRData';
  }

  onMethodChange(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  getWithdrawalFee(method: string): string {
    switch (method) {
      case 'USDT_TRC20':
        return '1 USDT + Network Fee';
      case 'USDT_ERC20':
        return '5 USDT + Network Fee';
      case 'BankTransfer_INR':
        return '0.5% (Min ₹50)';
      default:
        return '0';
    }
  }

  getWithdrawalDestinationText(): string {
    if (this.isCryptoMethod(this.selectedMethod)) {
      return this.withdrawalAddress;
    } else if (this.selectedMethod === 'BankTransfer_INR') {
      return `A/C: ${this.bankAccountNum}, IFSC: ${this.ifscCode}`;
    }
    return 'Unknown Destination';
  }

  initiateTransaction(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.validateForm()) {
      return;
    }
    if (this.selectedTransactionType === 'withdrawal') {
      this.showWithdrawalConfirmModal = true;
    } else {
      this.processDeposit();
    }
  }

  executeWithdrawal(): void {
    this.showWithdrawalConfirmModal = false;
    this.processWithdrawal();
  }

  private validateForm(): boolean {
    if (this.transactionAmount === null || this.transactionAmount <= 0) {
      this.errorMessage = 'Please enter a valid amount.';
      return false;
    }
    if (!this.selectedMethod) {
      this.errorMessage = 'Please select a transaction method.';
      return false;
    }
    if (this.selectedTransactionType === 'deposit') {
        if (this.transactionAmount < this.minDeposit) {
            this.errorMessage = `Minimum deposit amount is $${this.minDeposit} USD.`;
            return false;
        }
    } else {
        if (this.transactionAmount < this.minWithdrawal) {
            this.errorMessage = `Minimum withdrawal amount is $${this.minWithdrawal} USD.`;
            return false;
        }
        if (this.transactionAmount > this.currentBalance) {
            this.errorMessage = 'Insufficient balance for this withdrawal.';
            return false;
        }
        if (this.isCryptoMethod(this.selectedMethod) && !this.withdrawalAddress) {
            this.errorMessage = 'Please enter your crypto wallet address.';
            return false;
        }
        if (this.selectedMethod === 'BankTransfer_INR' && (!this.bankAccountNum || !this.ifscCode)) {
            this.errorMessage = 'Please enter your bank account number and IFSC code.';
            return false;
        }
        if (!this.securityCode) {
            this.errorMessage = '2FA / Security Code is required for withdrawals.';
            return false;
        }
    }
    return true;
  }

  private processDeposit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      const newTx: Transaction = {
        id: `TX${Date.now()}`,
        type: 'Deposit',
        amount: this.transactionAmount!,
        method: this.selectedMethod,
        date: new Date(),
        status: 'Pending'
      };
      this.transactionHistory.unshift(newTx);
      this.successMessage = `Deposit of $${this.transactionAmount} via ${this.selectedMethod} initiated. It will be credited soon.`;
      this.resetForm();
    }, 2000);
  }

  private processWithdrawal(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      const newTx: Transaction = {
        id: `TX${Date.now()}`,
        type: 'Withdrawal',
        amount: this.transactionAmount!,
        method: this.selectedMethod,
        date: new Date(),
        status: 'Pending'
      };
      this.transactionHistory.unshift(newTx);
      this.currentBalance -= this.transactionAmount!;
      this.successMessage = `Withdrawal of $${this.transactionAmount} via ${this.selectedMethod} successfully requested.`;
      this.resetForm();
    }, 2500);
  }

  copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => alert('Address copied to clipboard!'))
        .catch(err => console.error('Failed to copy text: ', err));
    } else {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('Address copied to clipboard!');
    }
  }

  private loadTransactionHistory(): void {
    this.transactionHistory = [
      { id: 'TX001', type: 'Deposit', amount: 500, method: 'USDT_TRC20', date: new Date('2025-06-15T10:00:00Z'), status: 'Completed' },
      { id: 'TX002', type: 'Withdrawal', amount: 150, method: 'BankTransfer_INR', date: new Date('2025-06-14T15:30:00Z'), status: 'Pending' },
      { id: 'TX003', type: 'Deposit', amount: 1000, method: 'BTC', date: new Date('2025-06-13T09:00:00Z'), status: 'Completed' },
      { id: 'TX004', type: 'Withdrawal', amount: 200, method: 'USDT_TRC20', date: new Date('2025-06-12T11:45:00Z'), status: 'Completed' },
      { id: 'TX005', type: 'Deposit', amount: 75, method: 'USDT_ERC20', date: new Date('2025-06-11T14:00:00Z'), status: 'Failed' },
    ];
  }

  setTab(tab: 'balance' | 'deposit' | 'withdraw' | 'history') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
  }
} 