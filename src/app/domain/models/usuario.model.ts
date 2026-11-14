export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  roles: string[];
}

export interface AuthRespuesta {
  token: string;
  expira: string;
  usuario: Usuario;
}

export interface RegistroDto {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string | null;
}

/** Sesión guardada en el cliente. */
export interface Sesion {
  token: string;
  expira: string;
  usuario: Usuario;
}
