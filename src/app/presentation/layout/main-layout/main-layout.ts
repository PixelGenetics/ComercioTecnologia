import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Avisos } from '../avisos/avisos';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/** Plantilla de todas las páginas: encabezado, contenido, pie y avisos flotantes. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, Avisos],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
