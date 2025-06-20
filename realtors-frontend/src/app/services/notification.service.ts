import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  getPreferences(): Observable<any> {
    return this.http.get(`${this.api}/preferences`, this.authHeader());
  }

  updatePreferences(prefs: any): Observable<any> {
    return this.http.put(`${this.api}/preferences`, prefs, this.authHeader());
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