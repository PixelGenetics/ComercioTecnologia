import { Routes } from '@angular/router';
import { autenticadoGuard } from '@core/guards/autenticado.guard';
import { invitadoGuard } from '@core/guards/invitado.guard';
import { MainLayout } from '@presentation/layout/main-layout/main-layout';

const titulo = (pagina: string) => `${pagina} · Comercio de Tecnología`;

/** Todas las páginas cuelgan de la plantilla principal (encabezado + pie). */
export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        title: titulo('Inicio'),
        loadComponent: () => import('@presentation/pages/inicio/inicio').then((m) => m.InicioPage),
      },
      {
        path: 'catalogo',
        title: titulo('Catálogo'),
        loadComponent: () => import('@presentation/pages/catalogo/catalogo').then((m) => m.CatalogoPage),
      },
      {
        path: 'productos/:id',
        title: titulo('Producto'),
        loadComponent: () =>
          import('@presentation/pages/producto-detalle/producto-detalle').then((m) => m.ProductoDetallePage),
      },
      {
        path: 'login',
        title: titulo('Iniciar sesión'),
        canActivate: [invitadoGuard],
        loadComponent: () => import('@presentation/pages/auth/login/login').then((m) => m.LoginPage),
      },
      {
        path: 'registro',
        title: titulo('Crear cuenta'),
        canActivate: [invitadoGuard],
        loadComponent: () => import('@presentation/pages/auth/registro/registro').then((m) => m.RegistroPage),
      },
      {
        path: 'carrito',
        title: titulo('Carrito'),
        canActivate: [autenticadoGuard],
        loadComponent: () => import('@presentation/pages/carrito/carrito').then((m) => m.CarritoPage),
      },
      {
        path: 'checkout',
        title: titulo('Checkout'),
        canActivate: [autenticadoGuard],
        loadComponent: () => import('@presentation/pages/checkout/checkout').then((m) => m.CheckoutPage),
      },
      {
        path: 'pedidos',
        title: titulo('Mis pedidos'),
        canActivate: [autenticadoGuard],
        loadComponent: () =>
          import('@presentation/pages/pedidos/lista-pedidos/lista-pedidos').then((m) => m.ListaPedidosPage),
      },
      {
        path: 'pedidos/:id',
        title: titulo('Pedido'),
        canActivate: [autenticadoGuard],
        loadComponent: () =>
          import('@presentation/pages/pedidos/detalle-pedido/detalle-pedido').then((m) => m.DetallePedidoPage),
      },
      {
        path: 'cuenta',
        title: titulo('Mi cuenta'),
        canActivate: [autenticadoGuard],
        loadComponent: () => import('@presentation/pages/cuenta/cuenta').then((m) => m.CuentaPage),
      },
      {
        path: 'estilos',
        title: titulo('Guía de estilos'),
        loadComponent: () => import('@presentation/pages/guia-estilos/guia-estilos').then((m) => m.GuiaEstilosPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
