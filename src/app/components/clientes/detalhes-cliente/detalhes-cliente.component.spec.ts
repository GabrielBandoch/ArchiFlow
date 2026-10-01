import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DetalhesClienteComponent } from './detalhes-cliente.component';
import { ClienteService, LeadService, ProjetoService } from '../../../core/api';
import { HonorarioService } from '../../../core/api/honorarios/honorario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
import { Cliente } from '../../../models/cliente.model';
import { PropostaHonorario } from '../../../models/honorario.model';

describe('DetalhesClienteComponent', () => {
  let component: DetalhesClienteComponent;
  let fixture: ComponentFixture<DetalhesClienteComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let leadServiceSpy: jasmine.SpyObj<LeadService>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let honorarioServiceSpy: jasmine.SpyObj<HonorarioService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let router: Router;

  const mockCliente: Cliente = {
    id: 'cli-1',
    nome: 'Carlos Arquiteto',
    email: 'carlos@email.com',
    telefone: '11999999999',
    cpfCnpj: '123.456.789-00',
    endereco: 'Rua das Flores, 123',
    ativo: true,
    projetosAtivosCount: 1,
    leadId: 'lead-1'
  };

  const mockProposta: PropostaHonorario = {
    id: 'prop-1',
    codigo: 'PROP-2026-0001',
    titulo: 'Proposta Residencial',
    clienteId: 'cli-1',
    metragemQuadrada: 150,
    valorFinalAjustado: 25000,
    status: 2,
    statusNome: 'Aprovada',
    tipoProjeto: 0,
    tipoProjetoNome: 'Residencial',
    padraoImovel: 1,
    padraoImovelNome: 'Médio',
    valorHoraBase: 100,
    valorMetroQuadradoBase: 95,
    horasEstimadasTotal: 100,
    valorBase: 14250,
    valorFatorPadrao: 0,
    valorFatorTipologia: 1425,
    valorEscopo: 0,
    valorTotalSugerido: 25000,
    criadoEm: '2026-02-01',
    itensEtapa: []
  };

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['obterPorId', 'atualizar', 'atualizarAcessoPortal']);
    leadServiceSpy = jasmine.createSpyObj('LeadService', ['obterPorId']);
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterTodos']);
    honorarioServiceSpy = jasmine.createSpyObj('HonorarioService', ['obterPropostasPorCliente']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);

    clienteServiceSpy.obterPorId.and.returnValue(of(mockCliente));
    leadServiceSpy.obterPorId.and.returnValue(of({ id: 'lead-1', nome: 'Carlos', historicoContatos: [] } as any));
    projetoServiceSpy.obterTodos.and.returnValue(of([]));
    honorarioServiceSpy.obterPropostasPorCliente.and.returnValue(of([mockProposta]));

    await TestBed.configureTestingModule({
      imports: [DetalhesClienteComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'cli-1' : null)
              }
            }
          }
        },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: LeadService, useValue: leadServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: HonorarioService, useValue: honorarioServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DetalhesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load client details and proposals', () => {
    expect(component).toBeTruthy();
    expect(clienteServiceSpy.obterPorId).toHaveBeenCalledWith('cli-1');
    expect(honorarioServiceSpy.obterPropostasPorCliente).toHaveBeenCalledWith('cli-1');
    expect(component.cliente?.nome).toBe('Carlos Arquiteto');
    expect(component.propostas.length).toBe(1);
    expect(component.propostas[0].codigo).toBe('PROP-2026-0001');
  });

  it('should navigate to simulator when simularNovaProposta is called', () => {
    spyOn(router, 'navigate');
    component.simularNovaProposta();
    expect(router.navigate).toHaveBeenCalledWith(['/simulador'], {
      queryParams: { clienteId: 'cli-1' }
    });
  });

  it('should toggle portal access', () => {
    clienteServiceSpy.atualizarAcessoPortal.and.returnValue(of({ id: 'cli-1', ativo: false } as any));
    component.toggleAcessoPortal();
    expect(clienteServiceSpy.atualizarAcessoPortal).toHaveBeenCalled();
  });
});
