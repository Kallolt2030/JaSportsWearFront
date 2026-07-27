import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  // Datos de ejemplo para mostrar el diseño
  productos: any[] = [
    {
      id: 1,
      name: 'Producto de ejemplo 1',
      price: 29.99,
      quantity: 2,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Producto de ejemplo 2',
      price: 49.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150'
    }
  ];
}