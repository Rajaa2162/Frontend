import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLogin = true;

  email = '';
  password = '';
  username = ''; // for register
  referral = ''; // New

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  submit() {
    if (this.isLogin) {
      console.log('Logging in:', this.email, this.password);
    } else {
      console.log('Registering:', this.username, this.email, this.password, this.referral);
    }
  }
} 