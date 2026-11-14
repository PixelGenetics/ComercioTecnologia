import { EstadoPedido } from '../models';

/** Orden en que avanza un pedido (Cancelado queda fuera del recorrido). */
export const PASOS_PEDIDO: readonly EstadoPedido[] = ['Pendiente', 'Pagado', 'Enviado', 'Entregado'];

export function pasoCompletado(estado: EstadoPedido, paso: EstadoPedido): boolean {
  return estado !== 'Cancelado' && PASOS_PEDIDO.indexOf(paso) <= PASOS_PEDIDO.indexOf(estado);
}

export const METODOS_PAGO = ['Tarjeta', 'PayPal', 'Transferencia', 'Efectivo contra entrega'] as const;
