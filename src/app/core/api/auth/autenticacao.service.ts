import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginCommand } from '../../../commands/autenticacao.commands';
import { Usuario } from '../../../models/usuario.model';
import { UrlBuilder } from '../../utils/url-builder';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  constructor(private http: HttpClient) {}

  login(command: LoginCommand): Observable<Usuario> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment('auth')
      .segment('login')
      .build();
    return this.http.post<Usuario>(url, command);
  }
}
