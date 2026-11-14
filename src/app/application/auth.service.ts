import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AuthRespuesta, RegistroDto, Sesion, Usuario } from '@domain/models';
import { AuthRepository, SesionRepository } from '@domain/repositories';
import { esAdministrador, sesionVigente } from '@domain/rules';

/** Casos de uso de autenticación y estado de la sesión actual. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly repositorio = inject(AuthRepository);
  private readonly almacen = inject(SesionRepository);
  private readonly sesion = signal<Sesion | null>(this.sesionGuardada());

  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly autenticado = computed(() => this.sesion() !== null);
  readonly esAdmin = computed(() => esAdministrador(this.sesion()));

  /** Token vigente o null. Si ya expiró, cierra la sesión. */
  get token(): string | null {
    const s = this.sesion();
    if (s && !sesionVigente(s)) {
      this.cerrarSesion();
      return null;
    }
    return s?.token ?? null;
  }

  login(correo: string, password: string): Observable<Usuario> {
    return this.repositorio.login(correo, password).pipe(
      tap((r) => this.iniciar(r)),
      map((r) => r.usuario),
    );
  }

  registro(dto: RegistroDto): Observable<Usuario> {
    return this.repositorio.registro(dto).pipe(
      tap((r) => this.iniciar(r)),
      map((r) => r.usuario),
    );
  }

  perfil(): Observable<Usuario> {
    return this.repositorio.perfil();
  }

  cerrarSesion(): void {
    this.sesion.set(null);
    this.almacen.borrar();
  }

  private iniciar(r: AuthRespuesta): void {
    const sesion: Sesion = { token: r.token, expira: r.expira, usuario: r.usuario };
    this.sesion.set(sesion);
    this.almacen.guardar(sesion);
  }

  private sesionGuardada(): Sesion | null {
    const guardada = this.almacen.leer();
    if (sesionVigente(guardada)) return guardada;
    this.almacen.borrar();
    return null;
  }
}
