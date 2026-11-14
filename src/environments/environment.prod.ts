/**
 * Producción (`npm run build`): el navegador llama directo a la API publicada en Render.
 * Si tu servicio de Render tiene otra URL, cámbiala aquí y permite el dominio del
 * frontend en la API con la variable Cors__Origins__0.
 */
export const environment = {
  production: true,
  apiUrl: 'https://comerciotecnologia-api.onrender.com/api',
};
