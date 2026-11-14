import { Sesion } from '../models';

export function sesionVigente(sesion: Sesion | null, ahora = new Date()): boolean {
  return !!sesion?.token && new Date(sesion.expira) > ahora;
}

export function esAdministrador(sesion: Sesion | null): boolean {
  return sesion?.usuario.roles.includes('Admin') ?? false;
}
