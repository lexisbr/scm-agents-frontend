import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AgentsService } from '../../services/agents.service';
import {
  DemandaMvpPayload,
  DemandaMvpResponse,
} from '../../interfaces/demanda.interface';
import { ProductoCatalogoItem } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-demanda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './demanda.component.html',
  styleUrls: ['./demanda.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemandaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly agentsService = inject(AgentsService);

  readonly productosCatalogo = signal<ProductoCatalogoItem[]>([]);
  readonly productosLoading = signal(true);
  readonly productosError = signal<string | null>(null);

  readonly predictionForm = this.fb.nonNullable.group({
    producto: ['', Validators.required],
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(2020)]],
    mes: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    precio_promedio_lb: [2.95, [Validators.required, Validators.min(0.01)]],
  });

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly resultado = signal<DemandaMvpResponse | null>(null);

  readonly meses = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor() {
    this.cargarCatalogoProductos();
  }

  predecir(): void {
    if (this.predictionForm.invalid) {
      this.predictionForm.markAllAsTouched();
      return;
    }

    const { producto, anio, mes, precio_promedio_lb } = this.predictionForm.getRawValue();
    const payload: DemandaMvpPayload = {
      producto,
      anio,
      mes,
      precio_promedio_kg: this.lbToKg(precio_promedio_lb),
    };

    this.cargando.set(true);
    this.error.set(null);

    this.agentsService.predictDemandMvp(payload).subscribe({
      next: (response) => {
        this.resultado.set(response);
        this.cargando.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set('Producto no soportado por el modelo.');
        } else {
          this.error.set(err?.error?.detail ?? 'No fue posible obtener la predicción.');
        }
        this.cargando.set(false);
      },
    });
  }

  get productos(): string[] {
    const catalogo = this.productosCatalogo();
    return catalogo.length ? catalogo.map((item) => item.producto) : ['Tomate', 'Papa', 'Zanahoria'];
  }

  get gaugeValue(): number {
    const res = this.resultado();
    if (!res) {
      return 0;
    }
    const max = 250000;
    return Math.min(100, Math.round((res.demanda_predicha_kg / max) * 100));
  }

  private cargarCatalogoProductos(): void {
    this.agentsService.getProductos().subscribe({
      next: (items) => {
        this.productosCatalogo.set(items);
        this.productosLoading.set(false);
        const producto = items[0]?.producto ?? 'Tomate';
        this.predictionForm.patchValue({ producto });
      },
      error: () => {
        this.productosError.set('No se pudo cargar el catálogo de productos, usando lista local.');
        this.productosLoading.set(false);
        this.predictionForm.patchValue({ producto: this.productos[0] });
      },
    });
  }

  private lbToKg(lb: number): number {
    return Math.round(lb * 0.453592 * 100) / 100;
  }
}
