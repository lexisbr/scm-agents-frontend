export type EstadoTransporte = 'en-ruta' | 'programado' | 'completado' | 'retrasado';

export interface RutaCoord {
  lat: number;
  lng: number;
}

export interface ViajeTransporte {
  idViaje: string;
  origen: string;
  destino: string;
  producto: string;
  estado: EstadoTransporte;
  eta: string;
  distanciaKm?: number;
  coordenadas?: RutaCoord[];
}

export interface TransportPlanRequest {
  producto: string;
  cantidad_kg: number;
  origen: string;
  destino: string;
}

export interface TransportPlanResponse {
  producto: string;
  cantidad_kg: number;
  vehiculo_recomendado: string;
  ruta: {
    origen: string;
    destino: string;
    distancia_km: number;
    tiempo_estimado_horas: number;
    condicion: string;
  };
  costos_estimados: {
    costo_transporte_q: number;
    combustible_estimado_litros: number;
    costo_combustible_q: number;
  };
  requiere_multiples_viajes: boolean;
  alertas: string[];
}

export interface InventoryRequest {
  producto: string;
  inventario_actual_kg: number;
  cosecha_esperada_kg: number;
  demanda_predicha_kg: number;
  horizonte_dias: number;
}

export interface InventoryResponse {
  producto: string;
  horizonte_dias: number;
  inventario_actual_kg: number;
  cosecha_esperada_kg: number;
  demanda_predicha_kg: number;
  inventario_total_disponible_kg: number;
  superavit_deficit_kg: number;
  estado: string;
  stock_seguridad_kg: number;
  recomendacion: string;
  indicadores: {
    dias_cubiertos: number;
    demanda_promedio_diaria_kg: number;
  };
}
