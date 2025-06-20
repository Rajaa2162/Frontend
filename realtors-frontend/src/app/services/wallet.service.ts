import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private api = 'http://localhost:5000/api/wallet';

  constructor(private http: HttpClient) {}

  getWallet(): Observable<any> {
    return this.http.get(`${this.api}`, this.authHeader());
  }

  requestWithdrawal(amount: number): Observable<any> {
    return this.http.post(`${this.api}/withdraw`, { amount }, this.authHeader());
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