import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private api = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Historial del usuario
  getMyOrders(): Observable<any> {
    return this.http.get(`${this.api}/my-orders`, { headers: this.getAuthHeaders() });
  }

  // Todas las órdenes (Admin)
  getOrders(): Observable<any> {
    return this.http.get(`${this.api}/orders`, { headers: this.getAuthHeaders() });
  }

  // Obtener una orden por ID
  getOrder(id: number): Observable<any> {
    return this.http.get(`${this.api}/orders/${id}`, { headers: this.getAuthHeaders() });
  }

  // Actualizar estado de una orden
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.api}/orders/${id}/status`, {
      status: status
    }, { headers: this.getAuthHeaders() });
  }

}