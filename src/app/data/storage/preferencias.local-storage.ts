import { Injectable } from '@angular/core';
import { Tema } from '@domain/models';
import { PreferenciasRepository } from '@domain/repositories';

const CLAVE_TEMA = 'tema';

@Injectable()
export class PreferenciasLocalStorage implements PreferenciasRepository {
  leerTema(): Tema | null {
    try {
      const valor = localStorage.getItem(CLAVE_TEMA);
      return valor === 'light' || valor === 'dark' ? valor : null;
    } catch {
      return null;
    }
  }

  guardarTema(tema: Tema): void {
    try {
      localStorage.setItem(CLAVE_TEMA, tema);
    } catch {
      /* sin almacenamiento: el tema solo dura esta sesión */
    }
  }
}
