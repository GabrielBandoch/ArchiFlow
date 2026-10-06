import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesFornecedorComponent } from './detalhes-fornecedor.component';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { FornecedorService } from '../../../core/api/fornecedores/fornecedor.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { of } from 'rxjs';
import { Fornecedor } from '../../../models/fornecedor.model';

describe('DetalhesFornecedorComponent', () => {
  let component: DetalhesFornecedorComponent;
  let fixture: ComponentFixture<DetalhesFornecedorComponent>;
  let fornecedorServiceSpy: jasmine.SpyObj<FornecedorService>;
  let router: Router;

  const mockFornecedor: Fornecedor = {
    id: 'f-1',
    nome: 'Lumina Iluminação',
    especialidade: 'Iluminação',
    email: 'contato@lumina.com',
    telefone: '47999466073',
    cidade: 'Joinville',
    estado: 'SC',
    descricao: 'Especialistas em projetos luminotécnicos',
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 3,
    ativo: true,
    dataCriacao: new Date().toISOString(),
    totalProjetosAtivos: 1,
    avaliacoes: [],
    projetosVinculados: []
  };

  beforeEach(async () => {
    fornecedorServiceSpy = jasmine.createSpyObj('FornecedorService', ['obterPorId', 'excluir', 'vincularProjeto', 'desvincularProjeto']);
    const projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    fornecedorServiceSpy.obterPorId.and.returnValue(of(mockFornecedor));
    projetoServiceSpy.obterTodos.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DetalhesFornecedorComponent],
      providers: [
        provideRouter([]),
        { provide: FornecedorService, useValue: fornecedorServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (k: string) => k === 'id' ? 'f-1' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(DetalhesFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve carregar dados do fornecedor na inicialização', () => {
    expect(component).toBeTruthy();
    expect(component.fornecedor?.nome).toBe('Lumina Iluminação');
    expect(fornecedorServiceSpy.obterPorId).toHaveBeenCalledWith('f-1');
  });

  it('deve navegar de volta para /fornecedores ao clicar em voltar', () => {
    component.voltar();
    expect(router.navigate).toHaveBeenCalledWith(['/fornecedores']);
  });
});
