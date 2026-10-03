import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CriarDespesaModalComponent } from './criar-despesa-modal.component';
import { FinanceiroService } from '../../../core/api/financeiro/financeiro.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { FornecedorService } from '../../../core/api/fornecedores/fornecedor.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoriaDespesa } from '../../../models/financeiro.model';

describe('CriarDespesaModalComponent', () => {
  let component: CriarDespesaModalComponent;
  let fixture: ComponentFixture<CriarDespesaModalComponent>;
  let financeiroServiceSpy: jasmine.SpyObj<FinanceiroService>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let fornecedorServiceSpy: jasmine.SpyObj<FornecedorService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    financeiroServiceSpy = jasmine.createSpyObj('FinanceiroService', ['criarDespesa', 'uploadComprovante', 'excluirComprovante']);
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    fornecedorServiceSpy = jasmine.createSpyObj('FornecedorService', ['obterTodos']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'warning', 'error']);

    projetoServiceSpy.obterTodos.and.returnValue(of([{ id: 'p1', nome: 'Projeto Alpha' } as any]));
    fornecedorServiceSpy.obterTodos.and.returnValue(of([]));
    financeiroServiceSpy.criarDespesa.and.returnValue(of({} as any));
    financeiroServiceSpy.uploadComprovante.and.returnValue(of({ url: 'https://s3.amazonaws.com/recibo.pdf', nome: 'recibo.pdf' }));
    financeiroServiceSpy.excluirComprovante.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [CriarDespesaModalComponent],
      providers: [
        { provide: FinanceiroService, useValue: financeiroServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: FornecedorService, useValue: fornecedorServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CriarDespesaModalComponent);
    component = fixture.componentInstance;
    component.show = true;
    fixture.detectChanges();
  });

  it('should initialize with default category and submit', () => {
    expect(component.form.get('categoria')?.value).toBe(CategoriaDespesa.PlotagemImpressao);

    component.form.patchValue({
      projetoId: 'p1',
      descricao: 'Plotagem A0',
      valor: 350,
      dataDespesa: '2026-10-01',
      categoria: CategoriaDespesa.PlotagemImpressao
    });

    component.onSubmit();
    expect(financeiroServiceSpy.criarDespesa).toHaveBeenCalled();
  });

  it('should upload file when file is selected and submit despesa', () => {
    const file = new File(['content'], 'recibo.pdf', { type: 'application/pdf' });
    component.arquivoSelecionado = file;

    component.form.patchValue({
      projetoId: 'p1',
      descricao: 'Plotagem A0',
      valor: 350,
      dataDespesa: '2026-10-01',
      categoria: CategoriaDespesa.PlotagemImpressao
    });

    component.onSubmit();

    expect(financeiroServiceSpy.uploadComprovante).toHaveBeenCalledWith(file);
    expect(financeiroServiceSpy.criarDespesa).toHaveBeenCalled();
  });

  it('should handle file removal and helper methods correctly', () => {
    const file = new File(['content'], 'foto.jpg', { type: 'image/jpeg' });
    component.arquivoSelecionado = file;

    expect(component.getFileIcon('foto.jpg')).toBe('image');
    expect(component.getFileIcon('relatorio.pdf')).toBe('picture_as_pdf');
    expect(component.getFileIcon('doc.txt')).toBe('description');
    expect(component.formatarTamanho(1024)).toBe('1 KB');

    component.removerArquivo();
    expect(component.arquivoSelecionado).toBeNull();
  });

  it('deve chamar excluirComprovante caso a persistência da despesa falhe após o upload', () => {
    financeiroServiceSpy.criarDespesa.and.returnValue(throwError(() => ({ error: { message: 'Erro ao salvar despesa' } })));

    const file = new File(['content'], 'recibo.pdf', { type: 'application/pdf' });
    component.arquivoSelecionado = file;

    component.form.patchValue({
      projetoId: 'p1',
      descricao: 'Plotagem A0',
      valor: 350,
      dataDespesa: '2026-10-01',
      categoria: CategoriaDespesa.PlotagemImpressao
    });

    component.onSubmit();

    expect(financeiroServiceSpy.uploadComprovante).toHaveBeenCalled();
    expect(financeiroServiceSpy.criarDespesa).toHaveBeenCalled();
    expect(financeiroServiceSpy.excluirComprovante).toHaveBeenCalledWith('https://s3.amazonaws.com/recibo.pdf');
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('Erro ao salvar despesa');
  });
});
