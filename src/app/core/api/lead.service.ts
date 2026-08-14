import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead, HistoricoContatoLead } from '../../models/lead.model';
import { 
  CriarLeadCommand, 
  AtualizarLeadCommand, 
  AtualizarStatusLeadCommand, 
  RegistrarContatoLeadCommand 
} from '../../commands/lead.commands';
import { UrlBuilder } from '../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  constructor(private http: HttpClient) {}

  obterTodos(): Observable<Lead[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('leads')
      .build();
    return this.http.get<Lead[]>(url);
  }

  obterPorId(id: string): Observable<Lead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('leads')
      .segment(id)
      .build();
    return this.http.get<Lead>(url);
  }

  criar(command: CriarLeadCommand): Observable<Lead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('leads')
      .build();
    return this.http.post<Lead>(url, command);
  }

  atualizar(command: AtualizarLeadCommand): Observable<Lead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('leads')
      .segment(command.id)
      .build();
    return this.http.put<Lead>(url, command);
  }

  atualizarStatus(command: AtualizarStatusLeadCommand): Observable<Lead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('leads')
      .segment(command.id)
      .segment('status')
      .build();
    return this.http.patch<Lead>(url, command);
  }

  registrarContato(command: RegistrarContatoLeadCommand): Observable<HistoricoContatoLead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('leads')
      .segment(command.leadId)
      .segment('historico')
      .build();
    return this.http.post<HistoricoContatoLead>(url, command);
  }

  excluir(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('leads')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }
}
