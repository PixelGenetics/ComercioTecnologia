import { Observable } from 'rxjs';
import { CrearPedidoDto, MetodoEnvio, PedidoDetalle, PedidoResumen } from '../models';

export abstract class PedidoRepository {
  abstract crear(dto: CrearPedidoDto): Observable<PedidoDetalle>;
  abstract listar(): Observable<PedidoResumen[]>;
  abstract detalle(id: number): Observable<PedidoDetalle>;
  abstract metodosEnvio(): Observable<MetodoEnvio[]>;
}
