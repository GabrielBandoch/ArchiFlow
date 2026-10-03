import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionarLeadModalComponent } from './selecionar-lead-modal.component';
import { Lead, StatusLead } from '../../../models/lead.model';
import { LeadService } from '../../../core/api/leads/lead.service';
import { of } from 'rxjs';

describe('SelecionarLeadModalComponent', () => {
  let component: SelecionarLeadModalComponent;
  let fixture: ComponentFixture<SelecionarLeadModalComponent>;
  let leadServiceSpy: jasmine.SpyObj<LeadService>;

  const mockLeads: Lead[] = [
    {
      id: 'lead-1',
      nome: 'Ana Paula Rodrigues',
      email: 'ana@gmail.com',
      telefone: '47999887766',
      status: StatusLead.Novo,
      statusLabel: 'Novo',
      origem: 'Instagram',
      criadoEm: '2026-01-01',
      historicoContatos: []
    },
    {
      id: 'lead-2',
      nome: 'Roberto Gomes',
      email: 'roberto@empresa.com',
      telefone: '11988887777',
      status: StatusLead.EmContato,
      statusLabel: 'Em Contato',
      origem: 'Indicação',
      criadoEm: '2026-01-05',
      historicoContatos: []
    }
  ];

  beforeEach(async () => {
    leadServiceSpy = jasmine.createSpyObj('LeadService', ['obterTodos']);
    leadServiceSpy.obterTodos.and.returnValue(of(mockLeads));

    await TestBed.configureTestingModule({
      imports: [SelecionarLeadModalComponent],
      providers: [
        { provide: LeadService, useValue: leadServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelecionarLeadModalComponent);
    component = fixture.componentInstance;
    component.leads = mockLeads;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar leads por nome', () => {
    component.modalSearchText = 'ana';
    component.filtrarModal();
    expect(component.modalLeadsFiltrados.length).toBe(1);
    expect(component.modalLeadsFiltrados[0].nome).toBe('Ana Paula Rodrigues');
  });

  it('deve filtrar leads por email ou telefone', () => {
    component.modalSearchText = 'roberto@empresa';
    component.filtrarModal();
    expect(component.modalLeadsFiltrados.length).toBe(1);
    expect(component.modalLeadsFiltrados[0].nome).toBe('Roberto Gomes');
  });

  it('deve emitir lead selecionado e fechar modal', () => {
    spyOn(component.leadSelected, 'emit');
    spyOn(component.close, 'emit');

    component.selecionarViaModal(mockLeads[0]);

    expect(component.leadSelected.emit).toHaveBeenCalledWith(mockLeads[0]);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve navegar pelas páginas', () => {
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
