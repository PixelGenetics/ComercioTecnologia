import { Injectable, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Tema } from '@domain/models';
import { PreferenciasRepository } from '@domain/repositories';

/** Tema claro/oscuro: lo aplica en <html data-theme="..."> y lo recuerda entre visitas. */
@Injectable({ providedIn: 'root' })
export class TemaService {
  private readonly doc = inject(DOCUMENT);
  private readonly preferencias = inject(PreferenciasRepository);

  readonly tema = signal<Tema>(this.preferencias.leerTema() ?? this.temaDelSistema());

  constructor() {
    effect(() => {
      const tema = this.tema();
      this.doc.documentElement.dataset['theme'] = tema;
      this.preferencias.guardarTema(tema);
    });
  }

  alternar(): void {
    this.tema.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private temaDelSistema(): Tema {
    return this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
