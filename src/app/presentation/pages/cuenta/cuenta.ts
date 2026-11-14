import { Component, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '@application/auth.service';
import { DireccionesService } from '@application/direcciones.service';
import { ErrorApp } from '@domain/errors';
import { Direccion, Usuario } from '@domain/models';
import { Cargando } from '@presentation/shared/components/cargando/cargando';
import { FormDireccion } from '@presentation/shared/components/form-direccion/form-direccion';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';

@Component({
  selector: 'app-cuenta-page',
  imports: [FormDireccion, Cargando],
  templateUrl: './cuenta.html',
})
export class CuentaPage {
  private readonly auth = inject(AuthService);
  private readonly direccionesServicio = inject(DireccionesService);
  private readonly avisos = inject(NotificacionesService);

  protected readonly perfil = signal<Usuario | null>(null);
  protected readonly direcciones = signal<Direccion[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly agregando = signal(false);

  constructor() {
    forkJoin({ perfil: this.auth.perfil(), direcciones: this.direccionesServicio.misDirecciones() }).subscribe({
      next: ({ perfil, direcciones }) => {
        this.perfil.set(perfil);
        this.direcciones.set(direcciones);
        this.cargando.set(false);
      },
      error: (e: ErrorApp) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  protected direccionCreada(d: Direccion): void {
    this.direcciones.update((lista) => this.direccionesServicio.agregarALista(lista, d));
    this.agregando.set(false);
    this.avisos.mostrar('Dirección guardada.');
  }
}
