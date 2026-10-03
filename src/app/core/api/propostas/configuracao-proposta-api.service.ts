import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UrlBuilder } from '../../utils/url-builder';
import { ConfiguracaoProposta } from '../../models/configuracao-proposta.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoPropostaApiService {
  constructor(private http: HttpClient) {}

  obterConfiguracao(): Observable<ConfiguracaoProposta> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment('configuracao')
      .build();
    return this.http.get<ConfiguracaoProposta>(url);
  }

  salvarConfiguracao(config: ConfiguracaoProposta): Observable<ConfiguracaoProposta> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('propostas')
      .segment('configuracao')
      .build();
    return this.http.put<ConfiguracaoProposta>(url, config);
  }
}
