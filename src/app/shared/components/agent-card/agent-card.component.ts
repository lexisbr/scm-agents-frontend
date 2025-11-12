import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AgenteEstado } from '../../../interfaces/agente.interface';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule],
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCardComponent {
  @Input() agente!: AgenteEstado;

  get icon(): string {
    if (this.agente.estado === 'ready') return 'check_circle';
    if (this.agente.estado === 'warning') return 'sync_problem';
    return 'error';
  }
}
