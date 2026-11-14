export interface Direccion {
  id: number;
  alias: string | null;
  calle: string;
  ciudad: string;
  estado: string | null;
  codigoPostal: string | null;
  pais: string;
  esPrincipal: boolean;
}

export type DireccionDto = Omit<Direccion, 'id'>;
