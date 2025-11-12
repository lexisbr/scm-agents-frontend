import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { forkJoin, of, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ConfigStore } from './core/state/config-store.service';
import { AgentsService } from './services/agents.service';
import { AgentStore } from './core/state/agent-store.service';
import { EstadoAgente } from './interfaces/agente.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class AppComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly configStore = inject(ConfigStore);
  private readonly agentsService = inject(AgentsService);
  private readonly agentStore = inject(AgentStore);

  readonly isDarkTheme = computed(() => this.configStore.tema() === 'dark');
  readonly isHandset = signal(false);
  readonly sidebarOpened = signal(true);

  constructor() {
    this.breakpointObserver
      .observe(['(max-width: 960px)'])
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        this.isHandset.set(matches);
        this.sidebarOpened.set(!matches);
      });

    effect(() => {
      if (typeof document === 'undefined') {
        return;
      }
      document.body.classList.toggle('dark-theme', this.isDarkTheme());
    });

    this.pollHealth();
  }

  toggleSidebar(): void {
    this.sidebarOpened.update((value) => !value);
  }

  toggleTheme(): void {
    this.configStore.toggleTheme();
  }

  closeOnMobile(): void {
    if (this.isHandset()) {
      this.sidebarOpened.set(false);
    }
  }

  getOutletState(outlet: RouterOutlet): string | null {
    if (!outlet?.isActivated) {
      return null;
    }

    return outlet.activatedRoute?.snapshot?.routeConfig?.path ?? null;
  }

  private pollHealth(): void {
    timer(0, 60_000)
      .pipe(
        switchMap(() =>
          forkJoin({
            orchestrator: this.wrapHealth('orchestrator'),
            inventory: this.wrapHealth('inventory'),
            route: this.wrapHealth('route'),
          })
        ),
        takeUntilDestroyed()
      )
      .subscribe(({ orchestrator, inventory, route }) => {
        this.agentStore.bulkUpdate({
          prediccion: this.mapStatus(orchestrator.status),
          cosecha: 'ready',
          inventario: this.mapStatus(inventory.status),
          transporte: this.mapStatus(route.status),
        });
      });
  }

  private wrapHealth(agent: 'orchestrator' | 'inventory' | 'route') {
    return this.agentsService
      .getHealth(agent)
      .pipe(catchError(() => of({ status: 'offline' })));
  }

  private mapStatus(status?: string): EstadoAgente {
    if (status === 'ready' || status === 'active') {
      return 'ready';
    }

    if (status === 'offline') {
      return 'offline';
    }

    return 'warning';
  }
}
