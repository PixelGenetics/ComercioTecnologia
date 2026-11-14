import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CarritoService } from '@application/carrito.service';
import { ErrorApp } from '@domain/errors';
import { CarritoItem } from '@domain/models';
import { Cargando } from '@presentation/shared/components/cargando/cargando';
import { EstadoVacio } from '@presentation/shared/components/estado-vacio/estado-vacio';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';

@Component({
  selector: 'app-carrito-page',
  imports: [CurrencyPipe, RouterLink, Cargando, EstadoVacio],
  templateUrl: './carrito.html',
})
export class CarritoPage {
  private readonly servicio = inject(CarritoService);
  private readonly avisos = inject(NotificacionesService);
  private readonly router = inject(Router);

  protected readonly carrito = this.servicio.carrito;
  protected readonly cantidadTotal = this.servicio.cantidad;
  protected readonly problemas = this.servicio.problemas;
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  /** Variante que se está actualizando (para deshabilitar sus botones) */
  protected readonly ocupado = signal<number | null>(null);

  constructor() {
    this.servicio.cargar().subscribe({
      next: () => this.cargando.set(false),
      error: (e: ErrorApp) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  protected cambiar(item: CarritoItem, delta: number): void {
    const nueva = item.cantidad + delta;
    if (nueva < 1) return;
    this.ejecutar(item.varianteId, this.servicio.actualizar(item.varianteId, nueva));
  }

  protected quitar(item: CarritoItem): void {
    this.ejecutar(item.varianteId, this.servicio.quitar(item.varianteId), `${item.producto} se quitó del carrito.`);
  }

  protected vaciar(): void {
    if (!confirm('¿Quitar todos los productos del carrito?')) return;
    this.servicio.vaciar().subscribe({
      next: () => this.avisos.mostrar('Carrito vacío.', 'info'),
      error: (e: ErrorApp) => this.avisos.mostrar(e.message, 'error'),
    });
  }

  protected irAlCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  private ejecutar(varianteId: number, accion: Observable<unknown>, exito?: string): void {
    this.ocupado.set(varianteId);
    accion.subscribe({
      next: () => {
        this.ocupado.set(null);
        if (exito) this.avisos.mostrar(exito, 'info');
      },
      error: (e: ErrorApp) => {
        this.ocupado.set(null);
        this.avisos.mostrar(e.message, 'error');
      },
    });
  }
}
