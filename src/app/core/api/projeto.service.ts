import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Projeto } from '../../models/projeto.model';
import { UrlBuilder } from '../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  constructor(private http: HttpClient) {}

  obterTodos(): Observable<Projeto[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('projetos')
      .build();
    return this.http.get<Projeto[]>(url);
  }

  obterPorId(id: string): Observable<Projeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('projetos')
      .segment(id)
      .build();
    return this.http.get<Projeto>(url);
  }
}
