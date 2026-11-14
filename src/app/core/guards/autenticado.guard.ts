import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@application/auth.service';

/** Solo usuarios con sesión; si no, va al login y vuelve después. */
export const autenticadoGuard: CanActivateFn = (_ruta, estado) => {
  if (inject(AuthService).token) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { volver: estado.url } });
};
