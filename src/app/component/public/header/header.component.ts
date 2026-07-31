import { Component, OnInit } from '@angular/core';
import { LogoutService } from '../../../services/logout.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;

  constructor(
    private logoutService: LogoutService,
    private router: Router
  ) {}

  ngOnInit() {
  this.loggedIn = !!localStorage.getItem('token');

  window.addEventListener('storage', () => {
    this.loggedIn = !!localStorage.getItem('token');
  });
}

  logout() {
    this.logoutService.logoutUser().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      },
      error: () => {
      // Aunque falle el backend, puedes cerrar la sesión localmente
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
    });
  }

}
