import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KycService {
  private api = 'http://localhost:5000/api/kyc';

  constructor(private http: HttpClient) {}

  submitKYC(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    return this.http.post(`${this.api}/submit`, formData, this.authHeader(true));
  }

  getKYCStatus(): Observable<any> {
    return this.http.get(`${this.api}/status`, this.authHeader());
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