import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent {

  productos: any[] = [];

  constructor(public carritoService: CarritoService){}

  ngOnInit(){

    this.carritoService.carrito$.subscribe(data=>{

      this.productos = data;

    });

  }

}