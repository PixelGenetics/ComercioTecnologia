/** Respuesta paginada de la API. */
export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  tamano: number;
}
