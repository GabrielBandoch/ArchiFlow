import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { AutenticacaoService } from '../api';
import { Usuario } from '../../models/usuario.model';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceSpy: jasmine.SpyObj<AutenticacaoService>;

  // Helper to create valid vs expired JWT tokens
  const createMockJwt = (expiresInSeconds: number): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
      nameid: 'user-1',
      email: 'test@archiflow.com',
      exp: now + expiresInSeconds
    }));
    const signature = 'mockSignature';
    return `${header}.${payload}.${signature}`;
  };

  beforeEach(() => {
    localStorage.clear();
    apiServiceSpy = jasmine.createSpyObj('AutenticacaoService', ['login']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AutenticacaoService, useValue: apiServiceSpy }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve identificar token expirado corretamente com isTokenExpired', () => {
    service = TestBed.inject(AuthService);

    const expiredToken = createMockJwt(-3600); // 1 hora no passado
    const validToken = createMockJwt(3600);    // 1 hora no futuro

    expect(service.isTokenExpired(expiredToken)).toBeTrue();
    expect(service.isTokenExpired(validToken)).toBeFalse();
    expect(service.isTokenExpired(undefined)).toBeTrue();
    expect(service.isTokenExpired('invalid.token')).toBeTrue();
  });

  it('deve deslogar e limpar localStorage se o usuario armazenado tiver token expirado', () => {
    const expiredToken = createMockJwt(-100);
    const mockUser: Usuario = {
      id: 'usr-1',
      nome: 'Teste',
      email: 'teste@archiflow.com',
      token: expiredToken,
      perfil: 'Administrador'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    service = TestBed.inject(AuthService);

    expect(service.currentUserValue).toBeUndefined();
    expect(service.isAuthenticated).toBeFalse();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('deve manter sessao se o token for valido', () => {
    const validToken = createMockJwt(3600);
    const mockUser: Usuario = {
      id: 'usr-1',
      nome: 'Teste Valido',
      email: 'valido@archiflow.com',
      token: validToken,
      perfil: 'Administrador'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    service = TestBed.inject(AuthService);

    expect(service.currentUserValue).toEqual(mockUser);
    expect(service.isAuthenticated).toBeTrue();
  });

  it('deve realizar login, salvar no localStorage e emitir currentUser', () => {
    service = TestBed.inject(AuthService);
    const validToken = createMockJwt(3600);
    const userRetornado: Usuario = {
      id: 'usr-2',
      nome: 'Novo Login',
      email: 'novo@archiflow.com',
      token: validToken,
      perfil: 'Arquiteto'
    };

    apiServiceSpy.login.and.returnValue(of(userRetornado));

    service.login({ email: 'novo@archiflow.com', senha: '123' }).subscribe(user => {
      expect(user).toEqual(userRetornado);
      expect(service.currentUserValue).toEqual(userRetornado);
      expect(service.isAuthenticated).toBeTrue();
      expect(localStorage.getItem('currentUser')).toContain('Novo Login');
    });
  });

  it('deve deslogar limpando o state e o localStorage', () => {
    const validToken = createMockJwt(3600);
    const mockUser: Usuario = {
      id: 'usr-1',
      nome: 'Teste',
      email: 'teste@archiflow.com',
      token: validToken,
      perfil: 'Administrador'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    service = TestBed.inject(AuthService);

    service.logout();

    expect(service.currentUserValue).toBeUndefined();
    expect(service.isAuthenticated).toBeFalse();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});
