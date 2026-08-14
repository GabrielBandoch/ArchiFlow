import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrigemLead } from '../../models/origem-lead.model';
import { UrlBuilder } from '../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class OrigemLeadService {
  constructor(private http: HttpClient) {}

  obterTodos(): Observable<OrigemLead[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('origens-lead')
      .build();
    return this.http.get<OrigemLead[]>(url);
  }

  obterAtivas(): Observable<OrigemLead[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('origens-lead')
      .segment('ativas')
      .build();
    return this.http.get<OrigemLead[]>(url);
  }

  obterPorId(id: string): Observable<OrigemLead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('origens-lead')
      .segment(id)
      .build();
    return this.http.get<OrigemLead>(url);
  }

  criar(descricao: string): Observable<OrigemLead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('origens-lead')
      .build();
    return this.http.post<OrigemLead>(url, { descricao });
  }

  atualizar(id: string, descricao: string): Observable<OrigemLead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('origens-lead')
      .segment(id)
      .build();
    return this.http.put<OrigemLead>(url, { id, descricao });
  }

  desativar(id: string): Observable<OrigemLead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('origens-lead')
      .segment(id)
      .build();
    return this.http.delete<OrigemLead>(url);
  }

  reativar(id: string): Observable<OrigemLead> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('origens-lead')
      .segment(id)
      .segment('reativar')
      .build();
    return this.http.post<OrigemLead>(url, {});
  }
}
