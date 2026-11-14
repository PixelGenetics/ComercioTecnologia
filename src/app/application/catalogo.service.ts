import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import {
  CatalogoItem,
  FiltroCatalogo,
  GrupoCategorias,
  ImagenProducto,
  Pagina,
  ProductoDetalle,
  Relacionado,
} from '@domain/models';
import { ProductoRepository } from '@domain/repositories';
import { agruparCategoriasHoja } from '@domain/rules';

/** Casos de uso del catálogo: búsqueda, detalle, categorías e imágenes (admin). */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly repositorio = inject(ProductoRepository);

  buscar(filtro: FiltroCatalogo): Observable<Pagina<CatalogoItem>> {
    return this.repositorio.listar(filtro);
  }

  detalle(id: number): Observable<ProductoDetalle> {
    return this.repositorio.detalle(id);
  }

  /** Categorías con productos, agrupadas por su categoría raíz (para el filtro). */
  categoriasParaFiltro(): Observable<GrupoCategorias[]> {
    return this.repositorio.categorias().pipe(map(agruparCategoriasHoja));
  }

  /** Resuelve los productos relacionados; los que fallen se omiten. */
  relacionados(producto: ProductoDetalle): Observable<Relacionado[]> {
    const lista = producto.relacionados ?? [];
    if (lista.length === 0) return of([]);
    return forkJoin(lista.map((r) => this.repositorio.detalle(r.id).pipe(catchError(() => of(null))))).pipe(
      map((detalles) =>
        detalles.flatMap((d, i) =>
          d ? [{ producto: d, tipo: lista[i].tipo, desde: Math.min(...d.variantes.map((v) => v.precio)) }] : [],
        ),
      ),
    );
  }

  agregarImagen(productoId: number, url: string, principal: boolean): Observable<ImagenProducto[]> {
    return this.repositorio.agregarImagen(productoId, url.trim(), principal);
  }

  hacerPrincipal(productoId: number, indice: number): Observable<ImagenProducto[]> {
    return this.repositorio.hacerPrincipal(productoId, indice);
  }

  quitarImagen(productoId: number, indice: number): Observable<ImagenProducto[]> {
    return this.repositorio.quitarImagen(productoId, indice);
  }
}
