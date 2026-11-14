import { Component, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@application/auth.service';
import { ErrorApp } from '@domain/errors';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';
import { destinoSeguro } from '@presentation/shared/utils/destino-seguro';

function contrasenasCoinciden(grupo: AbstractControl): ValidationErrors | null {
  return grupo.get('password')?.value === grupo.get('confirmar')?.value ? null : { noCoinciden: true };
}

@Component({
  selector: 'app-registro-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class RegistroPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NotificacionesService);

  readonly volver = input<string>();

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', Validators.maxLength(25)],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmar: ['', Validators.required],
    },
    { validators: contrasenasCoinciden },
  );
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    const { nombre, correo, telefono, password } = this.form.getRawValue();
    this.auth.registro({ nombre, correo, password, telefono: telefono || null }).subscribe({
      next: (usuario) => {
        this.avisos.mostrar(`¡Bienvenido, ${usuario.nombre.split(' ')[0]}! Tu cuenta está lista.`);
        this.router.navigateByUrl(destinoSeguro(this.volver()));
      },
      error: (e: ErrorApp) => {
        this.error.set(e.message);
        this.enviando.set(false);
      },
    });
  }
}
