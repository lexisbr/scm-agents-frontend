import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'demanda',
    loadChildren: () =>
      import('./modules/demanda/demanda.routes').then(
        (m) => m.DEMANDA_ROUTES
      ),
  },
  {
    path: 'planificacion',
    loadChildren: () =>
      import('./modules/planificacion/planificacion.routes').then(
        (m) => m.PLANIFICACION_ROUTES
      ),
  },
  {
    path: 'transporte',
    loadChildren: () =>
      import('./modules/transporte/transporte.routes').then(
        (m) => m.TRANSPORTE_ROUTES
      ),
  },
  {
    path: 'inventario',
    loadChildren: () =>
      import('./modules/inventario/inventario.routes').then(
        (m) => m.INVENTARIO_ROUTES
      ),
  },
  {
    path: 'configuracion',
    loadChildren: () =>
      import('./modules/configuracion/configuracion.routes').then(
        (m) => m.CONFIGURACION_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
