import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Direccion, DireccionDto } from '@domain/models';
import { DireccionRepository } from '@domain/repositories';

/** Casos de uso de las direcciones del usuario. */
@Injectable({ providedIn: 'root' })
export class DireccionesService {
  private readonly repositorio = inject(DireccionRepository);

  misDirecciones(): Observable<Direccion[]> {
    return this.repositorio.listar();
  }

  crear(dto: DireccionDto): Observable<Direccion> {
    return this.repositorio.crear(dto);
  }

  /** Lista resultante al agregar una dirección: si es principal, las demás dejan de serlo. */
  agregarALista(lista: Direccion[], nueva: Direccion): Direccion[] {
    return [...lista.map((d) => (nueva.esPrincipal ? { ...d, esPrincipal: false } : d)), nueva];
  }
}
