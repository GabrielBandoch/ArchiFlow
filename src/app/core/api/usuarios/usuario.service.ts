import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MembroEquipe } from '../../../models/usuario.model';
import {
  ConvidarMembroEquipeCommand,
  AtualizarMembroEquipeCommand,
  AlterarStatusMembroCommand,
  RedefinirSenhaMembroCommand
} from '../../../commands/usuario.commands';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  obterEquipe(): Observable<MembroEquipe[]> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('usuarios')
      .segment('equipe')
      .build();
    return this.http.get<MembroEquipe[]>(url);
  }

  obterMembroPorId(id: string): Observable<MembroEquipe> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('usuarios')
      .segment('equipe')
      .segment(id)
      .build();
    return this.http.get<MembroEquipe>(url);
  }

  convidarMembro(command: ConvidarMembroEquipeCommand): Observable<MembroEquipe> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('usuarios')
      .segment('equipe')
      .build();
    return this.http.post<MembroEquipe>(url, command);
  }

  atualizarMembro(id: string, command: AtualizarMembroEquipeCommand): Observable<MembroEquipe> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('usuarios')
      .segment('equipe')
      .segment(id)
      .build();
    return this.http.put<MembroEquipe>(url, command);
  }

  alterarStatus(id: string, ativo: boolean): Observable<MembroEquipe> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('usuarios')
      .segment('equipe')
      .segment(id)
      .segment('status')
      .build();
    const command: AlterarStatusMembroCommand = { ativo };
    return this.http.patch<MembroEquipe>(url, command);
  }

  redefinirSenha(id: string, novaSenha?: string | null): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('usuarios')
      .segment('equipe')
      .segment(id)
      .segment('redefinir-senha')
      .build();
    const command: RedefinirSenhaMembroCommand = { novaSenha };
    return this.http.post<void>(url, command);
  }

  excluirMembro(id: string): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('usuarios')
      .segment('equipe')
      .segment(id)
      .build();
    return this.http.delete<void>(url);
  }
}
