import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // LOGIN
  email: string = '';
  password: string = '';

  // REGISTRO
  newUser = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  };

  // CONTROL
  isRegister = false;
  isLoading = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // OJITOS
  showPassword = false;
  showRegisterPassword = false;
  showConfirmPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  //============================
  // OJITOS
  //============================

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleRegisterPassword() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  //============================
  // LOGIN
  //============================

  login() {

    this.successMessage = null;
    this.errorMessage = null;

    if (!this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.isLoading = true;

    this.authService.login({ 
      email: this.email, password: this.password 
    }).subscribe({

      next: (response) => {

        this.isLoading = false;

        localStorage.setItem('token', response.token);
        window.dispatchEvent(new Event('storage'));
        localStorage.setItem('userId', response.user.id);

        const localCart = this.cartService.getLocalCart();

          if (localCart.length > 0) {

            this.cartService.syncCart(localCart).subscribe({

              next: () => {
                this.cartService.clearLocalCart();
                console.log('Carrito sincronizado correctamente.');
              },

              error: (err) => {
                console.error('Error al sincronizar el carrito', err);
              }

            });

          }

        if (response.user.role === 'admin') {

          localStorage.setItem(
            'admin',
            JSON.stringify(response.user)
          );

          this.router.navigate(['/admin']);

        } else {

          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );

          this.router.navigate(['/cart']);

        }

      },

      error: (error) => {

        this.isLoading = false;

        if (!navigator.onLine) {

          this.errorMessage = 'No tienes conexión a Internet.';
          return;

        }

        switch (error.status) {

          case 0:
            this.errorMessage = 'No fue posible conectar con el servidor.';
            break;

          case 401:
            this.errorMessage = 'Correo o contraseña incorrectos.';
            break;

          case 404:
            this.errorMessage = 'El usuario no existe.';
            break;

          case 422:
            this.errorMessage = 'Los datos enviados no son válidos.';
            break;

          case 500:
            this.errorMessage = 'Error interno del servidor.';
            break;

          default:
            this.errorMessage = 'Ocurrió un error inesperado.';
            break;

        }

      }

    });

  }

  //============================
  // REGISTRO
  //============================

  register() {

    this.successMessage = null;
    this.errorMessage = null;

    if (
      !this.newUser.name ||
      !this.newUser.email ||
      !this.newUser.password ||
      !this.newUser.confirmPassword
    ) {

      this.errorMessage = 'Completa todos los campos.';
      return;

    }

    if (this.newUser.password.length < 8) {

      this.errorMessage =
        'La contraseña debe tener al menos 8 caracteres.';

      return;

    }

    if (
      this.newUser.password !==
      this.newUser.confirmPassword
    ) {

      this.errorMessage =
        'Las contraseñas no coinciden.';

      return;

    }

    this.isLoading = true;

    this.userService.createUser(this.newUser).subscribe({

      next: () => {

        this.isLoading = false;

        this.successMessage =
          'Usuario registrado correctamente.';

        this.newUser = {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user'
        };

        setTimeout(() => {

          this.successMessage = null;
          this.isRegister = false;

        }, 1500);

      },

      error: (error) => {

        this.isLoading = false;

        if (!navigator.onLine) {

          this.errorMessage =
            'No tienes conexión a Internet.';
          return;

        }

        switch (error.status) {

          case 0:
            this.errorMessage =
              'No fue posible conectar con el servidor.';
            break;

          case 409:
            this.errorMessage =
              'Este correo ya está registrado.';
            break;

          case 422:

            if (error.error?.errors?.email) {

              this.errorMessage =
                error.error.errors.email[0];

            } else if (error.error?.errors?.password) {

              this.errorMessage =
                error.error.errors.password[0];

            } else {

              this.errorMessage =
                'Los datos enviados son incorrectos.';

            }

            break;

          case 500:
            this.errorMessage =
              'Error interno del servidor.';
            break;

          default:
            this.errorMessage =
              'No fue posible registrar al usuario.';
            break;

        }

      }

    });

  }

  //============================
  // CAMBIAR FORMULARIO
  //============================

  toggleForm() {

    this.isRegister = !this.isRegister;

    this.errorMessage = null;
    this.successMessage = null;

    this.email = '';
    this.password = '';

    this.newUser = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    };

  }

}