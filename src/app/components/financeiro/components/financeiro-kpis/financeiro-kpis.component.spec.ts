import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FinanceiroKpisComponent } from './financeiro-kpis.component';

registerLocaleData(localePt);

describe('FinanceiroKpisComponent', () => {
  let component: FinanceiroKpisComponent;
  let fixture: ComponentFixture<FinanceiroKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceiroKpisComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceiroKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and display input values', () => {
    component.totalPrevisto = 150000;
    component.totalRecebido = 90000;
    component.totalPendente = 50000;
    component.totalAtrasado = 10000;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.totalPrevisto).toBe(150000);
    expect(component.totalRecebido).toBe(90000);
  });
});

