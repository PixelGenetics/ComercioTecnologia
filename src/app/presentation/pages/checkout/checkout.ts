import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CarritoService } from '@application/carrito.service';
import { DireccionesService } from '@application/direcciones.service';
import { PedidosService } from '@application/pedidos.service';
import { ErrorApp } from '@domain/errors';
import { Direccion, MetodoEnvio } from '@domain/models';
import { METODOS_PAGO } from '@domain/rules';
import { Cargando } from '@presentation/shared/components/cargando/cargando';
import { EstadoVacio } from '@presentation/shared/components/estado-vacio/estado-vacio';
import { FormDireccion } from '@presentation/shared/components/form-direccion/form-direccion';
import { NotificacionesService } from '@presentation/shared/services/notificaciones.service';

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, FormDireccion, Cargando, EstadoVacio],
  templateUrl: './checkout.html',
})
export class CheckoutPage {
  private readonly carritoServicio = inject(CarritoService);
  private readonly direccionesServicio = inject(DireccionesService);
  private readonly pedidos = inject(PedidosService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NotificacionesService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly carrito = this.carritoServicio.carrito;
  protected readonly direcciones = signal<Direccion[]>([]);
  protected readonly metodos = signal<MetodoEnvio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly errorPedido = signal<string | null>(null);
  protected readonly enviando = signal(false);
  protected readonly nuevaDireccion = signal(false);
  protected readonly metodosPago = METODOS_PAGO;

  protected readonly form = this.fb.group({
    direccionId: this.fb.control<number | null>(null, Validators.required),
    metodoEnvioId: this.fb.control<number | null>(null, Validators.required),
    metodoPago: [METODOS_PAGO[0] as string, Validators.required],
    cupon: ['', Validators.maxLength(40)],
  });
  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly envio = computed(
    () => this.metodos().find((m) => m.id === this.valores().metodoEnvioId)?.costoBase ?? 0,
  );
  protected readonly totalAntesImpuesto = computed(() => (this.carrito()?.subtotal ?? 0) + this.envio());

  constructor() {
    forkJoin({
      carrito: this.carritoServicio.cargar(),
      direcciones: this.direccionesServicio.misDirecciones(),
      metodos: this.pedidos.metodosEnvio(),
    }).subscribe({
      next: ({ direcciones, metodos }) => {
        this.direcciones.set(direcciones);
        this.metodos.set(metodos);
        this.form.patchValue({
          direccionId: (direcciones.find((d) => d.esPrincipal) ?? direcciones[0])?.id ?? null,
          metodoEnvioId: metodos[0]?.id ?? null,
        });
        this.nuevaDireccion.set(direcciones.length === 0);
        this.cargando.set(false);
      },
      error: (e: ErrorApp) => {
        this.error.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  protected direccionCreada(d: Direccion): void {
    this.direcciones.update((lista) => this.direccionesServicio.agregarALista(lista, d));
    this.form.patchValue({ direccionId: d.id });
    this.nuevaDireccion.set(false);
    this.avisos.mostrar('Dirección guardada.');
  }

  protected confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorPedido.set('Elige una dirección y un método de envío.');
      return;
    }
    const v = this.form.getRawValue();
    this.enviando.set(true);
    this.errorPedido.set(null);
    this.pedidos
      .confirmar({
        direccionEnvioId: v.direccionId!,
        metodoEnvioId: v.metodoEnvioId!,
        metodoPago: v.metodoPago,
        codigoCupon: v.cupon,
      })
      .subscribe({
        next: (pedido) => {
          // El backend vacía el carrito al crear el pedido: reflejarlo en el encabezado
          this.carritoServicio.cargar().subscribe({ error: () => {} });
          this.avisos.mostrar(`Pedido #${pedido.id} creado.`);
          this.router.navigate(['/pedidos', pedido.id], { queryParams: { nuevo: 1 } });
        },
        error: (e: ErrorApp) => {
          this.errorPedido.set(e.message);
          this.enviando.set(false);
        },
      });
  }
}
