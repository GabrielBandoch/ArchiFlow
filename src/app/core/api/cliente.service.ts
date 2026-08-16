import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ConversaoClienteResponse } from '../../models/cliente.model';
import { 
  ConvertLeadToClienteCommand, 
  AtualizarClienteCommand, 
  AtualizarPortalAccessCommand 
} from '../../commands/cliente.commands';
import { UrlBuilder } from '../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(private http: HttpClient) {}

  obterTodos(): Observable<Cliente[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('clientes')
      .build();
    return this.http.get<Cliente[]>(url);
  }

  obterPorId(id: string): Observable<Cliente> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('clientes')
      .segment(id)
      .build();
    return this.http.get<Cliente>(url);
  }

  converterLead(command: ConvertLeadToClienteCommand): Observable<ConversaoClienteResponse> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('clientes')
      .segment('convert')
      .build();
    return this.http.post<ConversaoClienteResponse>(url, command);
  }

  atualizar(command: AtualizarClienteCommand): Observable<Cliente> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('clientes')
      .build();
    return this.http.put<Cliente>(url, command);
  }

  atualizarAcessoPortal(command: AtualizarPortalAccessCommand): Observable<Cliente> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('clientes')
      .segment('portal-access')
      .build();
    return this.http.patch<Cliente>(url, command);
  }
}
