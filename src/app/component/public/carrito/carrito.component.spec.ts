import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: any[] = [];

  private carritoSubject = new BehaviorSubject<any[]>([]);

  carrito$ = this.carritoSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

  private cargarCarrito() {
    const datos = localStorage.getItem('carrito');

    if (datos) {
      this.carrito = JSON.parse(datos);
      this.carritoSubject.next(this.carrito);
    }
  }

  private guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.carritoSubject.next(this.carrito);
  }

  agregarProducto(producto: any) {

    const existe = this.carrito.find(p => p.id === producto.id);

    if (existe) {
      existe.quantity++;
    } else {

      this.carrito.push({
        ...producto,
        quantity: 1
      });

    }

    this.guardarCarrito();
  }

  obtenerProductos() {
    return this.carrito;
  }

  aumentarCantidad(id: number) {

    const producto = this.carrito.find(p => p.id === id);

    if (producto) {
      producto.quantity++;
      this.guardarCarrito();
    }

  }

  disminuirCantidad(id: number) {

    const producto = this.carrito.find(p => p.id === id);

    if (!producto) return;

    if (producto.quantity > 1) {

      producto.quantity--;

    } else {

      this.eliminarProducto(id);

    }

    this.guardarCarrito();

  }

  eliminarProducto(id: number) {

    this.carrito = this.carrito.filter(p => p.id !== id);

    this.guardarCarrito();

  }

  vaciarCarrito() {

    this.carrito = [];

    this.guardarCarrito();

  }

  getTotal(): number {

    return this.carrito.reduce((total, producto) => {

      return total + (producto.price * producto.quantity);

    }, 0);

  }

  getCantidadProductos(): number {

    return this.carrito.reduce((total, producto) => {

      return total + producto.quantity;

    }, 0);

  }

}