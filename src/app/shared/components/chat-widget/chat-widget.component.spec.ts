import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { ChatWidgetComponent } from './chat-widget.component';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { MensagemChat } from '../../../models/mensagem-chat.model';

describe('ChatWidgetComponent', () => {
  let component: ChatWidgetComponent;
  let fixture: ComponentFixture<ChatWidgetComponent>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  let mensagensSubject: BehaviorSubject<MensagemChat[]>;
  let conectadoSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    mensagensSubject = new BehaviorSubject<MensagemChat[]>([]);
    conectadoSubject = new BehaviorSubject<boolean>(true);

    chatServiceSpy = jasmine.createSpyObj('ChatService', [
      'obterHistorico',
      'iniciarConexao',
      'enviarMensagem',
      'desconectar'
    ], {
      mensagens$: mensagensSubject.asObservable(),
      conectado$: conectadoSubject.asObservable(),
      mensagens: []
    });

    chatServiceSpy.obterHistorico.and.returnValue(of([]));
    chatServiceSpy.iniciarConexao.and.returnValue(Promise.resolve());
    chatServiceSpy.enviarMensagem.and.returnValue(Promise.resolve());
    chatServiceSpy.desconectar.and.returnValue(Promise.resolve());

    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUserValue: { id: 'usr-1', nome: 'Marina Sievert', perfil: 'Arquiteto' },
      isCliente: false
    });

    await TestBed.configureTestingModule({
      imports: [ChatWidgetComponent, FormsModule],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWidgetComponent);
    component = fixture.componentInstance;
    component.projetoId = 'proj-123';
    component.projetoNome = 'Residência Alphaville';
    fixture.detectChanges();
  });

  it('deve criar o componente e inicializar conexão', () => {
    expect(component).toBeTruthy();
    expect(chatServiceSpy.obterHistorico).toHaveBeenCalledWith('proj-123');
    expect(chatServiceSpy.iniciarConexao).toHaveBeenCalledWith('proj-123');
  });

  it('deve alternar a visibilidade do chat com toggleChat e fecharChat', () => {
    expect(component.isOpen).toBeFalse();

    component.toggleChat();
    expect(component.isOpen).toBeTrue();
    expect(component.naoLidas).toBe(0);

    component.fecharChat();
    expect(component.isOpen).toBeFalse();
  });

  it('deve enviar mensagem ao chamar enviar() com texto preenchido', fakeAsync(() => {
    component.novoTexto = 'Mensagem de teste';
    component.enviar();
    tick(200);

    expect(chatServiceSpy.enviarMensagem).toHaveBeenCalledWith('proj-123', 'Mensagem de teste');
    expect(component.novoTexto).toBe('');
  }));

  it('não deve enviar mensagem se o texto for vazio', fakeAsync(() => {
    component.novoTexto = '   ';
    component.enviar();
    tick(200);

    expect(chatServiceSpy.enviarMensagem).not.toHaveBeenCalled();
  }));

  it('deve identificar mensagens do próprio usuário logado', () => {
    const minhaMsg: MensagemChat = {
      id: 'm1',
      projetoId: 'proj-123',
      remetenteId: 'usr-1',
      remetenteNome: 'Marina',
      remetentePerfil: 'Arquiteto',
      conteudo: 'Oi',
      criadoEm: new Date().toISOString(),
      lida: true
    };
    const outraMsg: MensagemChat = {
      id: 'm2',
      projetoId: 'proj-123',
      remetenteId: 'cli-99',
      remetenteNome: 'Carlos',
      remetentePerfil: 'Cliente',
      conteudo: 'Oi Marina',
      criadoEm: new Date().toISOString(),
      lida: false
    };

    expect(component.isMinhaMensagem(minhaMsg)).toBeTrue();
    expect(component.isMinhaMensagem(outraMsg)).toBeFalse();
  });

  it('deve formatar as iniciais do nome corretamente', () => {
    expect(component.obterIniciais('Carlos Mendonça')).toBe('CM');
    expect(component.obterIniciais('Marina')).toBe('MA');
    expect(component.obterIniciais('')).toBe('U');
  });
});
