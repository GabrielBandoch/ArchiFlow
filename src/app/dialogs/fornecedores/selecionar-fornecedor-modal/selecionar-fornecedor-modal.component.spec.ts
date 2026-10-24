import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionarFornecedorModalComponent } from './selecionar-fornecedor-modal.component';
import { FornecedorService } from '../../../core/api/fornecedores/fornecedor.service';
import { of } from 'rxjs';
import { Fornecedor } from '../../../models/fornecedor.model';

describe('SelecionarFornecedorModalComponent', () => {
  let component: SelecionarFornecedorModalComponent;
  let fixture: ComponentFixture<SelecionarFornecedorModalComponent>;
  let fornecedorServiceSpy: jasmine.SpyObj<FornecedorService>;

  const mockFornecedores: Fornecedor[] = [
    {
      id: 'forn-1',
      nome: 'Marmoraria Granitos Nobres',
      especialidade: 'Marmoraria',
      email: 'contato@granitosnobres.com',
      telefone: '41999998888',
      cidade: 'Curitiba',
      estado: 'PR',
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 5,
      ativo: true,
      dataCriacao: '2026-01-01',
      totalProjetosAtivos: 2
    },
    {
      id: 'forn-2',
      nome: 'Marcenaria Arte & Madeira',
      especialidade: 'Marcenaria',
      email: 'arte@madeira.com',
      telefone: '41988887777',
      cidade: 'São José dos Pinhais',
      estado: 'PR',
      avaliacaoMedia: 5.0,
      totalAvaliacoes: 8,
      ativo: true,
      dataCriacao: '2026-01-01',
      totalProjetosAtivos: 3
    }
  ];

  beforeEach(async () => {
    fornecedorServiceSpy = jasmine.createSpyObj('FornecedorService', ['obterTodos']);
    fornecedorServiceSpy.obterTodos.and.returnValue(of(mockFornecedores));

    await TestBed.configureTestingModule({
      imports: [SelecionarFornecedorModalComponent],
      providers: [
        { provide: FornecedorService, useValue: fornecedorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelecionarFornecedorModalComponent);
    component = fixture.componentInstance;
    component.fornecedores = mockFornecedores;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar fornecedores por nome ou especialidade', () => {
    component.modalSearchText = 'marcenaria';
    component.filtrarModal();

    expect(component.modalFornecedoresFiltrados.length).toBe(1);
    expect(component.modalFornecedoresFiltrados[0].id).toBe('forn-2');
  });

  it('deve emitir fornecedor selecionado e fechar modal', () => {
    spyOn(component.fornecedorSelected, 'emit');
    spyOn(component.close, 'emit');

    component.selecionarViaModal(mockFornecedores[0]);

    expect(component.fornecedorSelected.emit).toHaveBeenCalledWith(mockFornecedores[0]);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve paginar corretamente os resultados', () => {
    component.modalFornecedoresFiltrados = [
      ...mockFornecedores,
      { ...mockFornecedores[0], id: 'forn-3', nome: 'Eletricista Pro' },
      { ...mockFornecedores[0], id: 'forn-4', nome: 'Pinturas Silva' },
      { ...mockFornecedores[0], id: 'forn-5', nome: 'Gesso & Cia' },
      { ...mockFornecedores[0], id: 'forn-6', nome: 'Vidraçaria Cristal' }
    ];
    component.itensPorPagina = 5;
    component.paginaAtual = 1;

    expect(component.totalPaginas).toBe(2);
    expect(component.fornecedoresPaginados.length).toBe(5);

    component.proximaPagina();
    expect(component.paginaAtual).toBe(2);
    expect(component.fornecedoresPaginados.length).toBe(1);

    component.paginaAnterior();
    expect(component.paginaAtual).toBe(1);
  });
});
