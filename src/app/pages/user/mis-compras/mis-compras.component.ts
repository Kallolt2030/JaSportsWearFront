import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-compras.component.html',
  styleUrl: './mis-compras.component.css'
})
export class MisComprasComponent implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.orderService.getMyOrders().subscribe({
      next: (data: any) => {

        // Si no hay compras devuelve un arreglo vacío
        this.orders = data ?? [];

      },

      error: (err) => {
        console.log('Error al cargar compras:', err);
        this.orders = [];
      }
    });

  }
}