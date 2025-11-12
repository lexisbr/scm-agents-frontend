import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface SidebarLink {
  label: string;
  icon: string;
  route: string;
  hint?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() compact = false;
  @Output() navigate = new EventEmitter<void>();

  readonly links: SidebarLink[] = [
    { label: 'Demanda', icon: 'show_chart', route: '/demanda', hint: 'Predicción y dataset MAGA' },
    { label: 'Planificación', icon: 'calendar_today', route: '/planificacion' },
    { label: 'Transporte', icon: 'local_shipping', route: '/transporte' },
    { label: 'Inventario', icon: 'inventory_2', route: '/inventario' },
  ];

  handleClick(): void {
    this.navigate.emit();
  }
}
