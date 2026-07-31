import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private api = environment.apiUrl;

  constructor(
    private http:HttpClient
    ){}

  getMyOrders(){
    return this.http.get(`${this.api}/my-orders`);
  }


}