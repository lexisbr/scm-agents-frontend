import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InventoryRequest,
  InventoryResponse,
} from '../interfaces/transporte.interface';
import { ConfigStore } from '../core/state/config-store.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryAgentService {
  private readonly http = inject(HttpClient);
  private readonly configStore = inject(ConfigStore);

  evaluateInventory(
    payload: InventoryRequest
  ): Observable<InventoryResponse> {
    const base = this.configStore.apiBaseUrl();
    return this.http.post<InventoryResponse>(
      `${base}/inventory-check-mvp`,
      payload
    );
  }
}
