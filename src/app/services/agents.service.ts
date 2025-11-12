import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DemandaMvpPayload,
  DemandaMvpResponse,
} from '../interfaces/demanda.interface';
import {
  HarvestPayload,
  HarvestResponse,
  HarvestMvpPayload,
  HarvestMvpResponse,
  HarvestProductCatalogItem,
} from '../interfaces/planificacion.interface';
import { ProductoCatalogoItem } from '../interfaces/producto.interface';
import { ConfigStore } from '../core/state/config-store.service';

type HealthAgent = 'orchestrator' | 'inventory' | 'route';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private readonly http = inject(HttpClient);
  private readonly configStore = inject(ConfigStore);

  private readonly baseUrl = computed(() => this.configStore.apiBaseUrl());

  getHealth(agent: HealthAgent): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${this.baseUrl()}/health/${agent}`
    );
  }

  predictHarvest(payload: HarvestPayload): Observable<HarvestResponse> {
    return this.http.post<HarvestResponse>(
      `${this.baseUrl()}/agents/harvest`,
      payload
    );
  }

  predictDemandMvp(payload: DemandaMvpPayload): Observable<DemandaMvpResponse> {
    return this.http.post<DemandaMvpResponse>(
      `${this.baseUrl()}/predict-demand-mvp`,
      payload
    );
  }

  predictHarvestMvp(payload: HarvestMvpPayload): Observable<HarvestMvpResponse> {
    return this.http.post<HarvestMvpResponse>(
      `${this.baseUrl()}/agents/harvest-mvp`,
      payload
    );
  }

  getProductos(): Observable<ProductoCatalogoItem[]> {
    return this.http.get<ProductoCatalogoItem[]>(`${this.baseUrl()}/products`);
  }

  getHarvestProductos(): Observable<HarvestProductCatalogItem[]> {
    return this.http.get<HarvestProductCatalogItem[]>(
      `${this.baseUrl()}/agents/harvest-mvp/products`
    );
  }
}
