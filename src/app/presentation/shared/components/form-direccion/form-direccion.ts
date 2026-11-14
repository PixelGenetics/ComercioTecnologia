import { Component, inject, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DireccionesService } from '@application/direcciones.service';
import { ErrorApp } from '@domain/errors';
import { Direccion } from '@domain/models';

/** Formulario para crear una dirección. Emite la dirección creada. */
@Component({
  selector: 'app-form-direccion',
  imports: [ReactiveFormsModule],
  templateUrl: './form-direccion.html',
})
export class FormDireccion {
  private readonly direcciones = inject(DireccionesService);

  readonly creada = output<Direccion>();
  readonly cancelar = output<void>();

  protected readonly form = inject(NonNullableFormBuilder).group({
    alias: ['', Validators.maxLength(50)],
    calle: ['', [Validators.required, Validators.maxLength(200)]],
    ciudad: ['', [Validators.required, Validators.maxLength(100)]],
    estado: ['', Validators.maxLength(100)],
    codigoPostal: ['', Validators.maxLength(20)],
    pais: ['Nicaragua', [Validators.required, Validators.maxLength(100)]],
    esPrincipal: [false],
  });
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.enviando.set(true);
    this.error.set(null);
    this.direcciones
      .crear({ ...v, alias: v.alias || null, estado: v.estado || null, codigoPostal: v.codigoPostal || null })
      .subscribe({
        next: (d) => {
          this.enviando.set(false);
          this.form.reset();
          this.creada.emit(d);
        },
        error: (e: ErrorApp) => {
          this.error.set(e.message);
          this.enviando.set(false);
        },
      });
  }
}
