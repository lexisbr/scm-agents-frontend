import { computed, Injectable, signal } from '@angular/core';

export type Idioma = 'es' | 'en';
export type Tema = 'light' | 'dark';

export interface AgentesActivos {
  demanda: boolean;
  cosecha: boolean;
  inventario: boolean;
  transporte: boolean;
}

export interface ConfigState {
  apiBaseUrl: string;
  idioma: Idioma;
  tema: Tema;
  agentesActivos: AgentesActivos;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigStore {
  private readonly state = signal<ConfigState>({
    apiBaseUrl: 'http://localhost:8000',
    idioma: 'es',
    tema: 'light',
    agentesActivos: {
      demanda: true,
      cosecha: true,
      inventario: true,
      transporte: true,
    },
  });

  readonly snapshot = computed(() => this.state());
  readonly apiBaseUrl = computed(() => this.state().apiBaseUrl);
  readonly idioma = computed(() => this.state().idioma);
  readonly tema = computed(() => this.state().tema);
  readonly agentesActivos = computed(() => this.state().agentesActivos);

  update(partial: Partial<ConfigState>): void {
    this.state.update((prev) => ({ ...prev, ...partial }));
  }

  updateAgentes(activos: Partial<AgentesActivos>): void {
    this.state.update((prev) => ({
      ...prev,
      agentesActivos: { ...prev.agentesActivos, ...activos },
    }));
  }

  toggleTheme(): void {
    this.state.update((prev) => ({
      ...prev,
      tema: prev.tema === 'light' ? 'dark' : 'light',
    }));
  }

  setBaseUrl(url: string): void {
    if (!url) {
      return;
    }

    this.state.update((prev) => ({
      ...prev,
      apiBaseUrl: url.endsWith('/') ? url.slice(0, -1) : url,
    }));
  }
}
