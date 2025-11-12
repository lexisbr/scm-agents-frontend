export interface PlanificacionCosecha {
  id: string;
  lote: string;
  producto: string;
  fecha_siembra: string;
  fecha_cosecha: string;
  calidad: 'Alta' | 'Media' | 'Baja';
  rendimiento_kg_ha?: number;
  total_estimado_kg?: number;
}

export interface HarvestPayload {
  lote: string;
  producto: string;
  fecha_siembra: string;
  fecha_cosecha: string;
  calidad: string;
}

export interface HarvestResponse {
  rendimiento_kg_ha: number;
  total_estimado_kg: number;
}

export interface HarvestMvpPayload {
  producto: string;
  anio: number;
  mes: number;
  area_ha: number;
}

export interface HarvestMvpResponse {
  producto: string;
  anio: number;
  mes: number;
  area_ha: number;
  rendimiento_estimado_kg_ha: number;
  cosecha_estimada_kg: number;
  condiciones: {
    temperatura_mes_c: number;
    temperatura_anual_c: number;
    variacion_temp: number;
    clima: 'clima_favorable' | 'clima_desfavorable';
  };
}

export interface HarvestProductCatalogItem {
  producto: string;
  alias?: string[];
}
