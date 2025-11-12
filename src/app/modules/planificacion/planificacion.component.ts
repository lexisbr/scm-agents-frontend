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
  HarvestMvpPayload,
  HarvestMvpResponse,
  HarvestProductCatalogItem,
} from '../../interfaces/planificacion.interface';

@Component({
  selector: 'app-planificacion',
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
  templateUrl: './planificacion.component.html',
  styleUrls: ['./planificacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanificacionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly agentsService = inject(AgentsService);

  readonly productosCatalogo = signal<HarvestProductCatalogItem[]>([]);
  readonly productosLoading = signal(true);
  readonly productosError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    producto: ['', Validators.required],
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(2020)]],
    mes: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    area_ha: [3.5, [Validators.required, Validators.min(0.1)]],
  });

  readonly meses = Array.from({ length: 12 }, (_, i) => i + 1);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly resultado = signal<HarvestMvpResponse | null>(null);

  constructor() {
    this.cargarCatalogo();
  }

  predecir(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as HarvestMvpPayload;
    this.cargando.set(true);
    this.error.set(null);

    this.agentsService.predictHarvestMvp(payload).subscribe({
      next: (resp) => {
        this.resultado.set(resp);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible obtener la predicción de cosecha.');
        this.cargando.set(false);
      },
    });
  }

  get gaugeValue(): number {
    const res = this.resultado();
    if (!res) {
      return 0;
    }
    const max = 5000;
    return Math.min(100, Math.round((res.rendimiento_estimado_kg_ha / max) * 100));
  }

  get productos(): string[] {
    const catalogo = this.productosCatalogo();
    return catalogo.length ? catalogo.map((item) => item.producto) : ['Tomate', 'Papa', 'Zanahoria'];
  }

  private cargarCatalogo(): void {
    this.agentsService.getHarvestProductos().subscribe({
      next: (items) => {
        this.productosCatalogo.set(items);
        this.productosLoading.set(false);
        const producto = items[0]?.producto ?? 'Tomate';
        this.form.patchValue({ producto });
      },
      error: () => {
        this.productosError.set('No se pudo cargar el catálogo de cultivos. Usa la lista local.');
        this.productosLoading.set(false);
        this.form.patchValue({ producto: this.productos[0] });
      },
    });
  }
}
