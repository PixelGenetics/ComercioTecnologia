import { environment } from '../../../environments/environment';

/**
 * Base de la API.
 * - Desarrollo: '/api', que `ng serve` reenvía a la API local (proxy.conf.json).
 * - Producción: la URL pública de la API (src/environments/environment.prod.ts).
 */
export const API_URL = environment.apiUrl;
export const ES_PRODUCCION = environment.production;
