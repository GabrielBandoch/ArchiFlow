import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CriarParcelaModalComponent } from './criar-parcela-modal.component';
import { FinanceiroService } from '../../../core/api/financeiro/financeiro.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('CriarParcelaModalComponent', () => {
  let component: CriarParcelaModalComponent;
  let fixture: ComponentFixture<CriarParcelaModalComponent>;
  let financeiroServiceSpy: jasmine.SpyObj<FinanceiroService>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    financeiroServiceSpy = jasmine.createSpyObj('FinanceiroService', ['registrarParcela', 'criarContrato']);
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'warning', 'error']);

    projetoServiceSpy.obterTodos.and.returnValue(of([{ id: 'p1', nome: 'Projeto Alpha' } as any]));
    financeiroServiceSpy.registrarParcela.and.returnValue(of({} as any));
    financeiroServiceSpy.criarContrato.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [CriarParcelaModalComponent],
      providers: [
        { provide: FinanceiroService, useValue: financeiroServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CriarParcelaModalComponent);
    component = fixture.componentInstance;
    component.show = true;
    fixture.detectChanges();
  });

  it('should switch mode between avulsa and contrato', () => {
    component.setModo('contrato');
    expect(component.modo).toBe('contrato');

    component.setModo('avulsa');
    expect(component.modo).toBe('avulsa');
  });

  it('should submit single installment', () => {
    component.formAvulsa.patchValue({
      projetoId: 'p1',
      descricao: 'Honorário Teste',
      valor: 5000,
      dataVencimento: '2026-10-01',
      numeroParcela: 1,
      totalParcelas: 1
    });

    component.onSubmit();
    expect(financeiroServiceSpy.registrarParcela).toHaveBeenCalled();
  });
});
