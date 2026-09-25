import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SimulacaoParametros,
  SimulacaoResultado,
  PropostaHonorario,
  CriarPropostaCommand,
  AtualizarStatusPropostaCommand,
  AjustarValorPropostaCommand
} from '../../../models/honorario.model';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class HonorarioService {
  private http = inject(HttpClient);

  simular(parametros: SimulacaoParametros): Observable<SimulacaoResultado> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('honorarios')
      .segment('simular')
      .build();
    return this.http.post<SimulacaoResultado>(url, parametros);
  }

  obterPropostas(): Observable<PropostaHonorario[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .build();
    return this.http.get<PropostaHonorario[]>(url);
  }

  obterPropostaPorId(id: string): Observable<PropostaHonorario> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment(id)
      .build();
    return this.http.get<PropostaHonorario>(url);
  }

  obterPropostasPorCliente(clienteId: string): Observable<PropostaHonorario[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment('cliente')
      .segment(clienteId)
      .build();
    return this.http.get<PropostaHonorario[]>(url);
  }

  obterPropostasPorLead(leadId: string): Observable<PropostaHonorario[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment('lead')
      .segment(leadId)
      .build();
    return this.http.get<PropostaHonorario[]>(url);
  }

  criarProposta(command: CriarPropostaCommand): Observable<PropostaHonorario> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .build();
    return this.http.post<PropostaHonorario>(url, command);
  }

  atualizarStatus(id: string, command: AtualizarStatusPropostaCommand): Observable<PropostaHonorario> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment(id)
      .segment('status')
      .build();
    return this.http.put<PropostaHonorario>(url, command);
  }

  ajustarValor(id: string, command: AjustarValorPropostaCommand): Observable<PropostaHonorario> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment(id)
      .segment('ajustar-valor')
      .build();
    return this.http.put<PropostaHonorario>(url, command);
  }

  excluirProposta(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }
}
