import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UrlBuilder } from '../../utils/url-builder';

export interface OpcaoConfiguracao {
  id: string;
  categoria: string;
  chave: string;
  rotulo: string;
  subRotulo?: string;
  icone?: string;
  cor?: string;
  corFundo?: string;
  ordem: number;
  ativo: boolean;
  dadosExtrasJson?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoSistemaService {
  constructor(private http: HttpClient) {}

  obterOpcoesPorCategoria(categoria: string): Observable<OpcaoConfiguracao[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('configuracoes')
      .segment('opcoes')
      .segment(categoria)
      .build();
    return this.http.get<OpcaoConfiguracao[]>(url);
  }

  obterTodasOpcoes(): Observable<{ [categoria: string]: OpcaoConfiguracao[] }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('configuracoes')
      .segment('opcoes')
      .build();
    return this.http.get<{ [categoria: string]: OpcaoConfiguracao[] }>(url);
  }
}
