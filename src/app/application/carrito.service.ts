import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Carrito } from '@domain/models';
import { CarritoRepository } from '@domain/repositories';
import { AuthService } from './auth.service';

/** Estado del carrito del usuario. Se carga solo al iniciar sesión y se limpia al cerrarla. */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly repositorio = inject(CarritoRepository);
  private readonly auth = inject(AuthService);
  private readonly estado = signal<Carrito | null>(null);

  readonly carrito = this.estado.asReadonly();
  readonly cantidad = computed(() => this.estado()?.items.reduce((n, i) => n + i.cantidad, 0) ?? 0);
  /** Ítems que no se pueden comprar tal como están (inactivos o sin stock suficiente). */
  readonly problemas = computed(() => (this.estado()?.items ?? []).filter((i) => !i.activo || i.cantidad > i.stock));

  constructor() {
    effect(() => {
      if (this.auth.autenticado()) untracked(() => this.cargar().subscribe({ error: () => {} }));
      else this.estado.set(null);
    });
  }

  cargar(): Observable<Carrito> {
    return this.repositorio.obtener().pipe(tap((c) => this.estado.set(c)));
  }

  agregar(varianteId: number, cantidad = 1): Observable<Carrito> {
    return this.repositorio.agregar(varianteId, cantidad).pipe(tap((c) => this.estado.set(c)));
  }

  actualizar(varianteId: number, cantidad: number): Observable<Carrito> {
    return this.repositorio.actualizar(varianteId, cantidad).pipe(tap((c) => this.estado.set(c)));
  }

  quitar(varianteId: number): Observable<Carrito> {
    return this.repositorio.quitar(varianteId).pipe(tap((c) => this.estado.set(c)));
  }

  vaciar(): Observable<void> {
    return this.repositorio.vaciar().pipe(tap(() => this.estado.set({ items: [], subtotal: 0 })));
  }
}
