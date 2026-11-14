import { Provider } from '@angular/core';
import {
  AuthRepository,
  CarritoRepository,
  DireccionRepository,
  PedidoRepository,
  PreferenciasRepository,
  ProductoRepository,
  SesionRepository,
} from '@domain/repositories';
import { AuthHttpRepository } from './repositories/auth.http-repository';
import { CarritoHttpRepository } from './repositories/carrito.http-repository';
import { DireccionHttpRepository } from './repositories/direccion.http-repository';
import { PedidoHttpRepository } from './repositories/pedido.http-repository';
import { ProductoHttpRepository } from './repositories/producto.http-repository';
import { PreferenciasLocalStorage } from './storage/preferencias.local-storage';
import { SesionLocalStorage } from './storage/sesion.local-storage';

/** Une cada contrato del dominio con su implementación. Cambiar de backend = cambiar esta lista. */
export const proveedoresDeDatos: Provider[] = [
  { provide: AuthRepository, useClass: AuthHttpRepository },
  { provide: ProductoRepository, useClass: ProductoHttpRepository },
  { provide: CarritoRepository, useClass: CarritoHttpRepository },
  { provide: PedidoRepository, useClass: PedidoHttpRepository },
  { provide: DireccionRepository, useClass: DireccionHttpRepository },
  { provide: SesionRepository, useClass: SesionLocalStorage },
  { provide: PreferenciasRepository, useClass: PreferenciasLocalStorage },
];
