import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearPedidoDto, MetodoEnvio, PedidoDetalle, PedidoResumen } from '@domain/models';
import { PedidoRepository } from '@domain/repositories';

/** Casos de uso de pedidos y checkout. */
@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly repositorio = inject(PedidoRepository);

  /** Crea el pedido con el contenido actual del carrito (el backend lo vacía). */
  confirmar(dto: CrearPedidoDto): Observable<PedidoDetalle> {
    return this.repositorio.crear({ ...dto, codigoCupon: dto.codigoCupon?.trim() || null });
  }

  misPedidos(): Observable<PedidoResumen[]> {
    return this.repositorio.listar();
  }

  detalle(id: number): Observable<PedidoDetalle> {
    return this.repositorio.detalle(id);
  }

  metodosEnvio(): Observable<MetodoEnvio[]> {
    return this.repositorio.metodosEnvio();
  }
}
