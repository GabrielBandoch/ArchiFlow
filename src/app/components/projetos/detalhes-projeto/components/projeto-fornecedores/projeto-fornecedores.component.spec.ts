import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjetoFornecedoresComponent } from './projeto-fornecedores.component';
import { FornecedorService } from '../../../../../core/api/fornecedores/fornecedor.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';

describe('ProjetoFornecedoresComponent', () => {
  let component: ProjetoFornecedoresComponent;
  let fixture: ComponentFixture<ProjetoFornecedoresComponent>;
  let fornecedorServiceSpy: jasmine.SpyObj<FornecedorService>;

  beforeEach(async () => {
    fornecedorServiceSpy = jasmine.createSpyObj('FornecedorService', ['obterTodos', 'vincularProjeto', 'desvincularProjeto']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning']);

    fornecedorServiceSpy.obterTodos.and.returnValue(of([]));

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
});
