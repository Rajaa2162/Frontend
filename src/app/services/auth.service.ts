import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for stored user on init
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('refreshToken received after login:', response.refreshToken);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  forgotPassword(email: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, email);
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, data);
  }

  /**
   * Refresh the access token using the refresh token.
   * @param method 'body' | 'cookie' | 'header' - where to send the token
   */
  refreshToken(method: 'body' | 'cookie' | 'header' = 'body'): Observable<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    console.log('refreshToken before sending refresh request:', refreshToken);
    if (method === 'body') {
      // Send in body (recommended)
      return this.http.post<{ accessToken: string }>(`${this.API_URL}/refresh-token`, { refreshToken })
        .pipe(
          tap(response => {
            if (response && response.accessToken) {
              localStorage.setItem('accessToken', response.accessToken);
            }
          })
        );
    } else if (method === 'cookie') {
      // Send as cookie (withCredentials)
      return this.http.post<{ accessToken: string }>(`${this.API_URL}/refresh-token`, {}, { withCredentials: true })
        .pipe(
          tap(response => {
            if (response && response.accessToken) {
              localStorage.setItem('accessToken', response.accessToken);
            }
          })
        );
    } else if (method === 'header') {
      // Send as Authorization header
      return this.http.post<{ accessToken: string }>(`${this.API_URL}/refresh-token`, {}, {
        headers: { 'Authorization': `Bearer ${refreshToken}` }
      }).pipe(
        tap(response => {
          if (response && response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
          }
        })
      );
    } else {
      throw new Error('Invalid refreshToken method');
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
} 