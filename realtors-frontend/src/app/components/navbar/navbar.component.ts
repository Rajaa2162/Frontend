import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;
  isLoggedIn = false; // This should be connected to your auth service

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    // Implement logout logic here
    this.isLoggedIn = false;
    // Add your auth service logout call
  }

  login() {
    this.isLoggedIn = true;
  }
} 