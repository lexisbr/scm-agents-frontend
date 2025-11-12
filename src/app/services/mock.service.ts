import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { InventarioItem } from '../interfaces/inventario.interface';
import { ViajeTransporte } from '../interfaces/transporte.interface';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  getInventario(): Observable<InventarioItem[]> {
    const dataset: InventarioItem[] = [
      {
        id: 'INV-001',
        producto: 'Tomate Roma',
        stock_kg: 4200,
        unidad: 'kg',
        rotacion: 'Alta',
        estado: 'estable',
      },
      {
        id: 'INV-002',
        producto: 'Papa Criolla',
        stock_kg: 1150,
        unidad: 'kg',
        rotacion: 'Media',
        estado: 'critico',
      },
      {
        id: 'INV-003',
        producto: 'Zanahoria Nantesa',
        stock_kg: 3800,
        unidad: 'kg',
        rotacion: 'Alta',
        estado: 'estable',
      },
      {
        id: 'INV-004',
        producto: 'Brócoli',
        stock_kg: 820,
        unidad: 'kg',
        rotacion: 'Baja',
        estado: 'critico',
      },
    ];

    return of(dataset).pipe(delay(300));
  }

  getRutas(): Observable<ViajeTransporte[]> {
    const rutas: ViajeTransporte[] = [
      {
        idViaje: 'RT-0981',
        origen: 'Salcajá',
        destino: 'Mercado La Democracia',
        producto: 'Tomate',
        estado: 'en-ruta',
        eta: '2h 15m',
        distanciaKm: 18,
        coordenadas: [
          { lat: 14.8762, lng: -91.5232 },
          { lat: 14.845, lng: -91.518 },
          { lat: 14.835, lng: -91.514 },
        ],
      },
      {
        idViaje: 'RT-1044',
        origen: 'Cantel',
        destino: 'CUC Quetzaltenango',
        producto: 'Papa',
        estado: 'programado',
        eta: '4h 30m',
        distanciaKm: 36,
        coordenadas: [
          { lat: 14.828, lng: -91.488 },
          { lat: 14.85, lng: -91.478 },
          { lat: 14.86, lng: -91.462 },
        ],
      },
      {
        idViaje: 'RT-1160',
        origen: 'Almolonga',
        destino: 'Terminal Minerva',
        producto: 'Zanahoria',
        estado: 'retrasado',
        eta: '3h 40m',
        distanciaKm: 22,
        coordenadas: [
          { lat: 14.81, lng: -91.51 },
          { lat: 14.82, lng: -91.5 },
          { lat: 14.845, lng: -91.49 },
        ],
      },
    ];

    return of(rutas).pipe(delay(300));
  }
}
