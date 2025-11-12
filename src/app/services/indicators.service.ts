import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface DashboardIndicator {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class IndicatorsService {
  getIndicators(): Observable<DashboardIndicator[]> {
    const indicators: DashboardIndicator[] = [
      {
        id: 'otif',
        label: 'Eficiencia Operativa (OTIF)',
        value: 93.4,
        unit: '%',
        trend: 3.1,
        description: 'Entregas a tiempo dentro del periodo móvil de 30 días.',
      },
      {
        id: 'merma',
        label: 'Reducción de pérdidas postcosecha',
        value: 18.6,
        unit: '%',
        trend: -1.2,
        description: 'Merma evitada gracias a las recomendaciones de cosecha.',
      },
      {
        id: 'roi',
        label: 'Rentabilidad (ROI)',
        value: 24.3,
        unit: '%',
        trend: 2.4,
        description: 'Retorno de inversión del piloto multiagente.',
      },
      {
        id: 'ambiental',
        label: 'Impacto ambiental',
        value: 31.0,
        unit: '%',
        trend: 5.6,
        description: 'Disminución de desperdicio en transporte y almacenamiento.',
      },
      {
        id: 'satisfaccion',
        label: 'Satisfacción del cliente',
        value: 89.0,
        unit: '%',
        trend: 4.1,
        description: 'Aceptación en mercados mayoristas y minoristas.',
      },
    ];

    return of(indicators);
  }

  getKpiSeries(): Observable<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string }[];
  }> {
    return of({
      labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
      datasets: [
        {
          label: 'OTIF',
          data: [88, 90, 91, 92, 93, 94],
          borderColor: '#3B873E',
        },
        {
          label: 'Merma evitada',
          data: [10, 12, 14, 16, 18, 19],
          borderColor: '#6FBF73',
        },
      ],
    });
  }
}
