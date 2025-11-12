export interface Producto {
  id: string;
  nombre: string;
  categoria?: string;
  unidad?: string;
  precioPromedioKg?: number;
}

export interface ProductoDemanda {
  producto: string;
  fecha: string;
  precio_promedio_kg: number;
  superficie_ha: number;
}

export interface ProductoCatalogoItem {
  producto: string;
  categoria?: string;
  alias?: string[];
}
