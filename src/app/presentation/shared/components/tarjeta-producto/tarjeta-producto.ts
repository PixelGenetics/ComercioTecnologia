import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogoItem } from '@domain/models';
import { porcentajeDescuento } from '@domain/rules';
import { AccionCarritoService } from '@presentation/shared/services/accion-carrito.service';
import { stockVisual } from '@presentation/shared/utils/stock-visual';

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './tarjeta-producto.html',
})
export class TarjetaProducto {
  private readonly accionCarrito = inject(AccionCarritoService);

  readonly item = input.required<CatalogoItem>();
  protected readonly agregando = signal(false);
  /** Si la URL de la imagen no carga, se muestra la marca en su lugar */
  protected readonly imagenRota = signal(false);

  protected readonly descuento = computed(() => porcentajeDescuento(this.item().precio, this.item().precioComparacion));
  protected readonly stock = computed(() => stockVisual(this.item().stockTotal));

  protected agregar(): void {
    const i = this.item();
    this.agregando.set(true);
    this.accionCarrito.agregar(i.varianteId, 1, i.producto, () => this.agregando.set(false));
  }
}
