import { Observable } from 'rxjs';
import { AuthRespuesta, RegistroDto, Usuario } from '../models';

export abstract class AuthRepository {
  abstract login(correo: string, password: string): Observable<AuthRespuesta>;
  abstract registro(dto: RegistroDto): Observable<AuthRespuesta>;
  abstract perfil(): Observable<Usuario>;
}
