import { Observable } from 'rxjs';
import { CatalogoItem, Categoria, FiltroCatalogo, ImagenProducto, Pagina, ProductoDetalle } from '../models';

export abstract class ProductoRepository {
  abstract listar(filtro: FiltroCatalogo): Observable<Pagina<CatalogoItem>>;
  abstract detalle(id: number): Observable<ProductoDetalle>;
  abstract categorias(): Observable<Categoria[]>;
  /** Las escrituras de imágenes requieren rol Admin. */
  abstract agregarImagen(productoId: number, url: string, principal: boolean): Observable<ImagenProducto[]>;
  abstract hacerPrincipal(productoId: number, indice: number): Observable<ImagenProducto[]>;
  abstract quitarImagen(productoId: number, indice: number): Observable<ImagenProducto[]>;
}
