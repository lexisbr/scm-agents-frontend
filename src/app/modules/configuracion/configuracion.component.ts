import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfigStore } from '../../core/state/config-store.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly configStore = inject(ConfigStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly usuarios = [
    { nombre: 'Coordinación MAGA', rol: 'Administrador' },
    { nombre: 'Centro de acopio Xela', rol: 'Operador' },
    { nombre: 'Logística regional', rol: 'Observador' },
  ];

  readonly configuracionForm = this.fb.nonNullable.group({
    apiBaseUrl: this.configStore.apiBaseUrl(),
    idioma: this.configStore.idioma(),
    tema: this.configStore.tema(),
  });

  readonly agentesForm = this.fb.nonNullable.group({
    demanda: this.configStore.agentesActivos().demanda,
    cosecha: this.configStore.agentesActivos().cosecha,
    inventario: this.configStore.agentesActivos().inventario,
    transporte: this.configStore.agentesActivos().transporte,
  });

  guardarPreferencias(): void {
    const { apiBaseUrl, idioma, tema } = this.configuracionForm.getRawValue();
    this.configStore.setBaseUrl(apiBaseUrl);
    this.configStore.update({ idioma, tema });
    this.snackBar.open('Preferencias guardadas', 'OK', { duration: 2500 });
  }

  guardarAgentes(): void {
    const agentes = this.agentesForm.getRawValue();
    this.configStore.updateAgentes(agentes);
    this.snackBar.open('Agentes configurados', 'OK', { duration: 2500 });
  }
}
