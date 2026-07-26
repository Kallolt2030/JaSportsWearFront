import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  // Variables para login
  email: string = '';
  password: string = '';
  
  // Estado del formulario
  isRegister: boolean = false;
  
  // Mensajes de feedback
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  // Datos del nuevo usuario
  newUser = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private userservice: UserService
  ) {}

  /**
   * Método para iniciar sesión
   */
  login() {
    // Validar que los campos no estén vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>(`${environment.apiUrl}/login`, credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Guardar datos básicos
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('token', response.token);

        // Redirigir según el rol
        if (response.user.role === 'user') {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/cart']);
        } else if (response.user.role === 'admin') {
          localStorage.setItem('admin', JSON.stringify(response.user));
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en login:', error);
        
        // Manejar diferentes tipos de errores
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
        } else if (error.status === 404) {
          this.errorMessage = 'Usuario no encontrado. Por favor, regístrate primero.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente más tarde.';
        }
      }
    });
  }

  /**
   * Método para registrar un nuevo usuario
   */
  register() {
    // Limpiar mensajes previos
    this.errorMessage = null;
    this.successMessage = null;

    // Validar que todos los campos estén completos
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.newUser.password !== this.newUser.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Validar longitud mínima de contraseña
    if (this.newUser.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.email)) {
      this.errorMessage = 'Por favor, ingresa un email válido';
      return;
    }

    this.isLoading = true;

    // Crear objeto para enviar al backend (SIN role - el backend lo asigna)
    const userToRegister = {
      name: this.newUser.name.trim(),
      email: this.newUser.email.trim().toLowerCase(),
      password: this.newUser.password
      // 🔒 NOTA: No enviamos 'role' - el backend siempre asigna 'user'
    };

    this.userservice.createUser(userToRegister).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = '¡Usuario registrado exitosamente!';
        this.errorMessage = null;
        
        // Limpiar el formulario
        this.newUser = {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        };

        // Cambiar al modo login después de 2 segundos
        setTimeout(() => {
          this.isRegister = false;
          this.successMessage = null;
          // Prellenar el email para facilitar el login
          this.email = userToRegister.email;
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en registro:', error);
        
        // Manejar diferentes tipos de errores
        if (error.status === 422) {
          // Errores de validación del backend
          if (error.error?.errors?.email) {
            this.errorMessage = 'Este email ya está registrado. Por favor, usa otro.';
          } else if (error.error?.errors?.name) {
            this.errorMessage = 'El nombre no es válido.';
          } else {
            this.errorMessage = 'Datos inválidos. Verifica la información.';
          }
        } else if (error.status === 409) {
          this.errorMessage = 'Este email ya está registrado. Por favor, inicia sesión.';
        } else {
          this.errorMessage = 'Error al registrar usuario. Intenta nuevamente.';
        }
      }
    });
  }

  /**
   * Alternar entre formularios de login y registro
   */
  toggleForm() {
    this.isRegister = !this.isRegister;
    // Limpiar mensajes al cambiar
    this.successMessage = null;
    this.errorMessage = null;
    this.isLoading = false;
    
    // Resetear formulario de registro
    this.newUser = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }
}