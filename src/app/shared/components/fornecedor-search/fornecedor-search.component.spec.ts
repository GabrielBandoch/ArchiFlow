import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FornecedorSearchComponent } from './fornecedor-search.component';
import { FornecedorService } from '../../../core/api/fornecedores/fornecedor.service';
import { of } from 'rxjs';
import { Fornecedor } from '../../../models/fornecedor.model';

describe('FornecedorSearchComponent', () => {
  let component: FornecedorSearchComponent;
  let fixture: ComponentFixture<FornecedorSearchComponent>;
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
      imports: [FornecedorSearchComponent],
      providers: [
        { provide: FornecedorService, useValue: fornecedorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FornecedorSearchComponent);
    component = fixture.componentInstance;
    component.fornecedores = mockFornecedores;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar parceiros ao digitar no campo de busca', () => {
    component.searchText = 'marmoraria';
    component.onInputSearch();

    expect(component.sugestoes.length).toBe(1);
    expect(component.sugestoes[0].nome).toBe('Marmoraria Granitos Nobres');
    expect(component.showDropdown).toBeTrue();
  });

  it('deve selecionar parceiro e emitir evento', () => {
    spyOn(component.fornecedorSelected, 'emit');
    const spyOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(spyOnChange);

    component.selecionarFornecedor(mockFornecedores[0]);

    expect(component.fornecedorSelecionado).toEqual(mockFornecedores[0]);
    expect(component.searchText).toBe('Marmoraria Granitos Nobres');
    expect(component.showDropdown).toBeFalse();
    expect(spyOnChange).toHaveBeenCalledWith('forn-1');
    expect(component.fornecedorSelected.emit).toHaveBeenCalledWith(mockFornecedores[0]);
  });

  it('deve limpar seleção', () => {
    component.fornecedorSelecionado = mockFornecedores[0];
    spyOn(component.fornecedorSelected, 'emit');
    const spyOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(spyOnChange);

    component.limparSelecao();

    expect(component.fornecedorSelecionado).toBeNull();
    expect(component.searchText).toBe('');
    expect(spyOnChange).toHaveBeenCalledWith(null);
    expect(component.fornecedorSelected.emit).toHaveBeenCalledWith(null);
  });

  it('deve carregar fornecedores do serviço se lista fornecida estiver vazia', () => {
    component.fornecedores = [];
    component.ngOnInit();

    expect(fornecedorServiceSpy.obterTodos).toHaveBeenCalled();
    expect(component.fornecedores).toEqual(mockFornecedores);
  });

  it('deve abrir e fechar modal de busca avançada', () => {
    component.abrirModal();
    expect(component.showModal).toBeTrue();

    component.fecharModal();
    expect(component.showModal).toBeFalse();
  });
});
