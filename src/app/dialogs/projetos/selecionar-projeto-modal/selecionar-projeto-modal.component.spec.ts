import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionarProjetoModalComponent } from './selecionar-projeto-modal.component';
import { Projeto, StatusProjeto, TipoProjeto } from '../../../models/projeto.model';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { of } from 'rxjs';

describe('SelecionarProjetoModalComponent', () => {
  let component: SelecionarProjetoModalComponent;
  let fixture: ComponentFixture<SelecionarProjetoModalComponent>;
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
      nome: 'Edifício Infinity',
      descricao: 'Prédio comercial',
      status: StatusProjeto.Briefing,
      statusLabel: 'Briefing',
      tipo: TipoProjeto.Comercial,
      tipoLabel: 'Comercial',
      dataInicio: '2026-02-01',
      metragemTotal: 800,
      clienteId: 'cli-2',
      clienteNome: 'Maria Souza',
      criadoEm: '2026-02-01',
      etapas: [],
      progressoPercentual: 10
    }
  ];

  beforeEach(async () => {
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    projetoServiceSpy.obterTodos.and.returnValue(of(mockProjetos));

    await TestBed.configureTestingModule({
      imports: [SelecionarProjetoModalComponent],
      providers: [
        { provide: ProjetoService, useValue: projetoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelecionarProjetoModalComponent);
    component = fixture.componentInstance;
    component.projetos = mockProjetos;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar projetos por termo de busca', () => {
    component.modalSearchText = 'alpha';
    component.filtrarModal();
    expect(component.modalProjetosFiltrados.length).toBe(1);
    expect(component.modalProjetosFiltrados[0].nome).toBe('Residência Alphaville');
  });

  it('deve filtrar projetos por nome de cliente', () => {
    component.modalSearchText = 'maria';
    component.filtrarModal();
    expect(component.modalProjetosFiltrados.length).toBe(1);
    expect(component.modalProjetosFiltrados[0].nome).toBe('Edifício Infinity');
  });

  it('deve emitir projeto selecionado e fechar modal', () => {
    spyOn(component.projectSelected, 'emit');
    spyOn(component.close, 'emit');

    component.selecionarViaModal(mockProjetos[0]);

    expect(component.projectSelected.emit).toHaveBeenCalledWith(mockProjetos[0]);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve navegar entre páginas de paginação', () => {
    component.itensPorPagina = 1;
    component.filtrarModal();

    expect(component.totalPaginas).toBe(2);
    expect(component.paginaAtual).toBe(1);

    component.proximaPagina();
    expect(component.paginaAtual).toBe(2);

    component.paginaAnterior();
    expect(component.paginaAtual).toBe(1);
  });
});
