import { HttpErrorResponse } from '@angular/common/http';
import { MonoTypeOperatorFunction, catchError, throwError } from 'rxjs';
import { CodigoError, ErrorApp } from '@domain/errors';

const SIN_CONEXION = 'No se pudo conectar con la API. Verifica que esté corriendo en http://localhost:53654.';

const CODIGOS: Record<number, CodigoError> = {
  400: 'validacion',
  401: 'no-autorizado',
  403: 'sin-permiso',
  404: 'no-encontrado',
  409: 'conflicto',
};

/** Convierte un error HTTP (ProblemDetails de la API o fallo de red) en un ErrorApp del dominio. */
export function mapearErrorHttp(e: unknown): ErrorApp {
  if (!(e instanceof HttpErrorResponse)) return new ErrorApp('Ocurrió un error inesperado.', 'desconocido');

  const titulo: string | undefined = e.error?.title;
  if (!titulo && [0, 500, 502, 503, 504].includes(e.status)) return new ErrorApp(SIN_CONEXION, 'sin-conexion');

  return new ErrorApp(titulo ?? e.message, CODIGOS[e.status] ?? 'desconocido');
}

/** Operador para las llamadas HTTP de los repositorios: nunca deja salir un HttpErrorResponse. */
export function conErrorDeDominio<T>(): MonoTypeOperatorFunction<T> {
  return catchError((e: unknown) => throwError(() => mapearErrorHttp(e)));
}
