import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InventoryAgentService } from '../../services/inventory-agent.service';
import { AgentsService } from '../../services/agents.service';
import { ProductoCatalogoItem } from '../../interfaces/producto.interface';
import {
  InventoryRequest,
  InventoryResponse,
} from '../../interfaces/transporte.interface';

@Component({
  selector: 'app-inventario',
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
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioComponent {
  private readonly fb = inject(FormBuilder);
  private readonly inventoryService = inject(InventoryAgentService);
  private readonly agentsService = inject(AgentsService);

  readonly productosCatalogo = signal<ProductoCatalogoItem[]>([]);
  readonly productosLoading = signal(true);
  readonly productosError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    producto: ['', Validators.required],
    inventario_lb: [22046, [Validators.required, Validators.min(1)]],
    cosecha_lb: [11023, [Validators.required, Validators.min(0)]],
    demanda_lb: [15000, [Validators.required, Validators.min(0)]],
    horizonte_dias: [30, [Validators.required, Validators.min(1)]],
  });

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly resultado = signal<InventoryResponse | null>(null);

  constructor() {
    this.cargarProductos();
  }

  evaluar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { producto, inventario_lb, cosecha_lb, demanda_lb, horizonte_dias } =
      this.form.getRawValue();

    const payload: InventoryRequest = {
      producto: producto ?? this.productos[0],
      inventario_actual_kg: this.lbToKg(inventario_lb),
      cosecha_esperada_kg: this.lbToKg(cosecha_lb),
      demanda_predicha_kg: this.lbToKg(demanda_lb),
      horizonte_dias,
    };

    this.cargando.set(true);
    this.error.set(null);

    this.inventoryService.evaluateInventory(payload).subscribe({
      next: (resp) => {
        this.resultado.set(resp);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo evaluar el inventario con los datos ingresados.');
        this.cargando.set(false);
      },
    });
  }

  get gaugeValue(): number {
    const res = this.resultado();
    if (!res) {
      return 0;
    }
    const objetivo = res.demanda_predicha_kg + res.stock_seguridad_kg;
    if (!objetivo) {
      return 0;
    }
    const ratio = (res.inventario_total_disponible_kg / objetivo) * 100;
    return Math.max(0, Math.min(200, Math.round(ratio)));
  }

  get productos(): string[] {
    const catalogo = this.productosCatalogo();
    return catalogo.length ? catalogo.map((item) => item.producto) : ['Tomate', 'Papa', 'Zanahoria'];
  }

  private lbToKg(lb: number | null | undefined): number {
    if (!lb) {
      return 0;
    }
    return Math.round(lb * 0.453592 * 100) / 100;
  }

  private cargarProductos(): void {
    this.agentsService.getProductos().subscribe({
      next: (items) => {
        this.productosCatalogo.set(items);
        this.productosLoading.set(false);
        const producto = items[0]?.producto ?? this.productos[0];
        this.form.patchValue({ producto });
      },
      error: () => {
        this.productosError.set('No se pudo cargar el catálogo de productos. Usa los predeterminados.');
        this.productosLoading.set(false);
        this.form.patchValue({ producto: this.productos[0] });
      },
    });
  }
}
