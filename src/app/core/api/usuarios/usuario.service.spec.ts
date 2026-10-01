import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { environment } from '../../../../environments/environment';
import { MembroEquipe } from '../../../models/usuario.model';
import { ConvidarMembroEquipeCommand, AtualizarMembroEquipeCommand } from '../../../commands/usuario.commands';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/usuarios/equipe`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar equipe via GET (obterEquipe)', () => {
    const mockMembros: MembroEquipe[] = [
      {
        id: 'user-1',
        nome: 'Arquiteto Titular',
        email: 'titular@studio.com',
        role: 'ArquitetoAdmin',
        cargo: 'Sócio Fundador',
        ativo: true,
        criadoEm: '2026-01-01T00:00:00Z'
      }
    ];

    service.obterEquipe().subscribe((membros) => {
      expect(membros.length).toBe(1);
      expect(membros[0].nome).toBe('Arquiteto Titular');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMembros);
  });

  it('deve obter membro por id via GET (obterMembroPorId)', () => {
    const mockMembro: MembroEquipe = {
      id: 'user-1',
      nome: 'Arquiteto Colaborador',
      email: 'colab@studio.com',
      role: 'ArquitetoColaborador',
      ativo: true,
      criadoEm: '2026-01-01T00:00:00Z'
    };

    service.obterMembroPorId('user-1').subscribe((membro) => {
      expect(membro.id).toBe('user-1');
      expect(membro.nome).toBe('Arquiteto Colaborador');
    });

    const req = httpMock.expectOne(`${baseUrl}/user-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMembro);
  });

  it('deve convidar membro via POST (convidarMembro)', () => {
    const command: ConvidarMembroEquipeCommand = {
      nome: 'Novo Membro',
      email: 'novo@studio.com',
      role: 'Estagiario',
      cargo: 'Estagiário'
    };

    const mockResponse: MembroEquipe = {
      id: 'user-2',
      nome: 'Novo Membro',
      email: 'novo@studio.com',
      role: 'Estagiario',
      cargo: 'Estagiário',
      ativo: true,
      criadoEm: '2026-01-01T00:00:00Z'
    };

    service.convidarMembro(command).subscribe((membro) => {
      expect(membro.id).toBe('user-2');
      expect(membro.role).toBe('Estagiario');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });

  it('deve atualizar membro via PUT (atualizarMembro)', () => {
    const command: AtualizarMembroEquipeCommand = {
      nome: 'Nome Atualizado',
      role: 'Financeiro',
      cargo: 'Coordenador Financeiro'
    };

    const mockResponse: MembroEquipe = {
      id: 'user-1',
      nome: 'Nome Atualizado',
      email: 'financeiro@studio.com',
      role: 'Financeiro',
      cargo: 'Coordenador Financeiro',
      ativo: true,
      criadoEm: '2026-01-01T00:00:00Z'
    };

    service.atualizarMembro('user-1', command).subscribe((membro) => {
      expect(membro.nome).toBe('Nome Atualizado');
      expect(membro.role).toBe('Financeiro');
    });

    const req = httpMock.expectOne(`${baseUrl}/user-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });

  it('deve alterar status via PATCH (alterarStatus)', () => {
    const mockResponse: MembroEquipe = {
      id: 'user-1',
      nome: 'Membro',
      email: 'membro@studio.com',
      role: 'Colaborador',
      ativo: false,
      criadoEm: '2026-01-01T00:00:00Z'
    };

    service.alterarStatus('user-1', false).subscribe((membro) => {
      expect(membro.ativo).toBeFalse();
    });

    const req = httpMock.expectOne(`${baseUrl}/user-1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ ativo: false });
    req.flush(mockResponse);
  });

  it('deve redefinir senha via POST (redefinirSenha)', () => {
    service.redefinirSenha('user-1', 'NovaSenha123').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user-1/redefinir-senha`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ novaSenha: 'NovaSenha123' });
    req.flush(null);
  });

  it('deve excluir membro via DELETE (excluirMembro)', () => {
    service.excluirMembro('user-1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
