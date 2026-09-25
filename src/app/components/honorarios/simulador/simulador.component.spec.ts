import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimuladorComponent } from './simulador.component';
import { HonorarioService } from '../../../core/services/honorario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { LeadService } from '../../../core/api/leads/lead.service';
import { of } from 'rxjs';
import { SimulacaoResultado, PropostaHonorario } from '../../../models/honorario.model';

describe('SimuladorComponent', () => {
  let component: SimuladorComponent;
  let fixture: ComponentFixture<SimuladorComponent>;
  let mockHonorarioService: jasmine.SpyObj<HonorarioService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockClienteService: jasmine.SpyObj<ClienteService>;
  let mockLeadService: jasmine.SpyObj<LeadService>;

  const mockSimulacao: SimulacaoResultado = {
    metragemQuadrada: 150,
    tipoProjeto: 0,
    tipoProjetoNome: 'Residencial',
    padraoImovel: 1,
    padraoImovelNome: 'Médio',
    valorTotalSugerido: 8574.93,
    valorMetroQuadrado: 57.17,
    horasEstimadasTotal: 150,
    etapas: [
      { nome: 'Estudo Preliminar & Moodboard', descricao: 'Desc', incluso: true, percentual: 20, valor: 1714.99, horasEstimadas: 30, ordem: 1 }
    ],
    memoriaCalculo: {
      metragemQuadrada: 150,
      valorMetroQuadradoBase: 95,
      valorBase: 6429.00,
      fatorPadraoDescricao: 'Médio (1.0)',
      fatorPadraoMultiplicador: 1.0,
      valorFatorPadrao: 0,
      fatorTipologiaDescricao: 'Residencial (1.1)',
      fatorTipologiaMultiplicador: 1.1,
      valorFatorTipologia: 642.90,
      percentualEscopoIncluso: 100,
      valorEscopo: 0,
      horasEstimadasTotal: 150,
      valorHoraEstimado: 42.86,
      custosDiretos: 1312.92,
      custoFixoRateado: 347.64,
      custoOperacionalTotal: 8089.56,
      percentualImposto: 6.0,
      valorImposto: 485.37
    }
  };

  beforeEach(async () => {
    mockHonorarioService = jasmine.createSpyObj('HonorarioService', [
      'simular',
      'obterPropostas',
      'criarProposta',
      'atualizarStatus',
      'ajustarValor',
      'excluirProposta'
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);
    mockClienteService = jasmine.createSpyObj('ClienteService', ['obterTodos']);
    mockLeadService = jasmine.createSpyObj('LeadService', ['obterTodos']);

    mockHonorarioService.simular.and.returnValue(of(mockSimulacao));
    mockClienteService.obterTodos.and.returnValue(of([]));
    mockLeadService.obterTodos.and.returnValue(of([]));
    mockHonorarioService.obterPropostas.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [SimuladorComponent],
      providers: [
        { provide: HonorarioService, useValue: mockHonorarioService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ClienteService, useValue: mockClienteService },
        { provide: LeadService, useValue: mockLeadService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SimuladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load initial simulation', () => {
    expect(component).toBeTruthy();
    expect(mockHonorarioService.simular).toHaveBeenCalled();
    expect(component.simulacao).toEqual(mockSimulacao);
  });

  it('should update padrao and recalculate', () => {
    component.selecionarPadrao(2);
    expect(component.form.value.padraoImovel).toBe(2);
    expect(mockHonorarioService.simular).toHaveBeenCalledTimes(2);
  });

  it('should toggle etapa and recalculate', () => {
    const initialState = component.etapasDisponiveis[0].checked;
    component.toggleEtapa(0);
    expect(component.etapasDisponiveis[0].checked).toBe(!initialState);
    expect(mockHonorarioService.simular).toHaveBeenCalledTimes(2);
  });

  it('should open and close modal salvar', () => {
    component.abrirModalSalvar(false);
    expect(component.modalSalvarAberto).toBeTrue();
    expect(component.propostaForm.value.tipoVinculo).toBe('nenhum');

    component.fecharModalSalvar();
    expect(component.modalSalvarAberto).toBeFalse();
  });

  it('should save proposal when valid', () => {
    const mockProposta: PropostaHonorario = {
      id: 'prop-1',
      titulo: 'Proposta Residencial',
      codigo: 'PROP-2026-0001',
      tipoProjeto: 0,
      tipoProjetoNome: 'Residencial',
      padraoImovel: 1,
      padraoImovelNome: 'Médio',
      metragemQuadrada: 150,
      valorHoraBase: 150,
      valorMetroQuadradoBase: 95,
      horasEstimadasTotal: 120,
      valorBase: 14250,
      valorFatorPadrao: 0,
      valorFatorTipologia: 1425,
      valorEscopo: 2775,
      valorTotalSugerido: 18450,
      valorFinalAjustado: 18450,
      status: 0,
      statusNome: 'Rascunho',
      criadoEm: new Date().toISOString(),
      itensEtapa: []
    };

    mockHonorarioService.criarProposta.and.returnValue(of(mockProposta));

    component.abrirModalSalvar();
    component.propostaForm.patchValue({
      titulo: 'Proposta Teste',
      valorFinalAjustado: 18000
    });

    component.salvarProposta();

    expect(mockHonorarioService.criarProposta).toHaveBeenCalled();
    expect(mockNotificationService.success).toHaveBeenCalledWith(jasmine.stringMatching(/PROP-2026-0001/));
    expect(component.modalSalvarAberto).toBeFalse();
  });

  it('should open and apply manual adjustment', () => {
    component.abrirModalAjusteManual();
    expect(component.modalAjusteManualAberto).toBeTrue();

    component.ajusteForm.patchValue({
      valorAjustado: 20000,
      motivo: 'Ajuste comercial'
    });

    component.confirmarAjusteManual();

    expect(component.simulacao?.valorTotalSugerido).toBe(20000);
    expect(component.modalAjusteManualAberto).toBeFalse();
    expect(mockNotificationService.success).toHaveBeenCalled();
  });

  it('should format currency accurately', () => {
    expect(component.formatarMoeda(18450)).toContain('18.450');
    expect(component.formatarMoeda(undefined)).toBe('R$ 0,00');
  });
});
