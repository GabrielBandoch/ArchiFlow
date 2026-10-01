import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AlertaFinanceiro,
  CategoriaDespesa,
  ContratoFinanceiro,
  DespesaProjeto,
  PainelFinanceiro,
  ParcelaFinanceira,
  StatusParcela
} from '../../../models/financeiro.model';
import {
  AtualizarDespesaCommand,
  AtualizarParcelaCommand,
  CriarContratoCommand,
  CriarDespesaCommand,
  CriarParcelaCommand,
  DarBaixaParcelaCommand
} from '../../../commands/financeiro.commands';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  constructor(private http: HttpClient) {}

  obterPainel(): Observable<PainelFinanceiro> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('painel')
      .build();
    return this.http.get<PainelFinanceiro>(url);
  }

  obterParcelas(params?: {
    projetoId?: string;
    status?: StatusParcela | string;
    inicio?: string;
    fim?: string;
  }): Observable<ParcelaFinanceira[]> {
    const builder = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('parcelas');

    if (params?.projetoId) builder.queryParam('projetoId', params.projetoId);
    if (params?.status) builder.queryParam('status', params.status);
    if (params?.inicio) builder.queryParam('inicio', params.inicio);
    if (params?.fim) builder.queryParam('fim', params.fim);

    return this.http.get<ParcelaFinanceira[]>(builder.build());
  }

  obterParcelaPorId(id: string): Observable<ParcelaFinanceira> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('parcelas')
      .segment(id)
      .build();
    return this.http.get<ParcelaFinanceira>(url);
  }

  criarContrato(command: CriarContratoCommand): Observable<ContratoFinanceiro> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('contratos')
      .build();
    return this.http.post<ContratoFinanceiro>(url, command);
  }

  obterContratoPorProjeto(projetoId: string): Observable<ContratoFinanceiro> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('contratos')
      .segment('projeto')
      .segment(projetoId)
      .build();
    return this.http.get<ContratoFinanceiro>(url);
  }

  registrarParcela(command: CriarParcelaCommand): Observable<ParcelaFinanceira> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('parcelas')
      .build();
    return this.http.post<ParcelaFinanceira>(url, command);
  }

  atualizarParcela(id: string, command: AtualizarParcelaCommand): Observable<ParcelaFinanceira> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('parcelas')
      .segment(id)
      .build();
    return this.http.put<ParcelaFinanceira>(url, command);
  }

  darBaixaParcela(id: string, command: DarBaixaParcelaCommand): Observable<ParcelaFinanceira> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('parcelas')
      .segment(id)
      .segment('baixa')
      .build();
    return this.http.patch<ParcelaFinanceira>(url, command);
  }

  excluirParcela(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('parcelas')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }

  obterDespesas(params?: {
    projetoId?: string;
    categoria?: CategoriaDespesa | string;
    inicio?: string;
    fim?: string;
  }): Observable<DespesaProjeto[]> {
    const builder = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('despesas');

    if (params?.projetoId) builder.queryParam('projetoId', params.projetoId);
    if (params?.categoria) builder.queryParam('categoria', params.categoria);
    if (params?.inicio) builder.queryParam('inicio', params.inicio);
    if (params?.fim) builder.queryParam('fim', params.fim);

    return this.http.get<DespesaProjeto[]>(builder.build());
  }

  obterDespesaPorId(id: string): Observable<DespesaProjeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('despesas')
      .segment(id)
      .build();
    return this.http.get<DespesaProjeto>(url);
  }

  criarDespesa(command: CriarDespesaCommand): Observable<DespesaProjeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('despesas')
      .build();
    return this.http.post<DespesaProjeto>(url, command);
  }

  atualizarDespesa(id: string, command: AtualizarDespesaCommand): Observable<DespesaProjeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('despesas')
      .segment(id)
      .build();
    return this.http.put<DespesaProjeto>(url, command);
  }

  excluirDespesa(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('despesas')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }

  obterAlertas(): Observable<AlertaFinanceiro[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('alertas')
      .build();
    return this.http.get<AlertaFinanceiro[]>(url);
  }

  uploadComprovante(file: File): Observable<{ url: string; nome: string }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('upload-comprovante')
      .build();

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; nome: string }>(url, formData);
  }

  excluirComprovante(fileUrl: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('financeiro')
      .segment('comprovante')
      .queryParam('url', fileUrl)
      .build();
    return this.http.delete<void>(url);
  }
}

