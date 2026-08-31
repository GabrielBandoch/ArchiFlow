import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AutenticacaoService } from '../api';
import { Usuario } from '../../models/usuario.model';
import { LoginCommand } from '../../commands/autenticacao.commands';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Usuario | undefined>;
  public currentUser$: Observable<Usuario | undefined>;

  constructor(private apiService: AutenticacaoService) {
    let storedUser: Usuario | undefined;
    try {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        storedUser = JSON.parse(userJson);
      }
    } catch (e) {
      console.error('Erro ao ler usuário do localStorage', e);
    }
    this.currentUserSubject = new BehaviorSubject<Usuario | undefined>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | undefined {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.token;
  }

  public get token(): string | undefined {
    return this.currentUserValue?.token;
  }

  login(command: LoginCommand): Observable<Usuario> {
    return this.apiService.login(command).pipe(
      map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined);
  }
}
