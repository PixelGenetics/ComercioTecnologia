import { Component, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidosService } from '@application/pedidos.service';
import { ErrorApp } from '@domain/errors';
import { EstadoPedido, PedidoDetalle } from '@domain/models';
import { PASOS_PEDIDO, pasoCompletado } from '@domain/rules';
import { Cargando } from '@presentation/shared/components/cargando/cargando';
import { EstadoVacio } from '@presentation/shared/components/estado-vacio/estado-vacio';

@Component({
  selector: 'app-detalle-pedido-page',
  imports: [CurrencyPipe, DatePipe, RouterLink, Cargando, EstadoVacio],
  templateUrl: './detalle-pedido.html',
})
export class DetallePedidoPage {
  private readonly servicio = inject(PedidosService);

  /** Parámetro :id y query param ?nuevo=1 (recién creado en el checkout) */
  readonly id = input.required<string>();
  readonly nuevo = input<string>();

  protected readonly pedido = signal<PedidoDetalle | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pasos = PASOS_PEDIDO;

  constructor() {
    effect((onCleanup) => {
      const id = Number(this.id());
      this.cargando.set(true);
      this.error.set(null);
      const sub = this.servicio.detalle(id).subscribe({
        next: (p) => {
          this.pedido.set(p);
          this.cargando.set(false);
        },
        error: (e: ErrorApp) => {
          this.error.set(e.codigo === 'no-encontrado' ? 'No encontramos este pedido.' : e.message);
          this.cargando.set(false);
        },
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  protected completado(estado: EstadoPedido, paso: EstadoPedido): boolean {
    return pasoCompletado(estado, paso);
  }
}
