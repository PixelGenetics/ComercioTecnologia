import { Component, input } from '@angular/core';

/** Tarjeta para "no hay nada aquí" / "no encontrado". El texto y las acciones van dentro. */
@Component({
  selector: 'app-estado-vacio',
  templateUrl: './estado-vacio.html',
})
export class EstadoVacio {
  readonly icono = input('?');
  readonly titulo = input.required<string>();
}
