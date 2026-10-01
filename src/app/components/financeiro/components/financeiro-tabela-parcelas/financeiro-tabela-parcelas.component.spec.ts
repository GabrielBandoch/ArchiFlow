import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FinanceiroTabelaParcelasComponent } from './financeiro-tabela-parcelas.component';
import { ParcelaFinanceira, StatusParcela } from '../../../../models/financeiro.model';

registerLocaleData(localePt);

describe('FinanceiroTabelaParcelasComponent', () => {
  let component: FinanceiroTabelaParcelasComponent;
  let fixture: ComponentFixture<FinanceiroTabelaParcelasComponent>;

  const mockParcelas: ParcelaFinanceira[] = [
    {
      id: 'p1',
      projetoId: 'proj1',
      projetoNome: 'Residência Silva',
      numeroParcela: 1,
      totalParcelas: 3,
      descricao: 'Entrada',
      valor: 5000,
      dataVencimento: '2026-10-01',
      status: StatusParcela.Pendente,
      statusNome: 'Pendente',
      criadoEm: '2026-09-01'
    },
    {
      id: 'p2',
      projetoId: 'proj1',
      projetoNome: 'Edifício Alpha',
      numeroParcela: 2,
      totalParcelas: 3,
      descricao: 'Segunda Parcela',
      valor: 8000,
      dataVencimento: '2026-11-01',
      status: StatusParcela.Pago,
      statusNome: 'Pago',
      criadoEm: '2026-09-01'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceiroTabelaParcelasComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceiroTabelaParcelasComponent);
    component = fixture.componentInstance;
    component.parcelas = mockParcelas;
    fixture.detectChanges();
  });

  it('should filter by status correctly', () => {
    component.setFiltro('Pendente');
    expect(component.parcelasFiltradas.length).toBe(1);
    expect(component.parcelasFiltradas[0].id).toBe('p1');

    component.setFiltro('todos');
    expect(component.parcelasFiltradas.length).toBe(2);
  });

  it('should search by project name', () => {
    component.busca = 'Alpha';
    expect(component.parcelasFiltradas.length).toBe(1);
    expect(component.parcelasFiltradas[0].id).toBe('p2');
  });

  it('should emit darBaixa and excluir events', () => {
    spyOn(component.darBaixa, 'emit');
    spyOn(component.excluir, 'emit');

    component.onDarBaixa(mockParcelas[0]);
    expect(component.darBaixa.emit).toHaveBeenCalledWith(mockParcelas[0]);

    component.onExcluir('p1');
    expect(component.excluir.emit).toHaveBeenCalledWith('p1');
  });
});

