import { Component, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CatalogoService } from '@application/catalogo.service';
import { ErrorApp } from '@domain/errors';
import { ImagenProducto } from '@domain/models';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';

/** Panel para que un Admin agregue, elija la principal y quite imágenes (por URL) de un producto. */
@Component({
  selector: 'app-admin-imagenes',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-imagenes.html',
})
export class AdminImagenes {
  private readonly catalogo = inject(CatalogoService);
  private readonly avisos = inject(NotificacionesService);

  readonly productoId = input.required<number>();
  readonly imagenes = input.required<ImagenProducto[]>();
  readonly cambio = output<ImagenProducto[]>();

  protected readonly ocupado = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly form = inject(NonNullableFormBuilder).group({
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/\S+$/i), Validators.maxLength(500)]],
    principal: [false],
  });

  protected agregar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { url, principal } = this.form.getRawValue();
    this.ejecutar(this.catalogo.agregarImagen(this.productoId(), url, principal), 'Imagen agregada.', () =>
      this.form.reset(),
    );
  }

  protected hacerPrincipal(indice: number): void {
    this.ejecutar(this.catalogo.hacerPrincipal(this.productoId(), indice), 'Imagen principal actualizada.');
  }

  protected quitar(indice: number): void {
    if (!confirm('¿Quitar esta imagen del producto?')) return;
    this.ejecutar(this.catalogo.quitarImagen(this.productoId(), indice), 'Imagen quitada.');
  }

  private ejecutar(accion: Observable<ImagenProducto[]>, exito: string, alTerminar?: () => void): void {
    this.ocupado.set(true);
    this.error.set(null);
    accion.subscribe({
      next: (lista) => {
        this.ocupado.set(false);
        this.cambio.emit(lista);
        this.avisos.mostrar(exito);
        alTerminar?.();
      },
      error: (e: ErrorApp) => {
        this.ocupado.set(false);
        this.error.set(e.codigo === 'sin-permiso' ? 'Solo un administrador puede cambiar imágenes.' : e.message);
      },
    });
  }
}
