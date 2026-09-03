import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { ArquivoService } from '../../../core/api/projetos/arquivo.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { Projeto, EtapaProjeto, StatusProjeto, StatusEtapa, TipoProjeto, TarefaEtapa } from '../../../models/projeto.model';
import { Arquivo } from '../../../models/arquivo.model';
import { DESIGN_SYSTEM, ChatWidgetComponent } from '../../../shared';

@Component({
  selector: 'app-portal-cliente',
  standalone: true,
  imports: [CommonModule, DESIGN_SYSTEM],
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

  projetoId = '';
  projeto: Projeto | null = null;
  arquivos: Arquivo[] = [];
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
      },
      error: (err) => {
        console.error('Erro ao carregar projeto no portal', err);
        this.loading = false;
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
      }
    });
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

  getFileIcon(nome: string): string {
    const ext = nome.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (['dwg', 'dxf', 'rvt', 'skp'].includes(ext || '')) return 'architecture';
    return 'description';
  }

  formatarData(data: any): string {
    if (!data) return 'Não definida';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }
}
