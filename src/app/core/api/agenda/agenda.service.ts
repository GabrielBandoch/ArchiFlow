import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Compromisso, 
  CriarCompromissoCommand, 
  AtualizarCompromissoCommand, 
  AlterarStatusCompromissoCommand 
} from '../../../models/agenda.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private readonly apiUrl = `${environment.apiUrl}/agenda`;

  constructor(private http: HttpClient) {}

  listar(inicio?: string, fim?: string, usuarioId?: string, projetoId?: string): Observable<Compromisso[]> {
    return this.obterPorPeriodo(inicio, fim, usuarioId, projetoId);
  }

  obterPorPeriodo(inicio?: string, fim?: string, usuarioId?: string, projetoId?: string): Observable<Compromisso[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fim) params = params.set('fim', fim);
    if (usuarioId) params = params.set('usuarioId', usuarioId);
    if (projetoId) params = params.set('projetoId', projetoId);

    return this.http.get<Compromisso[]>(this.apiUrl, { params });
  }

  obterProximos(quantidade = 10, usuarioId?: string): Observable<Compromisso[]> {
    let params = new HttpParams().set('quantidade', quantidade.toString());
    if (usuarioId) params = params.set('usuarioId', usuarioId);

    return this.http.get<Compromisso[]>(`${this.apiUrl}/proximos`, { params });
  }

  obterPorId(id: string): Observable<Compromisso> {
    return this.http.get<Compromisso>(`${this.apiUrl}/${id}`);
  }

  criar(command: CriarCompromissoCommand): Observable<Compromisso> {
    return this.http.post<Compromisso>(this.apiUrl, command);
  }

  atualizar(id: string, command: AtualizarCompromissoCommand): Observable<Compromisso> {
    return this.http.put<Compromisso>(`${this.apiUrl}/${id}`, command);
  }

  alterarStatus(id: string, command: AlterarStatusCompromissoCommand): Observable<Compromisso> {
    return this.http.patch<Compromisso>(`${this.apiUrl}/${id}/status`, command);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportarIcsUrl(inicio?: string, fim?: string): string {
    let url = `${this.apiUrl}/exportar-ics`;
    const params: string[] = [];
    if (inicio) params.push(`inicio=${encodeURIComponent(inicio)}`);
    if (fim) params.push(`fim=${encodeURIComponent(fim)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return url;
  }

  obterConfiguracaoAgendaEmpresa(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/configuracao`);
  }

  salvarConfiguracaoAgendaEmpresa(command: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/configuracao`, command);
  }

  obterLinkCompartilhadoGoogleAgenda(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/google/link-compartilhado`);
  }
}
