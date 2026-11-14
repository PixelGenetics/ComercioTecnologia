import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  texto: string;
  tipo: 'ok' | 'error' | 'info';
}

/** Avisos flotantes (toasts) que desaparecen solos. Los muestra el layout. */
@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private siguienteId = 1;
  private readonly estado = signal<Notificacion[]>([]);
  readonly lista = this.estado.asReadonly();

  mostrar(texto: string, tipo: Notificacion['tipo'] = 'ok', duracionMs = 3500): void {
    const id = this.siguienteId++;
    this.estado.update((l) => [...l, { id, texto, tipo }]);
    setTimeout(() => this.cerrar(id), duracionMs);
  }

  cerrar(id: number): void {
    this.estado.update((l) => l.filter((n) => n.id !== id));
  }
}
