import { Observable } from 'rxjs';
import { Carrito } from '../models';

export abstract class CarritoRepository {
  abstract obtener(): Observable<Carrito>;
  abstract agregar(varianteId: number, cantidad: number): Observable<Carrito>;
  abstract actualizar(varianteId: number, cantidad: number): Observable<Carrito>;
  abstract quitar(varianteId: number): Observable<Carrito>;
  abstract vaciar(): Observable<void>;
}
