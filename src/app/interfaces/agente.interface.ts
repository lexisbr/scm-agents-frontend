export type EstadoAgente = 'ready' | 'offline' | 'warning';

export interface AgenteEstado {
  id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoAgente;
  ultimaActualizacion: string;
  endpoint: string;
}
