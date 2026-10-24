import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Projeto,
  EtapaProjeto,
  StatusProjeto,
  StatusEtapa,
  TarefaEtapa,
} from "../../../models/projeto.model";
import {
  CriarProjetoCommand,
  AtualizarProjetoCommand,
  AtualizarStatusProjetoCommand,
  CriarEtapaCommand,
  AtualizarStatusEtapaCommand,
  AtualizarDatasEtapaCommand,
  AdicionarTarefaCommand,
  AtualizarPrazoTarefaCommand,
} from "../../../commands/projeto.commands";
import { RepresentanteCliente } from "../../../models/cliente.model";
import { ConvidarRepresentanteCommand } from "../../../commands/cliente.commands";
import { UrlBuilder } from "../../utils/url-builder";

@Injectable({
  providedIn: "root",
})
export class ProjetoService {
  constructor(private http: HttpClient) {}

  obterTodos(): Observable<Projeto[]> {
    const url = new UrlBuilder(environment.apiUrl).segment("projetos").build();
    return this.http.get<Projeto[]>(url);
  }

  obterPorId(id: string): Observable<Projeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment(id)
      .build();
    return this.http.get<Projeto>(url);
  }

  criar(command: CriarProjetoCommand): Observable<Projeto> {
    const url = new UrlBuilder(environment.apiUrl).segment("projetos").build();
    return this.http.post<Projeto>(url, command);
  }

  atualizar(id: string, command: AtualizarProjetoCommand): Observable<Projeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment(id)
      .build();
    return this.http.put<Projeto>(url, command);
  }

  atualizarStatus(id: string, status: StatusProjeto): Observable<Projeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment(id)
      .segment("status")
      .build();
    const command: AtualizarStatusProjetoCommand = { id, status };
    return this.http.patch<Projeto>(url, command);
  }

  criarEtapa(
    projetoId: string,
    command: CriarEtapaCommand,
  ): Observable<EtapaProjeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment(projetoId)
      .segment("etapas")
      .build();
    return this.http.post<EtapaProjeto>(url, command);
  }

  atualizarStatusEtapa(
    etapaId: string,
    status: StatusEtapa,
    dataConclusao?: string | null,
  ): Observable<EtapaProjeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment("etapas")
      .segment(etapaId)
      .segment("status")
      .build();
    const command: AtualizarStatusEtapaCommand = { etapaId, status };
    if (dataConclusao) {
      command.dataConclusao = dataConclusao;
    }
    return this.http.patch<EtapaProjeto>(url, command);
  }

  atualizarDatasEtapa(
    etapaId: string,
    dataFimPrevista?: string | null,
    dataConclusao?: string | null,
    limparDataFimPrevista = false,
    limparDataConclusao = false,
  ): Observable<EtapaProjeto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment("etapas")
      .segment(etapaId)
      .segment("datas")
      .build();
    const command: AtualizarDatasEtapaCommand = {
      etapaId,
      dataFimPrevista: dataFimPrevista || null,
      dataConclusao: dataConclusao || null,
      limparDataFimPrevista,
      limparDataConclusao,
    };
    return this.http.patch<EtapaProjeto>(url, command);
  }

  adicionarTarefa(
    etapaId: string,
    titulo: string,
    dataLimite?: string | null,
  ): Observable<TarefaEtapa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment("etapas")
      .segment(etapaId)
      .segment("tarefas")
      .build();
    return this.http.post<TarefaEtapa>(url, {
      etapaId,
      titulo,
      dataLimite: dataLimite || null,
    });
  }

  alternarTarefa(tarefaId: string): Observable<TarefaEtapa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment("etapas")
      .segment("tarefas")
      .segment(tarefaId)
      .segment("toggle")
      .build();
    return this.http.patch<TarefaEtapa>(url, {});
  }

  atualizarPrazoTarefa(
    tarefaId: string,
    dataLimite?: string | null,
  ): Observable<TarefaEtapa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment("etapas")
      .segment("tarefas")
      .segment(tarefaId)
      .segment("prazo")
      .build();
    const command: AtualizarPrazoTarefaCommand = {
      tarefaId,
      dataLimite: dataLimite || null,
    };
    return this.http.patch<TarefaEtapa>(url, command);
  }

  removerTarefa(tarefaId: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment("etapas")
      .segment("tarefas")
      .segment(tarefaId)
      .build();
    return this.http.delete<void>(url);
  }

  excluir(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }

  obterMeusProjetos(): Observable<Projeto[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment("meus-projetos")
      .build();
    return this.http.get<Projeto[]>(url);
  }

  obterRepresentantes(projetoId: string): Observable<RepresentanteCliente[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment(projetoId)
      .segment("representantes")
      .build();
    return this.http.get<RepresentanteCliente[]>(url);
  }

  convidarRepresentante(
    projetoId: string,
    command: ConvidarRepresentanteCommand,
  ): Observable<RepresentanteCliente> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("projetos")
      .segment(projetoId)
      .segment("representantes")
      .build();
    return this.http.post<RepresentanteCliente>(url, command);
  }
}
