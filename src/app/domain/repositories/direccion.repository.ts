import { Observable } from 'rxjs';
import { Direccion, DireccionDto } from '../models';

export abstract class DireccionRepository {
  abstract listar(): Observable<Direccion[]>;
  abstract crear(dto: DireccionDto): Observable<Direccion>;
}
