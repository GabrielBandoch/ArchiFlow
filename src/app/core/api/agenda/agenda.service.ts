import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Compromisso, 
  CriarCompromissoCommand, 
  AtualizarCompromissoCommand, 
  AlterarStatusCompromissoCommand,
  ConfiguracaoAgendaEmpresa,
  SalvarConfiguracaoAgendaCommand,
  ConectarGoogleOAuthCommand,
  OAuthUrlResponse
} from '../../../models/agenda.model';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private http = inject(HttpClient);

  listar(inicio?: string, fim?: string, usuarioId?: string, projetoId?: string): Observable<Compromisso[]> {
    return this.obterPorPeriodo(inicio, fim, usuarioId, projetoId);
  }

  obterPorPeriodo(inicio?: string, fim?: string, usuarioId?: string, projetoId?: string): Observable<Compromisso[]> {
    const builder = new UrlBuilder(environment.apiUrl)
      .segment('agenda');

    if (inicio) builder.queryParam('inicio', inicio);
    if (fim) builder.queryParam('fim', fim);
    if (usuarioId) builder.queryParam('usuarioId', usuarioId);
    if (projetoId) builder.queryParam('projetoId', projetoId);

    return this.http.get<Compromisso[]>(builder.build());
  }

  obterProximos(quantidade = 10, usuarioId?: string): Observable<Compromisso[]> {
    const builder = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('proximos')
      .queryParam('quantidade', quantidade);

    if (usuarioId) builder.queryParam('usuarioId', usuarioId);

    return this.http.get<Compromisso[]>(builder.build());
  }

  obterPorId(id: string): Observable<Compromisso> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment(id)
      .build();
    return this.http.get<Compromisso>(url);
  }

  criar(command: CriarCompromissoCommand): Observable<Compromisso> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .build();
    return this.http.post<Compromisso>(url, command);
  }

  atualizar(id: string, command: AtualizarCompromissoCommand): Observable<Compromisso> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment(id)
      .build();
    return this.http.put<Compromisso>(url, command);
  }

  alterarStatus(id: string, command: AlterarStatusCompromissoCommand): Observable<Compromisso> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment(id)
      .segment('status')
      .build();
    return this.http.patch<Compromisso>(url, command);
  }

  excluir(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }

  baixarIcs(inicio?: string, fim?: string): Observable<Blob> {
    const builder = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('exportar-ics');

    if (inicio) builder.queryParam('inicio', inicio);
    if (fim) builder.queryParam('fim', fim);

    return this.http.get(builder.build(), { responseType: 'blob' });
  }

  exportarIcsUrl(inicio?: string, fim?: string): string {
    const builder = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('exportar-ics');

    if (inicio) builder.queryParam('inicio', inicio);
    if (fim) builder.queryParam('fim', fim);

    return builder.build();
  }

  obterConfiguracaoAgendaEmpresa(): Observable<ConfiguracaoAgendaEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('configuracao')
      .build();
    return this.http.get<ConfiguracaoAgendaEmpresa>(url);
  }

  salvarConfiguracaoAgendaEmpresa(command: SalvarConfiguracaoAgendaCommand): Observable<ConfiguracaoAgendaEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('configuracao')
      .build();
    return this.http.post<ConfiguracaoAgendaEmpresa>(url, command);
  }

  obterLinkCompartilhadoGoogleAgenda(): Observable<{ linkEmbed: string }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('google')
      .segment('link-compartilhado')
      .build();
    return this.http.get<{ linkEmbed: string }>(url);
  }

  obterUrlOAuth(redirectUri: string): Observable<OAuthUrlResponse> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('oauth')
      .segment('url')
      .queryParam('redirectUri', redirectUri)
      .build();
    return this.http.get<OAuthUrlResponse>(url);
  }

  conectarOAuth(command: ConectarGoogleOAuthCommand): Observable<ConfiguracaoAgendaEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('oauth')
      .segment('conectar')
      .build();
    return this.http.post<ConfiguracaoAgendaEmpresa>(url, command);
  }

  desconectarOAuth(): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('agenda')
      .segment('oauth')
      .segment('desconectar')
      .build();
    return this.http.delete<void>(url);
  }
}
