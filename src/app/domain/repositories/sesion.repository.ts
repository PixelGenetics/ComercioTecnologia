import { Sesion } from '../models';

/** Dónde se guarda la sesión entre visitas. */
export abstract class SesionRepository {
  abstract leer(): Sesion | null;
  abstract guardar(sesion: Sesion): void;
  abstract borrar(): void;
}
