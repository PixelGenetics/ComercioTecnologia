import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@application/auth.service';
import { API_URL } from '@data/http/api.config';

/** Agrega el JWT a las llamadas a la API y cierra la sesión si la API responde 401 con token. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = req.url.startsWith(API_URL) ? auth.token : null;

  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((e: unknown) => {
      if (e instanceof HttpErrorResponse && e.status === 401 && token) {
        auth.cerrarSesion();
        router.navigate(['/login'], { queryParams: { volver: router.url, expirada: 1 } });
      }
      return throwError(() => e);
    }),
  );
};
