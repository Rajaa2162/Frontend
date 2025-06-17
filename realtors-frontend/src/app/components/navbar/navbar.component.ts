import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn = false; // This should be connected to your auth service
  username = 'User'; // This should be connected to your auth service
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthPage = event.urlAfterRedirects.startsWith('/auth');
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    // Implement logout logic here
    this.isLoggedIn = false;
    this.isDropdownOpen = false;
  }

  login() {
    this.isLoggedIn = true;
  }
} 