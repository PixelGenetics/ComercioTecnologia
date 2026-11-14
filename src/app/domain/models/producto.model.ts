/** Fila del catálogo: una por variante (vista vw_catalogo). */
export interface CatalogoItem {
  productoId: number;
  producto: string;
  varianteId: number;
  sku: string;
  nombreVariante: string | null;
  marca: string;
  categoria: string;
  precio: number;
  precioComparacion: number | null;
  stockTotal: number;
  garantiaMeses: number;
  /** Imagen de la variante o, si no tiene, la principal del producto */
  imagen: string | null;
}

export interface FiltroCatalogo {
  q?: string;
  categoria?: string;
  marca?: string;
  precioMin?: number;
  precioMax?: number;
  soloConStock?: boolean;
  pagina?: number;
  tamano?: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  categoriaPadreId: number | null;
}

export interface GrupoCategorias {
  nombre: string;
  categorias: Categoria[];
}

export interface Variante {
  id: number;
  sku: string;
  nombre: string | null;
  precio: number;
  precioComparacion: number | null;
  stock: number;
  imagenUrl: string | null;
}

export interface ImagenProducto {
  url: string;
  orden: number;
  principal: boolean;
}

export interface ProductoRelacionado {
  id: number;
  tipo: string;
}

export interface ProductoDetalle {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  marca: string;
  categoria: string;
  garantiaMeses: number;
  especificaciones: Record<string, string> | null;
  imagenes: ImagenProducto[] | null;
  relacionados: ProductoRelacionado[] | null;
  variantes: Variante[];
}

/** Producto relacionado ya resuelto, listo para mostrar. */
export interface Relacionado {
  producto: ProductoDetalle;
  tipo: string;
  desde: number;
}
