import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PortalClienteComponent } from './portal-cliente.component';
import { AuthService } from '../../../core/services/auth.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { ArquivoService } from '../../../core/api/projetos/arquivo.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { ChatService } from '../../../core/services/chat.service';
import { StatusProjeto, StatusEtapa, TipoProjeto } from '../../../models/projeto.model';

describe('PortalClienteComponent', () => {
  let component: PortalClienteComponent;
  let fixture: ComponentFixture<PortalClienteComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let arquivoServiceSpy: jasmine.SpyObj<ArquivoService>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProjeto = {
    id: 'proj-123',
    nome: 'Casa das Palmeiras',
    descricao: 'Projeto residencial moderno',
    status: StatusProjeto.Desenvolvimento,
    tipo: TipoProjeto.Residencial,
    dataInicio: '2026-01-10T00:00:00Z',
    dataPrevistaEntrega: '2026-06-30T00:00:00Z',
    metragemTotal: 250,
    clienteId: 'cli-456',
    etapas: [
      {
        id: 'et-1',
        projetoId: 'proj-123',
        nome: 'Estudo Preliminar',
        descricao: 'Levantamento inicial e plantas conceituais',
        ordem: 1,
        status: StatusEtapa.Concluida,
        dataConclusao: '2026-02-01T00:00:00Z',
        tarefas: [
          { id: 't-1', etapaId: 'et-1', titulo: 'Plantas 2D', concluida: true, ordem: 1 }
        ]
      },
      {
        id: 'et-2',
        projetoId: 'proj-123',
        nome: 'Anteprojeto',
        descricao: 'Modelagem 3D e volumetria',
        ordem: 2,
        status: StatusEtapa.EmAndamento,
        dataFimPrevista: '2026-04-15T00:00:00Z',
        tarefas: [
          { id: 't-2', etapaId: 'et-2', titulo: 'Modelagem 3D', concluida: false, ordem: 1 }
        ]
      },
      {
        id: 'et-3',
        projetoId: 'proj-123',
        nome: 'Projeto Executivo',
        descricao: 'Detalhamento técnico',
        ordem: 3,
        status: StatusEtapa.Pendente,
        dataFimPrevista: '2026-06-15T00:00:00Z',
        tarefas: []
      }
    ]
  };

  const mockArquivos = [
    {
      id: 'arq-1',
      projetoId: 'proj-123',
      nome: 'Planta_Baixa.pdf',
      urlStorage: 'https://storage/planta.pdf',
      tipo: 'application/pdf',
      visivelCliente: true,
      criadoEm: '2026-02-01T00:00:00Z'
    },
    {
      id: 'arq-2',
      projetoId: 'proj-123',
      nome: 'fachada_3d.png',
      urlStorage: 'https://storage/fachada.png',
      tipo: 'image/png',
      visivelCliente: true,
      criadoEm: '2026-02-15T00:00:00Z'
    },
    {
      id: 'arq-3',
      projetoId: 'proj-123',
      nome: 'projeto_estrutural.dwg',
      urlStorage: 'https://storage/estrutural.dwg',
      tipo: 'application/acad',
      visivelCliente: true,
      criadoEm: '2026-02-20T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUserValue: { id: 'usr-1', nome: 'Carlos Cliente', email: 'carlos@cliente.com', perfil: 'Cliente', projetoId: 'proj-123' }
    });
    projetoServiceSpy = jasmine.createSpyObj('ProjetoService', ['obterPorId']);
    arquivoServiceSpy = jasmine.createSpyObj('ArquivoService', ['obterPorProjeto']);
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['obterPorId']);
    chatServiceSpy = jasmine.createSpyObj('ChatService', [
      'obterHistorico',
      'iniciarConexao',
      'enviarMensagem',
      'desconectar'
    ], {
      mensagens$: of([]),
      conectado$: of(true),
      mensagens: []
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    projetoServiceSpy.obterPorId.and.returnValue(of(mockProjeto as any));
    arquivoServiceSpy.obterPorProjeto.and.returnValue(of(mockArquivos as any));
    clienteServiceSpy.obterPorId.and.returnValue(of({ id: 'cli-456', nome: 'Carlos Cliente' } as any));
    chatServiceSpy.obterHistorico.and.returnValue(of([]));
    chatServiceSpy.iniciarConexao.and.returnValue(Promise.resolve());
    chatServiceSpy.enviarMensagem.and.returnValue(Promise.resolve());
    chatServiceSpy.desconectar.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [PortalClienteComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: ArquivoService, useValue: arquivoServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? 'proj-123' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente e carregar projeto e arquivos', () => {
    expect(component).toBeTruthy();
    expect(projetoServiceSpy.obterPorId).toHaveBeenCalledWith('proj-123');
    expect(arquivoServiceSpy.obterPorProjeto).toHaveBeenCalledWith('proj-123');
    expect(component.projeto).toBeTruthy();
    expect(component.arquivos.length).toBe(3);
  });

  it('deve calcular corretamente o progresso do projeto', () => {
    expect(component.totalEtapas).toBe(3);
    expect(component.totalConcluidas).toBe(1);
    expect(component.percentualProgresso).toBe(33);
  });

  it('deve identificar a etapa atual e os proximos passos', () => {
    expect(component.etapaAtual).toBeDefined();
    expect(component.etapaAtual?.nome).toBe('Anteprojeto');
    expect(component.proximosPassos.length).toBe(1);
    expect(component.proximosPassos[0].nome).toBe('Projeto Executivo');
  });

  it('deve formatar o tipo e status do projeto', () => {
    expect(component.tipoProjetoFormatado).toBe('Residencial');
    expect(component.statusProjetoLabel).toBe('Desenvolvimento');
  });

  it('deve filtrar arquivos por categoria', () => {
    component.setFiltroArquivo('todos');
    expect(component.arquivosFiltrados.length).toBe(3);

    component.setFiltroArquivo('plantas');
    expect(component.arquivosFiltrados.length).toBe(1);
    expect(component.arquivosFiltrados[0].nome).toBe('projeto_estrutural.dwg');

    component.setFiltroArquivo('documentos');
    expect(component.arquivosFiltrados.length).toBe(1);
    expect(component.arquivosFiltrados[0].nome).toBe('Planta_Baixa.pdf');

    component.setFiltroArquivo('imagens');
    expect(component.arquivosFiltrados.length).toBe(1);
    expect(component.arquivosFiltrados[0].nome).toBe('fachada_3d.png');
  });

  it('deve abrir url para download do arquivo', () => {
    spyOn(window, 'open');
    component.baixarArquivo(mockArquivos[0] as any);
    expect(window.open).toHaveBeenCalledWith('https://storage/planta.pdf', '_blank');
  });

  it('deve retornar icone correto por extensao de arquivo', () => {
    expect(component.getFileIcon('planta.pdf')).toBe('picture_as_pdf');
    expect(component.getFileIcon('render.jpg')).toBe('image');
    expect(component.getFileIcon('desenho.dwg')).toBe('architecture');
    expect(component.getFileIcon('planilha.xlsx')).toBe('description');
  });

  it('deve formatar data adequadamente', () => {
    const formatted = component.formatarData('2026-03-15T00:00:00Z');
    expect(formatted).toContain('2026');
    expect(component.formatarData(null)).toBe('Não definida');
  });

  it('deve lidar com erro ao carregar projeto', () => {
    projetoServiceSpy.obterPorId.and.returnValue(throwError(() => new Error('Erro API')));
    component.carregarDados();
    expect(component.loading).toBeFalse();
  });

  it('deve lidar com erro ao carregar arquivos', () => {
    arquivoServiceSpy.obterPorProjeto.and.returnValue(throwError(() => new Error('Erro API')));
    component.carregarArquivos();
    expect(component.loading).toBeFalse();
  });
});
