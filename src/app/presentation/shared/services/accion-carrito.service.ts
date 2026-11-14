import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '@application/auth.service';
import { CarritoService } from '@application/carrito.service';
import { ErrorApp } from '@domain/errors';
import { NotificacionesService } from './notificaciones.service';

/**
 * Botón "Agregar al carrito" de la tienda: muestra el aviso de éxito o error y,
 * si no hay sesión, manda al login para volver a esta página después.
 */
@Injectable({ providedIn: 'root' })
export class AccionCarritoService {
  private readonly auth = inject(AuthService);
  private readonly carrito = inject(CarritoService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NotificacionesService);

  agregar(varianteId: number, cantidad: number, nombre: string, alTerminar?: () => void): void {
    if (!this.auth.token) {
      this.avisos.mostrar('Inicia sesión para agregar productos al carrito.', 'info');
      this.router.navigate(['/login'], { queryParams: { volver: this.router.url } });
      alTerminar?.();
      return;
    }
    this.carrito
      .agregar(varianteId, cantidad)
      .pipe(finalize(() => alTerminar?.()))
      .subscribe({
        next: () => this.avisos.mostrar(`${nombre} agregado al carrito.`),
        error: (e: ErrorApp) => this.avisos.mostrar(e.message, 'error'),
      });
  }
}
