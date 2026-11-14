import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '@application/auth.service';
import { CarritoService } from '@application/carrito.service';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';
import { TemaService } from '@presentation/shared/services/tema.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  private readonly router = inject(Router);
  private readonly avisos = inject(NotificacionesService);
  protected readonly auth = inject(AuthService);
  protected readonly carrito = inject(CarritoService);
  protected readonly tema = inject(TemaService);

  protected readonly menuAbierto = signal(false);

  constructor() {
    // Cierra el menú móvil al navegar
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuAbierto.set(false));
  }

  protected primerNombre(nombre: string): string {
    return nombre.split(' ')[0];
  }

  protected salir(): void {
    this.auth.cerrarSesion();
    this.avisos.mostrar('Sesión cerrada.', 'info');
    this.router.navigate(['/']);
  }
}
