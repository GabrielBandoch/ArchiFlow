import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { GestaoEquipeComponent } from './gestao-equipe.component';
import { UsuarioService } from '../../../core/api/usuarios/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
import { MembroEquipe, Usuario } from '../../../models/usuario.model';

describe('GestaoEquipeComponent', () => {
  let component: GestaoEquipeComponent;
  let fixture: ComponentFixture<GestaoEquipeComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  const mockUsuarioLogado: Usuario = {
    id: 'user-admin',
    nome: 'Admin Arquiteto',
    email: 'admin@studio.com',
    perfil: 'ArquitetoAdmin'
  };

  const mockMembros: MembroEquipe[] = [
    {
      id: 'user-admin',
      nome: 'Admin Arquiteto',
      email: 'admin@studio.com',
      role: 'ArquitetoAdmin',
      cargo: 'Sócio',
      ativo: true,
      criadoEm: '2026-01-01T00:00:00Z'
    },
    {
      id: 'user-colab',
      nome: 'Beatriz Costa',
      email: 'beatriz@studio.com',
      role: 'ArquitetoColaborador',
      cargo: 'Arquiteta Pleno',
      ativo: true,
      criadoEm: '2026-01-02T00:00:00Z'
    },
    {
      id: 'user-estagio',
      nome: 'Lucas Estagiario',
      email: 'lucas@studio.com',
      role: 'Estagiario',
      cargo: 'Estagiário de Projetos',
      ativo: false,
      criadoEm: '2026-01-03T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
      'obterEquipe',
      'alterarStatus',
      'redefinirSenha',
      'excluirMembro'
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm', 'open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUserValue: mockUsuarioLogado
    });

    usuarioServiceSpy.obterEquipe.and.callFake(() => of(JSON.parse(JSON.stringify(mockMembros))));

    await TestBed.configureTestingModule({
      imports: [GestaoEquipeComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestaoEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado e carregar equipe no ngOnInit', () => {
    expect(component).toBeTruthy();
    expect(usuarioServiceSpy.obterEquipe).toHaveBeenCalled();
    expect(component.membros.length).toBe(3);
    expect(component.totalMembros).toBe(3);
    expect(component.totalAtivos).toBe(2);
  });

  it('deve filtrar equipe por termo de busca', () => {
    component.termoBusca = 'beatriz';
    expect(component.membrosFiltrados.length).toBe(1);
    expect(component.membrosFiltrados[0].nome).toBe('Beatriz Costa');
  });

  it('deve filtrar equipe por role', () => {
    component.filtroRole = 'Estagiario';
    expect(component.membrosFiltrados.length).toBe(1);
    expect(component.membrosFiltrados[0].nome).toBe('Lucas Estagiario');
  });

  it('deve filtrar equipe por status ativo/inativo', () => {
    component.filtroStatus = 'inativos';
    expect(component.membrosFiltrados.length).toBe(1);
    expect(component.membrosFiltrados[0].nome).toBe('Lucas Estagiario');
  });

  it('nao deve permitir desativar a propria conta do usuario logado', () => {
    const admin = component.membros[0];
    component.alternarStatus(admin);
    expect(notificationServiceSpy.warning).toHaveBeenCalledWith('Você não pode desativar o seu próprio usuário.');
    expect(usuarioServiceSpy.alterarStatus).not.toHaveBeenCalled();
  });

  it('deve alternar status de outro colaborador com sucesso', () => {
    const colab = component.membros[1];
    usuarioServiceSpy.alterarStatus.and.returnValue(of({ ...colab, ativo: false }));

    component.alternarStatus(colab);

    expect(usuarioServiceSpy.alterarStatus).toHaveBeenCalledWith('user-colab', false);
    expect(notificationServiceSpy.success).toHaveBeenCalled();
  });

  it('deve abrir modal de redefinir senha e redefinir com sucesso', () => {
    const colab = component.membros[1];
    component.abrirModalRedefinir(colab);
    expect(component.modalRedefinirAberto).toBeTrue();
    expect(component.membroRedefinir).toBe(colab);

    usuarioServiceSpy.redefinirSenha.and.returnValue(of(void 0));
    component.novaSenhaManual = 'NovaSenha@2026';
    component.confirmarRedefinirSenha();

    expect(usuarioServiceSpy.redefinirSenha).toHaveBeenCalledWith('user-colab', 'NovaSenha@2026');
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.modalRedefinirAberto).toBeFalse();
  });

  it('deve excluir membro com sucesso', () => {
    const colab = component.membros[1];
    dialogServiceSpy.confirm.and.returnValue(of(true));
    usuarioServiceSpy.excluirMembro.and.returnValue(of(void 0));

    component.abrirModalExcluir(colab);

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(usuarioServiceSpy.excluirMembro).toHaveBeenCalledWith('user-colab');
    expect(notificationServiceSpy.success).toHaveBeenCalled();
  });
});
