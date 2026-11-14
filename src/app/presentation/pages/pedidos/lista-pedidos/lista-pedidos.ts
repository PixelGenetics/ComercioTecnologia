import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidosService } from '@application/pedidos.service';
import { ErrorApp } from '@domain/errors';
import { PedidoResumen } from '@domain/models';
import { Cargando } from '@presentation/shared/components/cargando/cargando';
import { EstadoVacio } from '@presentation/shared/components/estado-vacio/estado-vacio';

@Component({
  selector: 'app-lista-pedidos-page',
  imports: [CurrencyPipe, DatePipe, RouterLink, Cargando, EstadoVacio],
  templateUrl: './lista-pedidos.html',
})
export class ListaPedidosPage {
  private readonly servicio = inject(PedidosService);

  protected readonly pedidos = signal<PedidoResumen[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.servicio.misPedidos().subscribe({
      next: (p) => {
        this.pedidos.set(p);
        this.cargando.set(false);
      },
      error: (e: ErrorApp) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }
}
