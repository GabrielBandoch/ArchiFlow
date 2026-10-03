import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Fornecedor, 
  CriarFornecedorCommand, 
  AtualizarFornecedorCommand, 
  AvaliacaoFornecedor, 
  AdicionarAvaliacaoCommand, 
  ProjetoFornecedor, 
  VincularProjetoCommand 
} from '../../../models/fornecedor.model';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  constructor(private http: HttpClient) {}

  obterTodos(especialidade?: string): Observable<Fornecedor[]> {
    const builder = new UrlBuilder(environment.apiUrl).segment('fornecedores');
    if (especialidade && especialidade !== 'todos') {
      builder.queryParam('especialidade', especialidade);
    }
    return this.http.get<Fornecedor[]>(builder.build());
  }

  obterPorId(id: string): Observable<Fornecedor> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .segment(id)
      .build();
    return this.http.get<Fornecedor>(url);
  }

  criar(command: CriarFornecedorCommand): Observable<Fornecedor> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .build();
    return this.http.post<Fornecedor>(url, command);
  }

  atualizar(id: string, command: AtualizarFornecedorCommand): Observable<Fornecedor> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .segment(id)
      .build();
    return this.http.put<Fornecedor>(url, command);
  }

  excluir(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }

  adicionarAvaliacao(fornecedorId: string, command: AdicionarAvaliacaoCommand): Observable<AvaliacaoFornecedor> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .segment(fornecedorId)
      .segment('avaliacoes')
      .build();
    return this.http.post<AvaliacaoFornecedor>(url, command);
  }

  vincularProjeto(fornecedorId: string, command: VincularProjetoCommand): Observable<ProjetoFornecedor> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .segment(fornecedorId)
      .segment('projetos')
      .build();
    return this.http.post<ProjetoFornecedor>(url, command);
  }

  desvincularProjeto(vinculoId: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .segment('projetos')
      .segment(vinculoId)
      .build();
    return this.http.delete<void>(url);
  }

  obterFornecedoresDoProjeto(projetoId: string): Observable<ProjetoFornecedor[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('fornecedores')
      .segment('projeto')
      .segment(projetoId)
      .build();
    return this.http.get<ProjetoFornecedor[]>(url);
  }
}
