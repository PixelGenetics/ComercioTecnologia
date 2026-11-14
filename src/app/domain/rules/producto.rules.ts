/** Reglas de negocio puras sobre productos (sin Angular ni HTTP). */

export type EstadoStock = 'agotado' | 'bajo' | 'disponible';

/** Con 5 unidades o menos se avisa que quedan pocas. */
export const UMBRAL_STOCK_BAJO = 5;

export function estadoStock(stock: number): EstadoStock {
  if (stock <= 0) return 'agotado';
  if (stock <= UMBRAL_STOCK_BAJO) return 'bajo';
  return 'disponible';
}

/** Porcentaje de descuento entero frente al precio de comparación (0 si no hay). */
export function porcentajeDescuento(precio: number, precioComparacion: number | null): number {
  return precioComparacion && precioComparacion > precio ? Math.round((1 - precio / precioComparacion) * 100) : 0;
}
