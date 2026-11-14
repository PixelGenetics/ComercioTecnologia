import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Carrito } from '@domain/models';
import { CarritoRepository } from '@domain/repositories';
import { API_URL } from '../http/api.config';
import { conErrorDeDominio } from '../http/error-http.mapper';

@Injectable()
export class CarritoHttpRepository implements CarritoRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/carrito`;

  obtener() {
    return this.http.get<Carrito>(this.url).pipe(conErrorDeDominio());
  }

  agregar(varianteId: number, cantidad: number) {
    return this.http.post<Carrito>(this.url, { varianteId, cantidad }).pipe(conErrorDeDominio());
  }

  actualizar(varianteId: number, cantidad: number) {
    return this.http.put<Carrito>(`${this.url}/${varianteId}`, { cantidad }).pipe(conErrorDeDominio());
  }

  quitar(varianteId: number) {
    return this.http.delete<Carrito>(`${this.url}/${varianteId}`).pipe(conErrorDeDominio());
  }

  vaciar() {
    return this.http.delete(this.url).pipe(
      map((): void => undefined),
      conErrorDeDominio(),
    );
  }
}
