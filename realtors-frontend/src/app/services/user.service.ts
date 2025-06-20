import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'http://localhost:5000/api/user';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchProfile(): void {
    this.http.get(`${this.api}/profile`, this.authHeader())
      .subscribe(user => this.userSubject.next(user));
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.api}/profile`, this.authHeader())
      .pipe(tap(user => this.userSubject.next(user)));
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.api}/profile`, data, this.authHeader())
      .pipe(tap((user: any) => this.userSubject.next(user)));
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.api}/password`, { oldPassword, newPassword }, this.authHeader());
  }

  uploadProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post(`${this.api}/photo`, formData, this.authHeader(true));
  }

  toggle2FA(): Observable<any> {
    return this.http.post(`${this.api}/2fa/toggle`, {}, this.authHeader());
  }

  private authHeader(isFile = false) {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        ...(isFile ? {} : { 'Content-Type': 'application/json' })
      })
    };
  }
} 