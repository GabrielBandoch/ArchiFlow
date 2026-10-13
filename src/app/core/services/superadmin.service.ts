import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TenantAssinatura,
  SuperAdminDashboardKpis,
  CriarTenantAssinaturaRequest,
  AtualizarStatusFinanceiroRequest,
  BloquearTenantRequest,
  AtualizarNotasRequest
} from '../../models/superadmin-tenant.model';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/superadmin`;

  getKpis(): Observable<SuperAdminDashboardKpis> {
    return this.http.get<SuperAdminDashboardKpis>(`${this.baseUrl}/kpis`);
  }

  getEscritorios(busca?: string, status?: string): Observable<TenantAssinatura[]> {
    let params = new HttpParams();
    if (busca && busca.trim()) {
      params = params.set('busca', busca.trim());
    }
    if (status && status !== 'Todos') {
      params = params.set('status', status);
    }
    return this.http.get<TenantAssinatura[]>(`${this.baseUrl}/escritorios`, { params });
  }

  getEscritorio(id: string): Observable<TenantAssinatura> {
    return this.http.get<TenantAssinatura>(`${this.baseUrl}/escritorios/${id}`);
  }

  criarEscritorio(dados: CriarTenantAssinaturaRequest): Observable<TenantAssinatura> {
    return this.http.post<TenantAssinatura>(`${this.baseUrl}/escritorios`, dados);
  }

  atualizarStatusFinanceiro(id: string, dados: AtualizarStatusFinanceiroRequest): Observable<TenantAssinatura> {
    return this.http.put<TenantAssinatura>(`${this.baseUrl}/escritorios/${id}/status-financeiro`, dados);
  }

  alternarBloqueio(id: string, dados: BloquearTenantRequest): Observable<TenantAssinatura> {
    return this.http.put<TenantAssinatura>(`${this.baseUrl}/escritorios/${id}/bloquear`, dados);
  }

  atualizarNotas(id: string, dados: AtualizarNotasRequest): Observable<TenantAssinatura> {
    return this.http.put<TenantAssinatura>(`${this.baseUrl}/escritorios/${id}/notas`, dados);
  }

  registrarPagamento(id: string): Observable<TenantAssinatura> {
    return this.http.post<TenantAssinatura>(`${this.baseUrl}/escritorios/${id}/registrar-pagamento`, {});
  }
}
