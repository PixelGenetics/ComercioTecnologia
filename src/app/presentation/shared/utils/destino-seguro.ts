/** Solo rutas internas para el parámetro ?volver=, para no redirigir a otro sitio. */
export function destinoSeguro(url: string | undefined): string {
  return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
}
