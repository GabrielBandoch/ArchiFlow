import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FornecedoresComponent } from './fornecedores.component';
import { FornecedorService } from '../../core/api/fornecedores/fornecedor.service';
import { DialogService } from '../../core/services/dialog.service';
import { NotificationService } from '../../core/services/notification.service';
import { Fornecedor } from '../../models/fornecedor.model';

describe('FornecedoresComponent', () => {
  let component: FornecedoresComponent;
  let fixture: ComponentFixture<FornecedoresComponent>;
  let fornecedorServiceSpy: jasmine.SpyObj<FornecedorService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockFornecedores: Fornecedor[] = [
    {
      id: 'forn-1',
      nome: 'Marmoraria Real',
      especialidade: 'Marmoraria',
      email: 'contato@marmorariareal.com',
      telefone: '11988887777',
      cidade: 'São Paulo',
      estado: 'SP',
      descricao: 'Marmoraria especializada',
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 5,
      ativo: true,
      dataCriacao: '2026-01-01',
      totalProjetosAtivos: 2,
      avaliacoes: [],
      projetosVinculados: []
    },
    {
      id: 'forn-2',
      nome: 'Marcenaria Arte Viva',
      especialidade: 'Marcenaria',
      email: 'arteviva@marcenaria.com',
      telefone: '11977776666',
      cidade: 'Campinas',
      estado: 'SP',
      descricao: 'Móveis planejados sob medida',
      avaliacaoMedia: 3.5,
      totalAvaliacoes: 2,
      ativo: true,
      dataCriacao: '2026-01-02',
      totalProjetosAtivos: 1,
      avaliacoes: [],
      projetosVinculados: []
    }
  ];

  beforeEach(async () => {
    fornecedorServiceSpy = jasmine.createSpyObj('FornecedorService', [
      'obterTodos',
      'obterPorId',
      'criar',
      'atualizar',
      'excluir',
      'adicionarAvaliacao'
    ]);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open', 'confirm']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'info', 'warning']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    fornecedorServiceSpy.obterTodos.and.returnValue(of(mockFornecedores));

    await TestBed.configureTestingModule({
      imports: [FornecedoresComponent],
      providers: [
        { provide: FornecedorService, useValue: fornecedorServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve inicializar e carregar parceiros', () => {
    expect(component).toBeTruthy();
    expect(fornecedorServiceSpy.obterTodos).toHaveBeenCalled();
    expect(component.fornecedores.length).toBe(2);
    expect(component.fornecedoresFiltrados.length).toBe(2);
  });

  it('deve filtrar fornecedores por termo de busca', () => {
    component.termoBusca = 'Marmoraria';
    expect(component.fornecedoresFiltrados.length).toBe(1);
    expect(component.fornecedoresFiltrados[0].nome).toBe('Marmoraria Real');
  });

  it('deve filtrar fornecedores por classificação mínima', () => {
    component.filtroClassificacao = '4.0';
    expect(component.fornecedoresFiltrados.length).toBe(1);
    expect(component.fornecedoresFiltrados[0].avaliacaoMedia).toBe(4.8);
  });

  it('deve alternar especialidade selecionada e recarregar', () => {
    component.filtrarPorEspecialidade('Marcenaria');
    expect(component.especialidadeSelecionada).toBe('Marcenaria');
    expect(fornecedorServiceSpy.obterTodos).toHaveBeenCalledWith('Marcenaria');
  });

  it('deve abrir modal de novo parceiro', () => {
    component.abrirModalNovo();
    expect(component.modalCadastroAberto).toBeTrue();
    expect(component.fornecedorSelecionado).toBeUndefined();
  });

  it('deve abrir modal de editar parceiro', () => {
    const f = mockFornecedores[0];
    component.abrirModalEditar(f);
    expect(component.modalCadastroAberto).toBeTrue();
    expect(component.fornecedorSelecionado).toBe(f);
  });

  it('deve abrir modal de avaliação de parceiro', () => {
    const f = mockFornecedores[0];
    component.abrirModalAvaliar(f);
    expect(component.modalAvaliarAberto).toBeTrue();
    expect(component.fornecedorSelecionado).toBe(f);
  });

  it('deve excluir parceiro com confirmação', () => {
    dialogServiceSpy.confirm.and.returnValue(of(true));
    fornecedorServiceSpy.excluir.and.returnValue(of(void 0));

    component.excluir(mockFornecedores[0]);

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(fornecedorServiceSpy.excluir).toHaveBeenCalledWith('forn-1');
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('Parceiro Marmoraria Real removido.');
  });
});
