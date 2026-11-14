import { Injectable } from '@angular/core';
import { Sesion } from '@domain/models';
import { SesionRepository } from '@domain/repositories';

const CLAVE = 'sesion';

/** Guarda la sesión en localStorage. Si el navegador lo bloquea, la sesión dura hasta recargar. */
@Injectable()
export class SesionLocalStorage implements SesionRepository {
  leer(): Sesion | null {
    try {
      const texto = localStorage.getItem(CLAVE);
      return texto ? (JSON.parse(texto) as Sesion) : null;
    } catch {
      return null;
    }
  }

  guardar(sesion: Sesion): void {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(sesion));
    } catch {
      /* sin almacenamiento disponible */
    }
  }

  borrar(): void {
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      /* sin almacenamiento disponible */
    }
  }
}
