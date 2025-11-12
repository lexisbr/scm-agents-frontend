export interface InventarioItem {
  id: string;
  producto: string;
  stock_kg: number;
  unidad: string;
  rotacion: 'Alta' | 'Media' | 'Baja';
  estado: 'critico' | 'estable' | 'exceso';
}
