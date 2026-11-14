import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRespuesta, RegistroDto, Usuario } from '@domain/models';
import { AuthRepository } from '@domain/repositories';
import { API_URL } from '../http/api.config';
import { conErrorDeDominio } from '../http/error-http.mapper';

@Injectable()
export class AuthHttpRepository implements AuthRepository {
  private readonly http = inject(HttpClient);

  login(correo: string, password: string) {
    return this.http.post<AuthRespuesta>(`${API_URL}/auth/login`, { correo, password }).pipe(conErrorDeDominio());
  }

  registro(dto: RegistroDto) {
    return this.http.post<AuthRespuesta>(`${API_URL}/auth/registro`, dto).pipe(conErrorDeDominio());
  }

  perfil() {
    return this.http.get<Usuario>(`${API_URL}/auth/perfil`).pipe(conErrorDeDominio());
  }
}
