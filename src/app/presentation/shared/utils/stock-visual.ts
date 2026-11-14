import { estadoStock } from '@domain/rules';

export interface StockVisual {
  clase: string;
  texto: string;
}

/** Badge que corresponde al stock (la regla de "stock bajo" vive en el dominio). */
export function stockVisual(stock: number, conUnidades = false): StockVisual {
  switch (estadoStock(stock)) {
    case 'agotado':
      return { clase: 'badge badge-agotado', texto: 'Agotado' };
    case 'bajo':
      return { clase: 'badge badge-stock-bajo', texto: `Quedan ${stock}` };
    default:
      return { clase: 'badge badge-stock-ok', texto: conUnidades ? `Disponible · ${stock} unidades` : 'Disponible' };
  }
}
