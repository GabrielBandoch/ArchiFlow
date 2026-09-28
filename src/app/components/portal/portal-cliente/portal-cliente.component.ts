import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { ArquivoService } from '../../../core/api/projetos/arquivo.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { HonorarioService } from '../../../core/api/honorarios/honorario.service';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Projeto, EtapaProjeto, StatusProjeto, StatusEtapa, TipoProjeto, TarefaEtapa } from '../../../models/projeto.model';
import { Arquivo } from '../../../models/arquivo.model';
import { PropostaHonorario } from '../../../models/honorario.model';
import { DESIGN_SYSTEM, ChatWidgetComponent } from '../../../shared';
import { PortalHeroComponent } from '../portal-hero/portal-hero.component';
import { PortalTimelineComponent } from '../portal-timeline/portal-timeline.component';
import { PortalDocumentosComponent } from '../portal-documentos/portal-documentos.component';
import { PortalSuporteComponent } from '../portal-suporte/portal-suporte.component';
import { ModalPropostaPdfComponent, PropostaVisualizacaoData } from '../../honorarios/modal-proposta-pdf/modal-proposta-pdf.component';

@Component({
  selector: 'app-portal-cliente',
  standalone: true,
  imports: [
    CommonModule,
    DESIGN_SYSTEM,
    PortalHeroComponent,
    PortalTimelineComponent,
    PortalDocumentosComponent,
    PortalSuporteComponent,
    ModalPropostaPdfComponent
  ],
  templateUrl: './portal-cliente.component.html',
  styleUrl: './portal-cliente.component.scss'
})
export class PortalClienteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private projetoService = inject(ProjetoService);
  private arquivoService = inject(ArquivoService);
  private clienteService = inject(ClienteService);
  private honorarioService = inject(HonorarioService);
  private configPropostaService = inject(ConfiguracaoPropostaService);
  private notificationService = inject(NotificationService, { optional: true });

  projetoId = '';
  projeto: Projeto | null = null;
  arquivos: Arquivo[] = [];
  propostaVinculada: PropostaHonorario | null = null;
  modalPdfAberto = false;
  propostaParaPdf: PropostaVisualizacaoData | null = null;

  loading = true;
  filtroArquivo: 'todos' | 'plantas' | 'documentos' | 'imagens' = 'todos';

  @ViewChild(ChatWidgetComponent) chatWidget?: ChatWidgetComponent;

  StatusProjeto = StatusProjeto;
  StatusEtapa = StatusEtapa;
  TipoProjeto = TipoProjeto;

  abrirChat(): void {
    if (this.chatWidget && !this.chatWidget.isOpen) {
      this.chatWidget.toggleChat();
    }
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    const userProjectId = this.authService.currentUserValue?.projetoId;

    this.projetoId = paramId || userProjectId || '';

    if (this.projetoId) {
      this.carregarDados();
    } else {
      this.loading = false;
    }
  }

  carregarDados(): void {
    this.loading = true;
    this.projetoService.obterPorId(this.projetoId).subscribe({
      next: (data) => {
        this.projeto = {
          ...data,
          status: this.normalizarStatus(data.status),
          tipo: typeof data.tipo === 'string' ? ['Residencial', 'Comercial', 'Corporativo', 'Interiores'].indexOf(data.tipo) : Number(data.tipo),
          etapas: (data.etapas || []).map(e => ({
            ...e,
            status: this.normalizarStatusEtapa(e.status),
            tarefas: e.tarefas || []
          })).sort((a, b) => a.ordem - b.ordem)
        };

        if (data.clienteId && !data.clienteNome) {
          this.clienteService.obterPorId(data.clienteId).subscribe({
            next: (c) => {
              if (this.projeto) this.projeto.clienteNome = c.nome;
            }
          });
        }

        this.carregarArquivos();
        this.carregarPropostaVinculada(data.clienteId);
      },
      error: (err) => {
        console.error('Erro ao carregar projeto no portal', err);
        this.loading = false;
        this.notificationService?.error('Erro ao carregar dados do projeto.');
      }
    });
  }

  carregarArquivos(): void {
    this.arquivoService.obterPorProjeto(this.projetoId).subscribe({
      next: (files) => {
        this.arquivos = files;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar arquivos no portal', err);
        this.loading = false;
        this.notificationService?.error('Erro ao carregar arquivos do projeto.');
      }
    });
  }

  carregarPropostaVinculada(clienteId?: string): void {
    if (!clienteId) return;
    this.honorarioService.obterPropostas().subscribe({
      next: (propostas) => {
        const prop = (propostas || []).find(p => p.clienteId === clienteId);
        if (prop) {
          this.propostaVinculada = prop;
        }
      },
      error: () => {}
    });
  }

  abrirPdfProposta(): void {
    if (!this.projeto) return;

    if (this.propostaVinculada) {
      const etapas = (this.propostaVinculada.itensEtapa || []).map((i: any) => ({
        nome: i.nomeEtapa,
        descricao: i.descricao,
        percentual: i.percentual,
        valor: i.valor,
        incluso: i.incluso
      }));

      this.propostaParaPdf = {
        codigo: this.propostaVinculada.codigo,
        titulo: this.propostaVinculada.titulo || this.projeto.nome,
        clienteNome: this.propostaVinculada.clienteNome || this.projeto.clienteNome,
        metragemQuadrada: this.propostaVinculada.metragemQuadrada || this.projeto.metragemTotal || 0,
        padraoImovelNome: this.propostaVinculada.padraoImovelNome,
        tipoProjetoNome: this.propostaVinculada.tipoProjetoNome || this.tipoProjetoFormatado,
        valorTotalSugerido: this.propostaVinculada.valorTotalSugerido,
        valorFinalAjustado: this.propostaVinculada.valorFinalAjustado,
        criadoEm: this.propostaVinculada.criadoEm,
        statusNome: this.propostaVinculada.statusNome || 'Aprovada',
        etapas: etapas.length > 0 ? etapas : (this.projeto.etapas || []).map(e => ({
          nome: e.nome,
          descricao: e.descricao,
          percentual: Math.round(100 / (this.projeto?.etapas?.length || 1)),
          valor: 0
        }))
      };
    } else {
      const etapas = (this.projeto.etapas || []).map(e => ({
        nome: e.nome,
        descricao: e.descricao,
        percentual: Math.round(100 / (this.projeto?.etapas?.length || 1)),
        valor: 0
      }));

      this.propostaParaPdf = {
        codigo: 'CONTRATO-' + this.projeto.id.substring(0, 8).toUpperCase(),
        titulo: this.projeto.nome,
        clienteNome: this.projeto.clienteNome || 'Cliente',
        metragemQuadrada: this.projeto.metragemTotal || 0,
        tipoProjetoNome: this.tipoProjetoFormatado,
        valorFinalAjustado: 0,
        criadoEm: this.projeto.dataInicio || new Date().toISOString(),
        statusNome: 'Aprovado',
        etapas
      };
    }

    this.modalPdfAberto = true;
  }

  fecharModalPdf(): void {
    this.modalPdfAberto = false;
    this.propostaParaPdf = null;
  }

  normalizarStatus(status: any): StatusProjeto {
    if (typeof status === 'string') {
      const idx = ['Briefing', 'Desenvolvimento', 'Revisao', 'Aprovacao', 'Execucao', 'Concluido', 'Cancelado'].indexOf(status);
      if (idx >= 0) return idx as StatusProjeto;
    }
    return Number(status) as StatusProjeto;
  }

  normalizarStatusEtapa(status: any): StatusEtapa {
    if (typeof status === 'string') {
      const lower = status.toLowerCase();
      if (lower.includes('andamento')) return StatusEtapa.EmAndamento;
      if (lower.includes('conclui')) return StatusEtapa.Concluida;
      return StatusEtapa.Pendente;
    }
    return Number(status) as StatusEtapa;
  }

  get totalEtapas(): number {
    return this.projeto?.etapas?.length || 0;
  }

  get etapasConcluidas(): EtapaProjeto[] {
    return (this.projeto?.etapas || []).filter(e => e.status === StatusEtapa.Concluida);
  }

  get totalConcluidas(): number {
    return this.etapasConcluidas.length;
  }

  get percentualProgresso(): number {
    if (this.totalEtapas === 0) return 0;
    return Math.round((this.totalConcluidas / this.totalEtapas) * 100);
  }

  get etapaAtual(): EtapaProjeto | undefined {
    return (this.projeto?.etapas || []).find(e => e.status === StatusEtapa.EmAndamento) ||
           (this.projeto?.etapas || []).find(e => e.status === StatusEtapa.Pendente);
  }

  get proximosPassos(): EtapaProjeto[] {
    if (!this.etapaAtual) return [];
    return (this.projeto?.etapas || [])
      .filter(e => e.ordem > this.etapaAtual!.ordem && e.status === StatusEtapa.Pendente);
  }

  get tipoProjetoFormatado(): string {
    const tipos = ['Residencial', 'Comercial', 'Corporativo', 'Design de Interiores'];
    if (this.projeto && this.projeto.tipo !== undefined && this.projeto.tipo !== null) {
      return tipos[this.projeto.tipo] || 'Geral';
    }
    return 'Geral';
  }

  get statusProjetoLabel(): string {
    const labels = ['Briefing', 'Desenvolvimento', 'Revisão', 'Aprovação', 'Execução', 'Concluído', 'Cancelado'];
    if (this.projeto && this.projeto.status !== undefined && this.projeto.status !== null) {
      return labels[this.projeto.status] || 'Em Andamento';
    }
    return 'Em Andamento';
  }

  get arquivosFiltrados(): Arquivo[] {
    if (this.filtroArquivo === 'todos') return this.arquivos;
    if (this.filtroArquivo === 'plantas') {
      return this.arquivos.filter(a => {
        const ext = a.nome.split('.').pop()?.toLowerCase();
        return ['dwg', 'dxf', 'rvt', 'skp', 'ifc'].includes(ext || '') || (a.tipo?.toLowerCase().includes('cad') ?? false);
      });
    }
    if (this.filtroArquivo === 'documentos') {
      return this.arquivos.filter(a => {
        const ext = a.nome.split('.').pop()?.toLowerCase();
        return ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '') || (a.tipo?.toLowerCase().includes('pdf') ?? false);
      });
    }
    if (this.filtroArquivo === 'imagens') {
      return this.arquivos.filter(a => {
        const ext = a.nome.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext || '') || (a.tipo?.toLowerCase().includes('image') ?? false);
      });
    }
    return this.arquivos;
  }

  setFiltroArquivo(filtro: 'todos' | 'plantas' | 'documentos' | 'imagens'): void {
    this.filtroArquivo = filtro;
  }

  baixarArquivo(arquivo: Arquivo): void {
    if (arquivo.urlStorage) {
      window.open(arquivo.urlStorage, '_blank');
    }
  }

  formatarData(data: any): string {
    if (!data) return 'Não definida';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }

  formatarMoeda(valor?: number): string {
    return this.configPropostaService.formatarMoeda(valor || 0);
  }
}
