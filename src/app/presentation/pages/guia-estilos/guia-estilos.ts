import { Component } from '@angular/core';
import { EstadoPedido } from '@domain/models';
import { Cargando } from '@presentation/shared/components/cargando/cargando';
import { EstadoVacio } from '@presentation/shared/components/estado-vacio/estado-vacio';

/** Muestra todas las clases de la plantilla de estilos (src/styles) como referencia. */
@Component({
  selector: 'app-guia-estilos-page',
  imports: [Cargando, EstadoVacio],
  templateUrl: './guia-estilos.html',
})
export class GuiaEstilosPage {
  protected readonly estados: EstadoPedido[] = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];
}
