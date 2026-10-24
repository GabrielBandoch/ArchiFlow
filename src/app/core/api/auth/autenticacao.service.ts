import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  LoginCommand,
  SolicitarRecuperacaoCommand,
  ValidarTokenRecuperacaoCommand,
  RedefinirSenhaCommand,
  ResultadoValidacaoTokenDto,
  AtivarContaCommand,
  ResultadoValidacaoConviteDto,
} from "../../../commands/autenticacao.commands";
import { Usuario } from "../../../models/usuario.model";
import { UrlBuilder } from "../../utils/url-builder";

@Injectable({
  providedIn: "root",
})
export class AutenticacaoService {
  constructor(private http: HttpClient) {}

  login(command: LoginCommand): Observable<Usuario> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("auth")
      .segment("login")
      .build();
    return this.http.post<Usuario>(url, command);
  }

  solicitarRecuperacao(
    command: SolicitarRecuperacaoCommand,
  ): Observable<{ message: string }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("auth")
      .segment("recuperar-senha")
      .build();
    return this.http.post<{ message: string }>(url, command);
  }

  validarTokenRecuperacao(
    command: ValidarTokenRecuperacaoCommand,
  ): Observable<ResultadoValidacaoTokenDto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("auth")
      .segment("validar-token")
      .build();
    return this.http.post<ResultadoValidacaoTokenDto>(url, command);
  }

  redefinirSenha(
    command: RedefinirSenhaCommand,
  ): Observable<{ message: string }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("auth")
      .segment("redefinir-senha")
      .build();
    return this.http.post<{ message: string }>(url, command);
  }

  validarTokenConvite(token: string): Observable<ResultadoValidacaoConviteDto> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("auth")
      .segment("convite")
      .segment(encodeURIComponent(token))
      .build();
    return this.http.get<ResultadoValidacaoConviteDto>(url);
  }

  ativarConta(command: AtivarContaCommand): Observable<{ message: string }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("auth")
      .segment("ativar-conta")
      .build();
    return this.http.post<{ message: string }>(url, command);
  }
}
