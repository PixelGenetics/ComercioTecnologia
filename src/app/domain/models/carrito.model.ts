export interface CarritoItem {
  varianteId: number;
  sku: string;
  producto: string;
  variante: string | null;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  activo: boolean;
  stock: number;
}

export interface Carrito {
  items: CarritoItem[];
  subtotal: number;
}
