import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { of, throwError } from 'rxjs';
import { FinanceiroComponent } from './financeiro.component';
import { FinanceiroService } from '../../core/api/financeiro/financeiro.service';
import { ProjetoService } from '../../core/api/projetos/projeto.service';
import { NotificationService } from '../../core/services/notification.service';
import { DialogService } from '../../core/services/dialog.service';
import { PainelFinanceiro, ParcelaFinanceira, StatusParcela } from '../../models/financeiro.model';

registerLocaleData(localePt);

describe('FinanceiroComponent', () => {
  let component: FinanceiroComponent;
  let fixture: ComponentFixture<FinanceiroComponent>;
  let financeiroServiceSpy: jasmine.SpyObj<FinanceiroService>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  const mockPainel: PainelFinanceiro = {
    totalPrevisto: 145200,
    totalRecebido: 98450,
    totalPendente: 42100,
    totalAtrasado: 12500,
    totalDespesas: 15000,
    saldoLiquido: 83450,
    variacaoPercentualMesAnterior: 12.5,
    receitasPorMes: [
      { mes: 'JAN', mesNumero: 1, ano: 2026, valorRecebido: 10000, valorPrevisto: 12000, valorDespesas: 2000 }
    ],
    alertas: [
      {
        parcelaId: 'p1',
        projetoId: 'proj1',
        titulo: 'Residência Silva - Parcela 1/3',
        subtitulo: 'Vence amanhã',
        valor: 8500,
        dataVencimento: '2026-10-01',
        status: StatusParcela.Pendente,
        diasDiferenca: 1,
        emAtraso: false
      }
    ],
    parcelasRecentes: []
  };

  const mockParcelas: ParcelaFinanceira[] = [
    {
      id: 'p1',
      projetoId: 'proj1',
      projetoNome: 'Residência Silva',
      numeroParcela: 1,
      totalParcelas: 3,
      descricao: 'Parcela 1/3',
      valor: 8500,
      dataVencimento: '2026-10-01',
      status: StatusParcela.Pendente,
      statusNome: 'Pendente',
      criadoEm: '2026-09-01'
    }
  ];

  beforeEach(async () => {
    financeiroServiceSpy = jasmine.createSpyObj('FinanceiroService', [
      'obterPainel',
      'obterParcelas',
      'obterDespesas',
      'obterParcelaPorId',
      'excluirParcela',
      'excluirDespesa'
    ]);
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open', 'confirm']);

    dialogServiceSpy.open.and.returnValue({
      instance: {
        salvo: of(null),
        salva: of(null),
        baixada: of(null),
        fechado: of(null)
      },
      afterClosed$: of(null),
      close: () => {}
    } as any);
    dialogServiceSpy.confirm.and.returnValue(of(true));

    financeiroServiceSpy.obterPainel.and.returnValue(of(mockPainel));
    financeiroServiceSpy.obterParcelas.and.returnValue(of(mockParcelas));
    financeiroServiceSpy.obterDespesas.and.returnValue(of([]));
    financeiroServiceSpy.excluirParcela.and.returnValue(of(undefined));
    financeiroServiceSpy.excluirDespesa.and.returnValue(of(undefined));
    projetoServiceSpy.obterTodos.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FinanceiroComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: FinanceiroService, useValue: financeiroServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load painel data', () => {
    expect(component).toBeTruthy();
    expect(component.painel).toEqual(mockPainel);
    expect(component.parcelas).toEqual(mockParcelas);
    expect(component.loading).toBeFalse();
  });

  it('should switch tabs correctly', () => {
    component.setAba('despesas');
    expect(component.abaAtiva).toBe('despesas');

    component.setAba('geral');
    expect(component.abaAtiva).toBe('geral');
  });

  it('should open and close modals', () => {
    component.abrirModalNovaParcela();
    expect(component.showNovaParcelaModal).toBeTrue();

    component.abrirModalNovaDespesa();
    expect(component.showNovaDespesaModal).toBeTrue();

    component.abrirModalBaixa(mockParcelas[0]);
    expect(component.showBaixaModal).toBeTrue();
    expect(component.selectedParcelaParaBaixa).toEqual(mockParcelas[0]);
  });

  it('deve desativar loading e exibir erro caso o carregamento inicial falhe', () => {
    financeiroServiceSpy.obterPainel.and.returnValue(throwError(() => new Error('Falha no servidor')));

    component.carregarDados();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Erro ao carregar dados financeiros.');
  });

  it('deve atualizar anoSelecionado e recarregar painel ao chamar onAnoChange', () => {
    component.onAnoChange(2025);

    expect(component.anoSelecionado).toBe(2025);
    expect(financeiroServiceSpy.obterPainel).toHaveBeenCalledWith(2025);
  });
});
