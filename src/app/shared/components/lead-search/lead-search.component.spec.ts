import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadSearchComponent } from './lead-search.component';
import { LeadService } from '../../../core/api/leads/lead.service';
import { of } from 'rxjs';
import { Lead, StatusLead } from '../../../models/lead.model';

describe('LeadSearchComponent', () => {
  let component: LeadSearchComponent;
  let fixture: ComponentFixture<LeadSearchComponent>;
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
      imports: [LeadSearchComponent],
      providers: [
        { provide: LeadService, useValue: leadServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadSearchComponent);
    component = fixture.componentInstance;
    component.leads = mockLeads;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar leads ao digitar', () => {
    component.searchText = 'ana';
    component.onInputSearch();

    expect(component.sugestoes.length).toBe(1);
    expect(component.sugestoes[0].nome).toBe('Ana Paula Rodrigues');
    expect(component.showDropdown).toBeTrue();
  });

  it('deve selecionar lead e emitir evento', () => {
    spyOn(component.leadSelected, 'emit');
    const spyOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(spyOnChange);

    component.selecionarLead(mockLeads[0]);

    expect(component.leadSelecionado).toEqual(mockLeads[0]);
    expect(component.searchText).toBe('Ana Paula Rodrigues');
    expect(component.showDropdown).toBeFalse();
    expect(spyOnChange).toHaveBeenCalledWith('lead-1');
    expect(component.leadSelected.emit).toHaveBeenCalledWith(mockLeads[0]);
  });

  it('deve limpar seleção', () => {
    component.leadSelecionado = mockLeads[0];
    spyOn(component.leadSelected, 'emit');
    const spyOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(spyOnChange);

    component.limparSelecao();

    expect(component.leadSelecionado).toBeNull();
    expect(component.searchText).toBe('');
    expect(spyOnChange).toHaveBeenCalledWith(null);
    expect(component.leadSelected.emit).toHaveBeenCalledWith(null);
  });

  it('deve atualizar valor com writeValue', () => {
    component.writeValue('lead-2');
    expect(component.leadSelecionado?.id).toBe('lead-2');
    expect(component.searchText).toBe('Roberto Gomes');
  });

  it('deve abrir e fechar modal de busca avançada', () => {
    component.abrirModal();
    expect(component.showModal).toBeTrue();

    component.fecharModal();
    expect(component.showModal).toBeFalse();
  });

  it('deve selecionar lead via modal', () => {
    spyOn(component, 'selecionarLead');
    component.showModal = true;

    component.selecionarViaModal(mockLeads[0]);

    expect(component.selecionarLead).toHaveBeenCalledWith(mockLeads[0]);
    expect(component.showModal).toBeFalse();
  });
});
