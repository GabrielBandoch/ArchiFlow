import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardMetricas, PreferenciaDashboard } from '../../../models/dashboard.model';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  obterMetricas(): Observable<DashboardMetricas> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('dashboard')
      .segment('metricas')
      .build();
    return this.http.get<DashboardMetricas>(url);
  }

  obterPreferencias(): Observable<PreferenciaDashboard | null> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('dashboard')
      .segment('preferencias')
      .build();
    return this.http.get<PreferenciaDashboard | null>(url);
  }

  salvarPreferencias(layoutJson: string): Observable<PreferenciaDashboard> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('dashboard')
      .segment('preferencias')
      .build();
    return this.http.put<PreferenciaDashboard>(url, { layoutJson });
  }
}
