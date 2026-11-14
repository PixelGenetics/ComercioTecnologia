import { Categoria, GrupoCategorias } from '../models';

/** Solo las categorías hoja (las que tienen productos), agrupadas por su categoría raíz y ordenadas. */
export function agruparCategoriasHoja(categorias: Categoria[]): GrupoCategorias[] {
  const porId = new Map(categorias.map((c) => [c.id, c]));
  const padres = new Set(categorias.map((c) => c.categoriaPadreId).filter((id) => id !== null));
  const raiz = (c: Categoria): Categoria => {
    let actual = c;
    while (actual.categoriaPadreId !== null && porId.has(actual.categoriaPadreId)) {
      actual = porId.get(actual.categoriaPadreId)!;
    }
    return actual;
  };

  const grupos = new Map<string, Categoria[]>();
  for (const c of categorias) {
    if (padres.has(c.id)) continue;
    const nombre = raiz(c).nombre;
    grupos.set(nombre, [...(grupos.get(nombre) ?? []), c]);
  }
  return [...grupos.entries()]
    .map(([nombre, lista]) => ({ nombre, categorias: lista.sort((a, b) => a.nombre.localeCompare(b.nombre)) }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
