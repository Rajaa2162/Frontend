import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  private api = 'http://localhost:5000/api/investments';

  constructor(private http: HttpClient) {}

  getInvestments(): Observable<any> {
    return this.http.get(`${this.api}`, this.authHeader());
  }

  addInvestment(amount: number, type: string): Observable<any> {
    return this.http.post(`${this.api}`, { amount, type }, this.authHeader());
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