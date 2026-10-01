import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FinanceiroAlertasComponent } from './financeiro-alertas.component';
import { AlertaFinanceiro, StatusParcela } from '../../../../models/financeiro.model';

registerLocaleData(localePt);

describe('FinanceiroAlertasComponent', () => {
  let component: FinanceiroAlertasComponent;
  let fixture: ComponentFixture<FinanceiroAlertasComponent>;

  const mockAlertas: AlertaFinanceiro[] = [
    {
      parcelaId: 'p1',
      projetoId: 'proj1',
      titulo: 'Residência Silva - Parcela 1/3',
      subtitulo: 'Atrasado há 3 dias',
      valor: 8500,
      dataVencimento: '2026-10-01',
      status: StatusParcela.Atrasado,
      diasDiferenca: 3,
      emAtraso: true
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceiroAlertasComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceiroAlertasComponent);
    component = fixture.componentInstance;
    component.alertas = mockAlertas;
    fixture.detectChanges();
  });

  it('should create and emit darBaixa event', () => {
    expect(component).toBeTruthy();
    spyOn(component.darBaixa, 'emit');

    component.onDarBaixa('p1');
    expect(component.darBaixa.emit).toHaveBeenCalledWith('p1');
  });
});

