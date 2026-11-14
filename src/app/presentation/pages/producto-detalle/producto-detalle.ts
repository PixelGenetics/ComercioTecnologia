import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AuthService } from '@application/auth.service';
import { CatalogoService } from '@application/catalogo.service';
import { ErrorApp } from '@domain/errors';
import { ImagenProducto, ProductoDetalle, Relacionado, Variante } from '@domain/models';
import { porcentajeDescuento } from '@domain/rules';
import { AdminImagenes } from '@presentation/shared/components/admin-imagenes/admin-imagenes';
import { EstadoVacio } from '@presentation/shared/components/estado-vacio/estado-vacio';
import { AccionCarritoService } from '@presentation/shared/services/accion-carrito.service';
import { stockVisual } from '@presentation/shared/utils/stock-visual';

@Component({
  selector: 'app-producto-detalle-page',
  imports: [CurrencyPipe, RouterLink, AdminImagenes, EstadoVacio],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetallePage {
  private readonly catalogo = inject(CatalogoService);
  private readonly accionCarrito = inject(AccionCarritoService);
  private readonly titulo = inject(Title);
  protected readonly auth = inject(AuthService);

  /** Parámetro de ruta :id */
  readonly id = input.required<string>();

  protected readonly producto = signal<ProductoDetalle | null>(null);
  protected readonly relacionados = signal<Relacionado[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly varianteId = signal<number | null>(null);
  protected readonly cantidad = signal(1);
  protected readonly agregando = signal(false);
  /** Miniatura elegida por el usuario (null = la de la variante o la principal) */
  protected readonly seleccion = signal<string | null>(null);
  /** URLs que no cargaron: se ocultan y se usa la marca como respaldo */
  protected readonly rotas = signal<ReadonlySet<string>>(new Set());

  protected readonly variante = computed<Variante | null>(
    () => this.producto()?.variantes.find((v) => v.id === this.varianteId()) ?? null,
  );
  protected readonly maximo = computed(() => Math.min(this.variante()?.stock ?? 0, 100));
  protected readonly descuento = computed(() => {
    const v = this.variante();
    return v ? porcentajeDescuento(v.precio, v.precioComparacion) : 0;
  });
  protected readonly stock = computed(() => stockVisual(this.variante()?.stock ?? 0, true));
  protected readonly imagenes = computed<ImagenProducto[]>(() => this.producto()?.imagenes ?? []);
  /** Fotos de la galería: la de la variante (si tiene) y las del producto, sin repetir ni rotas */
  protected readonly fotos = computed(() => {
    const urls = [this.variante()?.imagenUrl, ...this.imagenes().map((i) => i.url)].filter(
      (u): u is string => !!u && !this.rotas().has(u),
    );
    return [...new Set(urls)];
  });
  protected readonly imagen = computed(() => {
    const elegida = this.seleccion();
    if (elegida && this.fotos().includes(elegida)) return elegida;
    const principal = this.imagenes().find((i) => i.principal)?.url;
    return (
      this.fotos().find((u) => u === this.variante()?.imagenUrl) ??
      this.fotos().find((u) => u === principal) ??
      this.fotos()[0] ??
      null
    );
  });
  protected readonly especificaciones = computed(() => Object.entries(this.producto()?.especificaciones ?? {}));

  constructor() {
    // Se vuelve a cargar si cambia el :id (p. ej. al abrir un producto relacionado)
    effect((onCleanup) => {
      const id = Number(this.id());
      this.cargando.set(true);
      this.error.set(null);
      this.relacionados.set([]);
      this.seleccion.set(null);
      this.rotas.set(new Set());

      const sub = this.catalogo.detalle(id).subscribe({
        next: (p) => this.mostrar(p),
        error: (e: ErrorApp) => {
          this.producto.set(null);
          this.error.set(e.codigo === 'no-encontrado' ? 'Este producto no existe o ya no está disponible.' : e.message);
          this.cargando.set(false);
        },
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  protected elegirVariante(v: Variante): void {
    this.varianteId.set(v.id);
    this.cantidad.set(1);
    this.seleccion.set(null);
  }

  protected imagenRota(url: string): void {
    this.rotas.update((s) => new Set(s).add(url));
  }

  /** El panel de administración devuelve la lista nueva de imágenes */
  protected imagenesCambiaron(lista: ImagenProducto[]): void {
    this.producto.update((p) => (p ? { ...p, imagenes: lista } : p));
    this.rotas.set(new Set());
    this.seleccion.set(null);
  }

  protected cambiarCantidad(delta: number): void {
    this.cantidad.update((c) => Math.min(Math.max(c + delta, 1), Math.max(this.maximo(), 1)));
  }

  protected agregar(): void {
    const p = this.producto();
    const v = this.variante();
    if (!p || !v) return;
    this.agregando.set(true);
    const nombre = v.nombre ? `${p.nombre} (${v.nombre})` : p.nombre;
    this.accionCarrito.agregar(v.id, this.cantidad(), nombre, () => this.agregando.set(false));
  }

  private mostrar(p: ProductoDetalle): void {
    this.producto.set(p);
    this.titulo.setTitle(`${p.nombre} · Comercio de Tecnología`);
    const inicial = p.variantes.find((v) => v.stock > 0) ?? p.variantes[0];
    this.varianteId.set(inicial?.id ?? null);
    this.cantidad.set(1);
    this.cargando.set(false);
    this.catalogo.relacionados(p).subscribe((r) => this.relacionados.set(r));
  }
}
