import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrearPedidoDto, MetodoEnvio, PedidoDetalle, PedidoResumen } from '@domain/models';
import { PedidoRepository } from '@domain/repositories';
import { API_URL } from '../http/api.config';
import { conErrorDeDominio } from '../http/error-http.mapper';

@Injectable()
export class PedidoHttpRepository implements PedidoRepository {
  private readonly http = inject(HttpClient);

  crear(dto: CrearPedidoDto) {
    return this.http.post<PedidoDetalle>(`${API_URL}/pedidos`, dto).pipe(conErrorDeDominio());
  }

  listar() {
    return this.http.get<PedidoResumen[]>(`${API_URL}/pedidos`).pipe(conErrorDeDominio());
  }

  detalle(id: number) {
    return this.http.get<PedidoDetalle>(`${API_URL}/pedidos/${id}`).pipe(conErrorDeDominio());
  }

  metodosEnvio() {
    return this.http.get<MetodoEnvio[]>(`${API_URL}/metodos-envio`).pipe(conErrorDeDominio());
  }
}
