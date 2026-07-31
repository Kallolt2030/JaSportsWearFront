import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiUrl}/cart`;
  private storageKey = 'cart';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  

  constructor(private http: HttpClient) { }
  

  // ==========================
  // API LARAVEL
  // ==========================

  getCart(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, {
      product_id: productId,
      quantity
    });
  }

  updateItem(itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/item/${itemId}`, {
      quantity
    });
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item/${itemId}`);
  }

  syncCart(items: any[]): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/sync`, {
      items
    }, { headers: this.headers });
  }

  // ==========================
  // LOCAL STORAGE
  // ==========================

  getLocalCart(): any[] {

    const cart = localStorage.getItem(this.storageKey);

    return cart ? JSON.parse(cart) : [];
  }

  saveLocalCart(cart: any[]): void {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(cart)
    );

  }

  addLocalProduct(product: any): void {

    const cart = this.getLocalCart();

    const existing = cart.find(p => p.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {

      cart.push({
        ...product,
        quantity: 1
      });

    }

    this.saveLocalCart(cart);

  }

  updateLocalQuantity(id: number, quantity: number): void {

  const cart = this.getLocalCart();

  const product = cart.find(p => p.id === id);

  if (!product) return;

  if (quantity <= 0) {
    this.removeLocalProduct(id);
    return;
  }

  product.quantity = quantity;

  this.saveLocalCart(cart);

}

  removeLocalProduct(id: number): void {

    const cart = this.getLocalCart()
      .filter(p => p.id !== id);

    this.saveLocalCart(cart);

  }

  clearLocalCart(): void {

    localStorage.removeItem(this.storageKey);

  }

}