import { Component, inject } from '@angular/core';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';

/** Contenedor de los avisos flotantes (toasts). */
@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.html',
})
export class Avisos {
  protected readonly notificaciones = inject(NotificacionesService);
}
