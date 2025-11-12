import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigStore } from '../core/state/config-store.service';
import {
  TransportPlanRequest,
  TransportPlanResponse,
} from '../interfaces/transporte.interface';

@Injectable({
  providedIn: 'root',
})
export class TransportAgentService {
  private readonly http = inject(HttpClient);
  private readonly configStore = inject(ConfigStore);

  planTransport(
    payload: TransportPlanRequest
  ): Observable<TransportPlanResponse> {
    const base = this.configStore.apiBaseUrl();
    return this.http.post<TransportPlanResponse>(
      `${base}/transport-plan-mvp`,
      payload
    );
  }
}
