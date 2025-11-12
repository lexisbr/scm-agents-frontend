import { computed, Injectable, signal } from '@angular/core';
import { AgenteEstado, EstadoAgente } from '../../interfaces/agente.interface';

@Injectable({
  providedIn: 'root',
})
export class AgentStore {
  private readonly agentesSignal = signal<AgenteEstado[]>([
    {
      id: 'prediccion',
      nombre: 'Agente de Predicción',
      descripcion: 'Estimaciones de demanda basadas en modelos MAGA',
      estado: 'warning',
      ultimaActualizacion: new Date().toISOString(),
      endpoint: '/health/orchestrator',
    },
    {
      id: 'cosecha',
      nombre: 'Agente de Cosecha',
      descripcion: 'Planifica y calibra los lotes de cosecha',
      estado: 'warning',
      ultimaActualizacion: new Date().toISOString(),
      endpoint: '/agents/harvest',
    },
    {
      id: 'inventario',
      nombre: 'Agente de Inventario',
      descripcion: 'Monitorea existencias en centros de acopio',
      estado: 'warning',
      ultimaActualizacion: new Date().toISOString(),
      endpoint: '/health/inventory',
    },
    {
      id: 'transporte',
      nombre: 'Agente de Transporte',
      descripcion: 'Gestiona ruteo y ETA de entregas',
      estado: 'warning',
      ultimaActualizacion: new Date().toISOString(),
      endpoint: '/health/route',
    },
  ]);

  readonly agentes = computed(() => this.agentesSignal());

  updateEstado(id: string, estado: EstadoAgente, timestamp = new Date()): void {
    this.agentesSignal.update((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, estado, ultimaActualizacion: timestamp.toISOString() }
          : item
      )
    );
  }

  bulkUpdate(states: Record<string, EstadoAgente>): void {
    const timestamp = new Date();
    this.agentesSignal.update((items) =>
      items.map((item) => ({
        ...item,
        estado: states[item.id] ?? item.estado,
        ultimaActualizacion: timestamp.toISOString(),
      }))
    );
  }
}
