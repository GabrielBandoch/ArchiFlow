import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FinanceiroTabelaDespesasComponent } from './financeiro-tabela-despesas.component';
import { CategoriaDespesa, DespesaProjeto } from '../../../../models/financeiro.model';

registerLocaleData(localePt);

describe('FinanceiroTabelaDespesasComponent', () => {
  let component: FinanceiroTabelaDespesasComponent;
  let fixture: ComponentFixture<FinanceiroTabelaDespesasComponent>;

  const mockDespesas: DespesaProjeto[] = [
    {
      id: 'd1',
      projetoId: 'proj1',
      projetoNome: 'Residência Silva',
      descricao: 'Plotagem Pranchas',
      valor: 450,
      dataDespesa: '2026-10-01',
      categoria: CategoriaDespesa.PlotagemImpressao,
      categoriaNome: 'PlotagemImpressao',
      criadoEm: '2026-09-01'
    },
    {
      id: 'd2',
      projetoId: 'proj1',
      projetoNome: 'Edifício Alpha',
      descricao: 'Alvará Prefeitura',
      valor: 1200,
      dataDespesa: '2026-10-05',
      categoria: CategoriaDespesa.TaxasPrefeitura,
      categoriaNome: 'TaxasPrefeitura',
      criadoEm: '2026-09-01'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceiroTabelaDespesasComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceiroTabelaDespesasComponent);
    component = fixture.componentInstance;
    component.despesas = mockDespesas;
    fixture.detectChanges();
  });

  it('should filter by category', () => {
    component.setCategoria('PlotagemImpressao');
    expect(component.despesasFiltradas.length).toBe(1);
    expect(component.despesasFiltradas[0].id).toBe('d1');

    component.setCategoria('todas');
    expect(component.despesasFiltradas.length).toBe(2);
  });

  it('should calculate total expense amount', () => {
    expect(component.totalValorDespesas).toBe(1650);
  });

  it('should emit excluir event', () => {
    spyOn(component.excluir, 'emit');
    component.onExcluir('d1');
    expect(component.excluir.emit).toHaveBeenCalledWith('d1');
  });
});

