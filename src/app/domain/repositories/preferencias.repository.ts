import { Tema } from '../models';

export abstract class PreferenciasRepository {
  abstract leerTema(): Tema | null;
  abstract guardarTema(tema: Tema): void;
}
