import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FinanceiroGraficoComponent } from './financeiro-grafico.component';
import { ReceitaMes } from '../../../../models/financeiro.model';

registerLocaleData(localePt);

describe('FinanceiroGraficoComponent', () => {
  let component: FinanceiroGraficoComponent;
  let fixture: ComponentFixture<FinanceiroGraficoComponent>;

  const mockMeses: ReceitaMes[] = [
    { mes: 'JAN', mesNumero: 1, ano: 2026, valorRecebido: 50000, valorPrevisto: 60000, valorDespesas: 10000 },
    { mes: 'FEV', mesNumero: 2, ano: 2026, valorRecebido: 40000, valorPrevisto: 45000, valorDespesas: 8000 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceiroGraficoComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceiroGraficoComponent);
    component = fixture.componentInstance;
    component.receitasPorMes = mockMeses;
    fixture.detectChanges();
  });

  it('should create and calculate maxValor', () => {
    expect(component).toBeTruthy();
    expect(component.maxValor).toBeGreaterThan(60000);
  });

  it('should calculate bar heights correctly', () => {
    const height = component.getBarHeight(50000);
    expect(height).toBeGreaterThan(0);
    expect(component.getBarHeight(0)).toBe(4);
  });

  it('should update selected year', () => {
    component.selectAno(2025);
    expect(component.selectedYear).toBe(2025);
  });
});

