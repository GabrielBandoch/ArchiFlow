import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { of, throwError } from 'rxjs';
import { DarBaixaParcelaModalComponent } from './dar-baixa-parcela-modal.component';
import { FinanceiroService } from '../../../core/api/financeiro/financeiro.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FormaPagamento, ParcelaFinanceira, StatusParcela } from '../../../models/financeiro.model';

registerLocaleData(localePt);

describe('DarBaixaParcelaModalComponent', () => {
  let component: DarBaixaParcelaModalComponent;
  let fixture: ComponentFixture<DarBaixaParcelaModalComponent>;
  let financeiroServiceSpy: jasmine.SpyObj<FinanceiroService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockParcela: ParcelaFinanceira = {
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
  };

  beforeEach(async () => {
    financeiroServiceSpy = jasmine.createSpyObj('FinanceiroService', ['darBaixaParcela', 'uploadComprovante', 'excluirComprovante']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'warning', 'error']);

    financeiroServiceSpy.darBaixaParcela.and.returnValue(of({
      ...mockParcela,
      status: StatusParcela.Pago
    }));
    financeiroServiceSpy.uploadComprovante.and.returnValue(of({
      url: 'https://s3.amazonaws.com/comprovante.pdf',
      nome: 'comprovante.pdf'
    }));
    financeiroServiceSpy.excluirComprovante.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [DarBaixaParcelaModalComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: FinanceiroService, useValue: financeiroServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DarBaixaParcelaModalComponent);
    component = fixture.componentInstance;
    component.parcela = mockParcela;
    component.show = true;
    fixture.detectChanges();
  });

  it('should create and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.form.get('formaPagamento')?.value).toBe(FormaPagamento.Pix);
  });

  it('should submit and call darBaixaParcela', () => {
    spyOn(component.baixada, 'emit');

    component.onSubmit();
    expect(financeiroServiceSpy.darBaixaParcela).toHaveBeenCalled();
    expect(component.baixada.emit).toHaveBeenCalled();
  });

  it('should upload comprovante when file is attached and dar baixa', () => {
    spyOn(component.baixada, 'emit');
    const file = new File(['dummy'], 'comprovante.pdf', { type: 'application/pdf' });
    component.arquivoSelecionado = file;

    component.onSubmit();

    expect(financeiroServiceSpy.uploadComprovante).toHaveBeenCalledWith(file);
    expect(financeiroServiceSpy.darBaixaParcela).toHaveBeenCalled();
    expect(component.baixada.emit).toHaveBeenCalled();
  });

  it('should handle file icons, sizes and removal', () => {
    expect(component.getFileIcon('doc.pdf')).toBe('picture_as_pdf');
    expect(component.getFileIcon('img.png')).toBe('image');
    expect(component.getFileIcon('test.txt')).toBe('description');
    expect(component.formatarTamanho(2048)).toBe('2 KB');

    component.removerArquivo();
    expect(component.arquivoSelecionado).toBeNull();
  });

  it('deve chamar excluirComprovante caso a confirmação de pagamento falhe após o upload', () => {
    financeiroServiceSpy.darBaixaParcela.and.returnValue(throwError(() => ({ error: { message: 'Erro ao registrar baixa' } })));

    const file = new File(['dummy'], 'comprovante.pdf', { type: 'application/pdf' });
    component.arquivoSelecionado = file;

    component.onSubmit();

    expect(financeiroServiceSpy.uploadComprovante).toHaveBeenCalledWith(file);
    expect(financeiroServiceSpy.darBaixaParcela).toHaveBeenCalled();
    expect(financeiroServiceSpy.excluirComprovante).toHaveBeenCalledWith('https://s3.amazonaws.com/comprovante.pdf');
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Erro ao registrar baixa');
  });
});

