import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false; // This should be connected to your auth service
  username = 'User'; // This should be connected to your auth service
  profilePhoto?: string; // This should be connected to your auth service
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  isAuthPage = false;

  constructor(private router: Router, private http: HttpClient, private userService: UserService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthPage = event.urlAfterRedirects.startsWith('/auth');
      this.checkLoginState();
    });
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.username = user.fullName || user.username || 'User';
        this.profilePhoto = user.profilePhoto;
      }
    });
    this.userService.fetchProfile();
  }

  checkLoginState() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    if (token) {
      const storedName = localStorage.getItem('username');
      if (storedName) {
        this.username = storedName;
      } else {
        this.username = 'User';
      }
    } else {
      this.username = 'User';
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    // Optionally call backend logout API
    this.http.post('http://localhost:5000/api/auth/logout', {}).subscribe({
      next: () => {
        this.clearUserData();
      },
      error: () => {
        this.clearUserData();
      }
    });
  }

  private clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.isDropdownOpen = false;
    this.router.navigate(['/auth']);
    this.checkLoginState();
  }

  login() {
    this.isLoggedIn = true;
  }
} 