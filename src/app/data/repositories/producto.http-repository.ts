import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CatalogoItem, Categoria, FiltroCatalogo, ImagenProducto, Pagina, ProductoDetalle } from '@domain/models';
import { ProductoRepository } from '@domain/repositories';
import { API_URL } from '../http/api.config';
import { conErrorDeDominio } from '../http/error-http.mapper';

@Injectable()
export class ProductoHttpRepository implements ProductoRepository {
  private readonly http = inject(HttpClient);

  listar(filtro: FiltroCatalogo) {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtro)) {
      if (valor !== undefined && valor !== null && valor !== '' && valor !== false) {
        params = params.set(clave, String(valor));
      }
    }
    return this.http.get<Pagina<CatalogoItem>>(`${API_URL}/productos`, { params }).pipe(conErrorDeDominio());
  }

  detalle(id: number) {
    return this.http.get<ProductoDetalle>(`${API_URL}/productos/${id}`).pipe(conErrorDeDominio());
  }

  categorias() {
    return this.http.get<Categoria[]>(`${API_URL}/categorias`).pipe(conErrorDeDominio());
  }

  agregarImagen(productoId: number, url: string, principal: boolean) {
    return this.http
      .post<ImagenProducto[]>(`${API_URL}/productos/${productoId}/imagenes`, { url, principal })
      .pipe(conErrorDeDominio());
  }

  hacerPrincipal(productoId: number, indice: number) {
    return this.http
      .put<ImagenProducto[]>(`${API_URL}/productos/${productoId}/imagenes/${indice}/principal`, {})
      .pipe(conErrorDeDominio());
  }

  quitarImagen(productoId: number, indice: number) {
    return this.http
      .delete<ImagenProducto[]>(`${API_URL}/productos/${productoId}/imagenes/${indice}`)
      .pipe(conErrorDeDominio());
  }
}
