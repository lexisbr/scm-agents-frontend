import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TransportAgentService } from '../../services/transport-agent.service';
import {
  TransportPlanRequest,
  TransportPlanResponse,
} from '../../interfaces/transporte.interface';
import { AgentsService } from '../../services/agents.service';
import { ProductoCatalogoItem } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-transporte',
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
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransporteComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transportService = inject(TransportAgentService);
  private readonly agentsService = inject(AgentsService);

  readonly productosCatalogo = signal<ProductoCatalogoItem[]>([]);
  readonly productosLoading = signal(true);
  readonly productosError = signal<string | null>(null);

  readonly origenes = [
    'Quetzaltenango',
    'Salcajá',
    'Cantel',
    'Centro de Acopio Xela',
  ];
  readonly destinos = [
    'Tecún Umán',
    'Puerto Quetzal',
    'Ciudad de Guatemala',
    'Mercado La Terminal',
  ];

  readonly form = this.fb.group({
    producto: ['', Validators.required],
    cantidad_lb: [11023, [Validators.required, Validators.min(1)]],
    origen: [this.origenes[0], Validators.required],
    destino: [this.destinos[0], Validators.required],
  });

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly planResult = signal<TransportPlanResponse | null>(null);

  constructor() {
    this.cargarProductos();
  }

  planificar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { producto, cantidad_lb, origen, destino } = this.form.getRawValue();
    const payload: TransportPlanRequest = {
      producto: producto ?? this.productos[0],
      cantidad_kg: this.lbToKg(cantidad_lb ?? 0),
      origen: origen ?? '',
      destino: destino ?? '',
    };
    this.cargando.set(true);
    this.error.set(null);

    this.transportService.planTransport(payload).subscribe({
      next: (resp) => {
        this.planResult.set(resp);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(
          'No se encontró un plan de transporte para los datos seleccionados.'
        );
        this.cargando.set(false);
      },
    });
  }

  get gaugeValue(): number {
    const plan = this.planResult();
    if (!plan) {
      return 0;
    }
    const max = 600;
    return Math.min(
      100,
      Math.round((plan.ruta.distancia_km / max) * 100)
    );
  }

  private lbToKg(lb: number): number {
    return Math.round((lb / 2.20462) * 100) / 100;
  }

  get productos(): string[] {
    const catalogo = this.productosCatalogo();
    return catalogo.length ? catalogo.map((item) => item.producto) : ['Tomate', 'Papa', 'Zanahoria'];
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
        this.productosError.set('No se pudo cargar la lista de productos. Usa los predeterminados.');
        this.productosLoading.set(false);
        this.form.patchValue({ producto: this.productos[0] });
      },
    });
  }
}
