import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@application/auth.service';
import { ErrorApp } from '@domain/errors';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';
import { destinoSeguro } from '@presentation/shared/utils/destino-seguro';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NotificacionesService);

  /** Query params (?volver=/carrito&expirada=1) */
  readonly volver = input<string>();
  readonly expirada = input<string>();

  protected readonly form = inject(NonNullableFormBuilder).group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    const { correo, password } = this.form.getRawValue();
    this.auth.login(correo, password).subscribe({
      next: (usuario) => {
        this.avisos.mostrar(`¡Hola, ${usuario.nombre.split(' ')[0]}!`);
        this.router.navigateByUrl(destinoSeguro(this.volver()));
      },
      error: (e: ErrorApp) => {
        this.error.set(e.message);
        this.enviando.set(false);
      },
    });
  }
}
