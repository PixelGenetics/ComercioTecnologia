export type EstadoPedido = 'Pendiente' | 'Pagado' | 'Enviado' | 'Entregado' | 'Cancelado';

export interface MetodoEnvio {
  id: number;
  nombre: string;
  costoBase: number;
  tiempoEstimadoDias: number;
}

export interface CrearPedidoDto {
  direccionEnvioId: number;
  metodoEnvioId: number;
  metodoPago: string;
  codigoCupon?: string | null;
}

export interface PedidoResumen {
  id: number;
  estado: EstadoPedido;
  total: number;
  metodoPago: string;
  creadoEn: string;
}

export interface LineaPedido {
  varianteId: number;
  sku: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDetalle {
  id: number;
  estado: EstadoPedido;
  subtotal: number;
  descuento: number;
  impuesto: number;
  costoEnvio: number;
  total: number;
  metodoPago: string;
  creadoEn: string;
  lineas: LineaPedido[];
}
