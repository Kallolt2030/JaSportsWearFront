import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = `${environment.apiUrl}/reset-password`

  constructor(private http: HttpClient) { }
  resetPassword(
    email: string,
    token: string,
    password: string,
    password_confirmation: string
){
    return this.http.post(this.apiUrl,{
        email,
        token,
        password,
        password_confirmation
    });
}
}
