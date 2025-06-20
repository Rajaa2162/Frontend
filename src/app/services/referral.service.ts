import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReferralService {
  private api = 'http://localhost:5000/api/referral';

  constructor(private http: HttpClient) {}

  getReferralInfo(): Observable<any> {
    return this.http.get(`${this.api}`, this.authHeader());
  }

  useReferralCode(code: string): Observable<any> {
    return this.http.post(`${this.api}/use`, { code }, this.authHeader());
  }

  private authHeader() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }
} 