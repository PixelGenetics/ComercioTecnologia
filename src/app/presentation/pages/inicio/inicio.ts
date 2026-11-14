import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '@application/catalogo.service';
import { ErrorApp } from '@domain/errors';
import { CatalogoItem } from '@domain/models';
import { TarjetaProductoSkeleton } from '@presentation/shared/components/tarjeta-producto-skeleton/tarjeta-producto-skeleton';
import { TarjetaProducto } from '@presentation/shared/components/tarjeta-producto/tarjeta-producto';

@Component({
  selector: 'app-inicio-page',
  imports: [RouterLink, TarjetaProducto, TarjetaProductoSkeleton],
  templateUrl: './inicio.html',
})
export class InicioPage implements OnInit {
  private readonly catalogo = inject(CatalogoService);

  protected readonly items = signal<CatalogoItem[]>([]);
  protected readonly total = signal(0);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly placeholders = Array.from({ length: 8 }, (_, i) => i);

  ngOnInit(): void {
    this.catalogo.buscar({ soloConStock: true, tamano: 8 }).subscribe({
      next: (pagina) => {
        this.items.set(pagina.items);
        this.total.set(pagina.total);
        this.cargando.set(false);
      },
      error: (e: ErrorApp) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }
}
