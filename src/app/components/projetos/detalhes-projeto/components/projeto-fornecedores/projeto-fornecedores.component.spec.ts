import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjetoFornecedoresComponent } from './projeto-fornecedores.component';
import { FornecedorService } from '../../../../../core/api/fornecedores/fornecedor.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Fornecedor, ProjetoFornecedor } from '../../../../../models/fornecedor.model';

describe('ProjetoFornecedoresComponent', () => {
  let component: ProjetoFornecedoresComponent;
  let fixture: ComponentFixture<ProjetoFornecedoresComponent>;
  let fornecedorServiceSpy: jasmine.SpyObj<FornecedorService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockFornecedores: Fornecedor[] = [
    {
      id: 'f-1',
      nome: 'Marcenaria Top',
      especialidade: 'Marcenaria',
      email: 'f1@teste.com',
      avaliacaoMedia: 4.5,
      totalAvaliacoes: 2,
      ativo: true,
      dataCriacao: '2026-10-01',
      totalProjetosAtivos: 1
    },
    {
      id: 'f-2',
      nome: 'Vidraçaria Sul',
      especialidade: 'Vidros',
      email: 'f2@teste.com',
      avaliacaoMedia: 5.0,
      totalAvaliacoes: 1,
      ativo: true,
      dataCriacao: '2026-10-01',
      totalProjetosAtivos: 0
    }
  ];

  beforeEach(async () => {
    fornecedorServiceSpy = jasmine.createSpyObj('FornecedorService', ['obterTodos', 'vincularProjeto', 'desvincularProjeto']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning']);

    fornecedorServiceSpy.obterTodos.and.returnValue(of(mockFornecedores));

    await TestBed.configureTestingModule({
      imports: [ProjetoFornecedoresComponent],
      providers: [
        provideRouter([]),
        { provide: FornecedorService, useValue: fornecedorServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'proj-1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoFornecedoresComponent);
    component = fixture.componentInstance;
    component.projetoId = 'proj-1';
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve abrir modal de vincular parceiro ao chamar abrirModalVincular', () => {
    component.abrirModalVincular();
    expect(component.modalVincularAberto).toBeTrue();
  });

  it('deve fechar modal ao chamar fecharModalVincular', () => {
    component.abrirModalVincular();
    component.fecharModalVincular();
    expect(component.modalVincularAberto).toBeFalse();
  });

  it('deve filtrar fornecedores já vinculados nas opções do select', () => {
    component.fornecedoresVinculados = [
      { id: 'v-1', fornecedorId: 'f-1', projetoId: 'proj-1', funcaoNoProjeto: 'Móveis', dataVinculo: '2026-10-01' }
    ];

    const options = component.fornecedoresOptions;
    expect(options.length).toBe(1);
    expect(options[0].value).toBe('f-2');
  });

  it('não deve salvar vínculo se formulário for inválido', () => {
    component.abrirModalVincular();
    component.form.patchValue({ fornecedorId: '', funcaoNoProjeto: '' });

    component.salvarVinculo();

    expect(notificationServiceSpy.warning).toHaveBeenCalled();
    expect(fornecedorServiceSpy.vincularProjeto).not.toHaveBeenCalled();
  });

  it('deve salvar vínculo com sucesso quando formulário for válido', () => {
    const mockVinculo: ProjetoFornecedor = {
      id: 'v-new',
      fornecedorId: 'f-2',
      projetoId: 'proj-1',
      funcaoNoProjeto: 'Esquadrias',
      dataVinculo: '2026-10-05'
    };
    fornecedorServiceSpy.vincularProjeto.and.returnValue(of(mockVinculo));
    spyOn(component.vinculoAlterado, 'emit');

    component.abrirModalVincular();
    component.form.patchValue({
      fornecedorId: 'f-2',
      funcaoNoProjeto: 'Esquadrias'
    });

    component.salvarVinculo();

    expect(fornecedorServiceSpy.vincularProjeto).toHaveBeenCalled();
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.modalVincularAberto).toBeFalse();
    expect(component.vinculoAlterado.emit).toHaveBeenCalled();
  });

  it('deve desvincular parceiro quando confirmado', () => {
    const vinculo: ProjetoFornecedor = {
      id: 'v-1',
      fornecedorId: 'f-1',
      fornecedorNome: 'Marcenaria Top',
      projetoId: 'proj-1',
      funcaoNoProjeto: 'Móveis',
      dataVinculo: '2026-10-01'
    };
    dialogServiceSpy.confirm.and.returnValue(of(true));
    fornecedorServiceSpy.desvincularProjeto.and.returnValue(of(void 0));
    spyOn(component.vinculoAlterado, 'emit');

    component.desvincular(vinculo);

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(fornecedorServiceSpy.desvincularProjeto).toHaveBeenCalledWith('v-1');
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.vinculoAlterado.emit).toHaveBeenCalled();
  });

  it('não deve desvincular parceiro quando cancelado no modal de confirmação', () => {
    const vinculo: ProjetoFornecedor = {
      id: 'v-1',
      fornecedorId: 'f-1',
      projetoId: 'proj-1',
      funcaoNoProjeto: 'Móveis',
      dataVinculo: '2026-10-01'
    };
    dialogServiceSpy.confirm.and.returnValue(of(false));

    component.desvincular(vinculo);

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(fornecedorServiceSpy.desvincularProjeto).not.toHaveBeenCalled();
  });
});
