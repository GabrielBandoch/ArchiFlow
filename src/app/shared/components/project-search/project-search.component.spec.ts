import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectSearchComponent } from './project-search.component';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { of } from 'rxjs';
import { Projeto, StatusProjeto, TipoProjeto } from '../../../models/projeto.model';

describe('ProjectSearchComponent', () => {
  let component: ProjectSearchComponent;
  let fixture: ComponentFixture<ProjectSearchComponent>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;

  const mockProjetos: Projeto[] = [
    {
      id: 'proj-1',
      nome: 'Residência Alphaville',
      descricao: 'Casa de alto padrão',
      status: StatusProjeto.Desenvolvimento,
      statusLabel: 'Em Desenvolvimento',
      tipo: TipoProjeto.Residencial,
      tipoLabel: 'Residencial',
      dataInicio: '2026-01-01',
      metragemTotal: 350,
      clienteId: 'cli-1',
      clienteNome: 'João Silva',
      criadoEm: '2026-01-01',
      etapas: [],
      progressoPercentual: 50
    },
    {
      id: 'proj-2',
      nome: 'Edifício Comercial Central',
      descricao: 'Torre corporativa',
      status: StatusProjeto.Briefing,
      statusLabel: 'Briefing',
      tipo: TipoProjeto.Corporativo,
      tipoLabel: 'Corporativo',
      dataInicio: '2026-02-01',
      metragemTotal: 1200,
      clienteId: 'cli-2',
      clienteNome: 'Empresa XPTO',
      criadoEm: '2026-02-01',
      etapas: [],
      progressoPercentual: 10
    }
  ];

  beforeEach(async () => {
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    projetoServiceSpy.obterTodos.and.returnValue(of(mockProjetos));

    await TestBed.configureTestingModule({
      imports: [ProjectSearchComponent],
      providers: [
        { provide: ProjetoService, useValue: projetoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSearchComponent);
    component = fixture.componentInstance;
    component.projetos = mockProjetos;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar projetos ao digitar no campo de busca', () => {
    component.searchText = 'alpha';
    component.onInputSearch();

    expect(component.sugestoes.length).toBe(1);
    expect(component.sugestoes[0].nome).toBe('Residência Alphaville');
    expect(component.showDropdown).toBeTrue();
  });

  it('deve selecionar projeto e emitir evento', () => {
    spyOn(component.projectSelected, 'emit');
    const spyOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(spyOnChange);

    component.selecionarProjeto(mockProjetos[0]);

    expect(component.projetoSelecionado).toEqual(mockProjetos[0]);
    expect(component.searchText).toBe('Residência Alphaville');
    expect(component.showDropdown).toBeFalse();
    expect(spyOnChange).toHaveBeenCalledWith('proj-1');
    expect(component.projectSelected.emit).toHaveBeenCalledWith(mockProjetos[0]);
  });

  it('deve limpar seleção', () => {
    component.projetoSelecionado = mockProjetos[0];
    spyOn(component.projectSelected, 'emit');
    const spyOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(spyOnChange);

    component.limparSelecao();

    expect(component.projetoSelecionado).toBeNull();
    expect(component.searchText).toBe('');
    expect(spyOnChange).toHaveBeenCalledWith(null);
    expect(component.projectSelected.emit).toHaveBeenCalledWith(null);
  });

  it('deve atualizar valor com writeValue', () => {
    component.writeValue('proj-2');
    expect(component.projetoSelecionado?.id).toBe('proj-2');
    expect(component.searchText).toBe('Edifício Comercial Central');
  });

  it('deve abrir e fechar modal de busca avançada', () => {
    component.abrirModal();
    expect(component.showModal).toBeTrue();

    component.fecharModal();
    expect(component.showModal).toBeFalse();
  });

  it('deve selecionar projeto via modal', () => {
    spyOn(component, 'selecionarProjeto');
    component.showModal = true;

    component.selecionarViaModal(mockProjetos[0]);

    expect(component.selecionarProjeto).toHaveBeenCalledWith(mockProjetos[0]);
    expect(component.showModal).toBeFalse();
  });
});
