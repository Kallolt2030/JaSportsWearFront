import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private apiUrl = `${environment.apiUrl}/forgot-password`

  constructor(private http: HttpClient) { }
  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}`, { email });
  }
}
