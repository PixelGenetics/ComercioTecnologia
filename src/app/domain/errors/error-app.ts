/** Tipo de fallo, independiente de cómo se comunicó (HTTP, almacenamiento, etc.). */
export type CodigoError =
  | 'sin-conexion'
  | 'no-autorizado'
  | 'sin-permiso'
  | 'no-encontrado'
  | 'conflicto'
  | 'validacion'
  | 'desconocido';

/** Error que reciben la aplicación y la presentación. `message` ya es legible para el usuario. */
export class ErrorApp extends Error {
  constructor(
    message: string,
    readonly codigo: CodigoError,
  ) {
    super(message);
    this.name = 'ErrorApp';
  }
}
