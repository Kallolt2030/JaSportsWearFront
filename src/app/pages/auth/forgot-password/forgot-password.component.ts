import { Component } from '@angular/core';
import { ForgotPasswordService } from '../../../services/forgot-password.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email = '';

  loading = false;

  successMessage = '';

  errorMessage = '';

  constructor(
    private forgotPasswordService: ForgotPasswordService
  ) { }

  sendEmail() {

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Debes ingresar un correo electrónico.';
      return;
    }

    this.loading = true;

    this.forgotPasswordService
      .forgotPassword(this.email)
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          this.successMessage =
            response.message ??
            'Se envió el enlace de recuperación correctamente.';

          this.email = '';

        },

        error: (error) => {

          this.loading = false;

          if (error.status === 0) {

            this.errorMessage =
              'No fue posible conectar con el servidor. Verifica tu conexión o intenta nuevamente más tarde.';

            return;
          }

          if (error.status === 404) {

            this.errorMessage =
              error.error.message ??
              'No existe una cuenta asociada a ese correo.';

            return;
          }

          if (error.status === 422) {

            this.errorMessage =
              error.error.message ??
              'El correo electrónico no es válido.';

            return;
          }

          if (error.status === 429) {

            this.errorMessage =
              'Has realizado demasiadas solicitudes. Intenta nuevamente en unos minutos.';

            return;
          }

          if (error.status >= 500) {

            this.errorMessage =
              'Ocurrió un error interno del servidor. Intenta nuevamente más tarde.';

            return;
          }

          this.errorMessage =
            error.error.message ??
            'Ocurrió un error inesperado.';

        }

      });

  }

}