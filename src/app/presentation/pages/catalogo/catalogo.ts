import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CatalogoService } from '@application/catalogo.service';
import { ErrorApp } from '@domain/errors';
import { CatalogoItem, FiltroCatalogo, GrupoCategorias, Pagina } from '@domain/models';
import { EstadoVacio } from '@presentation/shared/components/estado-vacio/estado-vacio';
import { TarjetaProductoSkeleton } from '@presentation/shared/components/tarjeta-producto-skeleton/tarjeta-producto-skeleton';
import { TarjetaProducto } from '@presentation/shared/components/tarjeta-producto/tarjeta-producto';

const TAMANO_PAGINA = 12;

@Component({
  selector: 'app-catalogo-page',
  imports: [ReactiveFormsModule, TarjetaProducto, TarjetaProductoSkeleton, EstadoVacio],
  templateUrl: './catalogo.html',
})
export class CatalogoPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogo = inject(CatalogoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly resultado = signal<Pagina<CatalogoItem> | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly grupos = signal<GrupoCategorias[]>([]);
  protected readonly placeholders = Array.from({ length: 6 }, (_, i) => i);

  protected readonly form = this.fb.group({
    q: [''],
    categoria: [''],
    marca: [''],
    precioMin: this.fb.control<number | null>(null),
    precioMax: this.fb.control<number | null>(null),
    soloConStock: [false],
  });

  protected readonly totalPaginas = computed(() => {
    const r = this.resultado();
    return r ? Math.max(1, Math.ceil(r.total / r.tamano)) : 1;
  });
  protected readonly paginas = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i + 1));

  constructor() {
    this.catalogo.categoriasParaFiltro().subscribe({ next: (g) => this.grupos.set(g) });

    // La URL es la fuente de verdad de los filtros: se pueden compartir y usar atrás/adelante
    this.route.queryParamMap
      .pipe(
        map(leerFiltro),
        tap((f) => {
          this.form.reset({
            q: f.q ?? '',
            categoria: f.categoria ?? '',
            marca: f.marca ?? '',
            precioMin: f.precioMin ?? null,
            precioMax: f.precioMax ?? null,
            soloConStock: f.soloConStock ?? false,
          });
          this.cargando.set(true);
          this.error.set(null);
        }),
        switchMap((f) =>
          this.catalogo.buscar({ ...f, tamano: TAMANO_PAGINA }).pipe(
            catchError((e: ErrorApp) => {
              this.error.set(e.message);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((r) => {
        this.resultado.set(r);
        this.cargando.set(false);
      });
  }

  protected aplicar(): void {
    const v = this.form.getRawValue();
    this.router.navigate([], {
      queryParams: {
        q: v.q.trim() || null,
        categoria: v.categoria || null,
        marca: v.marca.trim() || null,
        precioMin: v.precioMin ?? null,
        precioMax: v.precioMax ?? null,
        soloConStock: v.soloConStock || null,
      },
    });
  }

  protected limpiar(): void {
    this.router.navigate([], { queryParams: {} });
  }

  protected irAPagina(pagina: number): void {
    this.router.navigate([], { queryParams: { pagina }, queryParamsHandling: 'merge' });
  }
}

function leerFiltro(p: ParamMap): FiltroCatalogo {
  const numero = (clave: string) => {
    const v = p.get(clave);
    return v !== null && v !== '' && !isNaN(+v) ? +v : undefined;
  };
  return {
    q: p.get('q') ?? undefined,
    categoria: p.get('categoria') ?? undefined,
    marca: p.get('marca') ?? undefined,
    precioMin: numero('precioMin'),
    precioMax: numero('precioMax'),
    soloConStock: p.get('soloConStock') === 'true',
    pagina: numero('pagina') ?? 1,
  };
}
