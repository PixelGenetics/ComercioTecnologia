import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Direccion, DireccionDto } from '@domain/models';
import { DireccionRepository } from '@domain/repositories';
import { API_URL } from '../http/api.config';
import { conErrorDeDominio } from '../http/error-http.mapper';

@Injectable()
export class DireccionHttpRepository implements DireccionRepository {
  private readonly http = inject(HttpClient);

  listar() {
    return this.http.get<Direccion[]>(`${API_URL}/direcciones`).pipe(conErrorDeDominio());
  }

  crear(dto: DireccionDto) {
    return this.http.post<Direccion>(`${API_URL}/direcciones`, dto).pipe(conErrorDeDominio());
  }
}
