import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { AuthService } from './auth.service';
import { MensagemChat } from '../../models/mensagem-chat.model';
import { environment } from '../../../environments/environment';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      token: 'mock-jwt-token',
      currentUserValue: { id: 'usr-1', nome: 'Marina', email: 'marina@duna.com', perfil: 'Arquiteto' }
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o serviço', () => {
    expect(service).toBeTruthy();
  });

  it('deve obter histórico de mensagens via REST e atualizar mensagens$', () => {
    const projetoId = 'pjt-100';
    const mockHistorico: MensagemChat[] = [
      {
        id: 'msg-1',
        projetoId,
        remetenteId: 'usr-1',
        remetenteNome: 'Marina',
        remetentePerfil: 'Arquiteto',
        conteudo: 'Olá Carlos, tudo bem?',
        criadoEm: new Date().toISOString(),
        lida: true
      }
    ];

    service.obterHistorico(projetoId).subscribe(data => {
      expect(data).toEqual(mockHistorico);
      expect(service.mensagens).toEqual(mockHistorico);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mensagens/projeto/${projetoId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistorico);
  });

  it('deve ignorar envio de mensagem se o texto for vazio', async () => {
    await service.enviarMensagem('pjt-100', '   ');
    httpMock.expectNone(`${environment.apiUrl}/mensagens/projeto/pjt-100`);
    expect(service.mensagens.length).toBe(0);
  });

  it('deve desconectar com sucesso', async () => {
    await service.desconectar();
    expect(service.conectado).toBeFalse();
  });
});
