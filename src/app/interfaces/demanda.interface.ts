export interface DemandaMvpPayload {
  producto: string;
  anio: number;
  mes: number;
  precio_promedio_kg: number;
}

export interface DemandaMvpResponse {
  producto: string;
  categoria: string;
  anio: number;
  mes: number;
  precio_promedio_kg: number;
  demanda_predicha_kg: number;
  alerta: 'alta' | 'baja' | 'normal';
}
