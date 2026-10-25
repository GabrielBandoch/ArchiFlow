import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  DadosEmpresa,
  SalvarDadosEmpresaCommand,
} from "../../models/empresa.model";
import { UrlBuilder } from "../../utils/url-builder";
import { TemaHelper } from "../../utils/tema.helper";

@Injectable({
  providedIn: "root",
})
export class EmpresaService {
  constructor(private http: HttpClient) {
    this.carregarTemaSalvo();
  }

  aplicarTema(corPrimaria?: string | null): void {
    TemaHelper.aplicarTema(corPrimaria);
  }

  carregarTemaSalvo(): void {
    TemaHelper.carregarTemaSalvo();
  }

  obterDadosEmpresa(): Observable<DadosEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .build();
    return this.http.get<DadosEmpresa>(url).pipe(
      tap((dados) => {
        if (dados?.corPrimaria) {
          this.aplicarTema(dados.corPrimaria);
        }
      }),
    );
  }

  salvarDadosEmpresa(
    command: SalvarDadosEmpresaCommand,
  ): Observable<DadosEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .build();
    return this.http.put<DadosEmpresa>(url, command).pipe(
      tap((dados) => {
        if (dados?.corPrimaria) {
          this.aplicarTema(dados.corPrimaria);
        }
      }),
    );
  }

  salvarCorPrimaria(corPrimaria: string): Observable<DadosEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .segment("cor")
      .build();
    return this.http.patch<DadosEmpresa>(url, { corPrimaria }).pipe(
      tap((dados) => {
        if (dados?.corPrimaria) {
          this.aplicarTema(dados.corPrimaria);
        }
      }),
    );
  }

  uploadLogo(file: File): Observable<{ logoUrl: string }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .segment("logo")
      .build();
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ logoUrl: string }>(url, formData);
  }

  removerLogo(): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .segment("logo")
      .build();
    return this.http.delete<void>(url);
  }
}
