import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Arquivo } from '../../../models/arquivo.model';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {
  constructor(private http: HttpClient) {}

  obterPorProjeto(projetoId: string): Observable<Arquivo[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('arquivos')
      .segment('projeto')
      .segment(projetoId)
      .build();
    return this.http.get<Arquivo[]>(url);
  }

  upload(file: File, projetoId: string, visivelCliente: boolean): Observable<Arquivo> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('arquivos')
      .segment('upload')
      .build();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projetoId', projetoId);
    formData.append('visivelCliente', String(visivelCliente));

    return this.http.post<Arquivo>(url, formData);
  }

  excluir(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('arquivos')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }
}
