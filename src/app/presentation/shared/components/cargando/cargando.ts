import { Component, input } from '@angular/core';

/** Spinner con texto para cargas de página completa. */
@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.html',
})
export class Cargando {
  readonly texto = input('Cargando…');
}
