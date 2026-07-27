import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../../services/reset-password.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  showPassword = false;
  showConfirmPassword = false;

  email = '';
  token = '';

  password = '';
  password_confirmation = '';

  loading = false;

  successMessage = '';

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resetPasswordService: ResetPasswordService
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.token = params['token'];
      this.email = params['email'];

    });

  }

  resetPassword() {

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.password || !this.password_confirmation) {

      this.errorMessage = 'Debes completar todos los campos.';
      return;

    }

    if (this.password.length < 8) {

      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;

    }

    if (this.password !== this.password_confirmation) {

      this.errorMessage = 'Las contraseñas no coinciden.';
      return;

    }

    this.loading = true;

    this.resetPasswordService.resetPassword(
      this.email,
      this.token,
      this.password,
      this.password_confirmation
    ).subscribe({

      next: (resp: any) => {

        this.loading = false;

        this.successMessage =
          resp.message ?? 'La contraseña se actualizó correctamente.';

        this.password = '';
        this.password_confirmation = '';

        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 2500);

      },

      error: (err) => {

        this.loading = false;

        if (err.status === 0) {

          this.errorMessage =
            'No fue posible conectar con el servidor. Intenta nuevamente.';
          return;

        }

        if (err.status === 400) {

          this.errorMessage =
            err.error.message ?? 'El enlace ya no es válido.';
          return;

        }

        if (err.status === 404) {

          this.errorMessage =
            'No se encontró la solicitud de recuperación.';
          return;

        }

        if (err.status === 422) {

          this.errorMessage =
            err.error.message ?? 'Los datos enviados no son válidos.';
          return;

        }

        if (err.status >= 500) {

          this.errorMessage =
            'Ocurrió un error interno del servidor.';
          return;

        }

        this.errorMessage =
          err.error.message ?? 'Ocurrió un error inesperado.';

      }

    });

  }

}