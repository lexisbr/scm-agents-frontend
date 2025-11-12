import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IndicatorsService, DashboardIndicator } from '../../services/indicators.service';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { AgentCardComponent } from '../../shared/components/agent-card/agent-card.component';
import { AgentStore } from '../../core/state/agent-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BaseChartDirective,
    KpiCardComponent,
    AgentCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly indicatorsService = inject(IndicatorsService);
  private readonly agentStore = inject(AgentStore);

  readonly agentes = this.agentStore.agentes;
  readonly indicators$ = this.indicatorsService.getIndicators();
  readonly chartData$ = this.indicatorsService.getKpiSeries();

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#204021' },
      },
      x: {
        ticks: { color: '#204021' },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
    },
  };
}
