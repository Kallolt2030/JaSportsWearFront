import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  productos: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.productos = this.cartService.getLocalCart();
  }

  getTotal(): number {
    return this.productos.reduce((total, producto) => {
      return total + (producto.price * producto.quantity);
    }, 0);
  }

  aumentarCantidad(producto: any): void {
    producto.quantity++;

    this.cartService.updateLocalQuantity(
      producto.id,
      producto.quantity
    );

    this.cargarCarrito();
  }

  disminuirCantidad(producto: any): void {

    if (producto.quantity > 1) {

      producto.quantity--;

      this.cartService.updateLocalQuantity(
        producto.id,
        producto.quantity
      );

    } else {

      this.cartService.removeLocalProduct(producto.id);

    }

    this.cargarCarrito();
  }

  eliminarProducto(id: number): void {

    this.cartService.removeLocalProduct(id);

    this.cargarCarrito();

  }

  vaciarCarrito(): void {

    this.cartService.clearLocalCart();

    this.cargarCarrito();

  }

}