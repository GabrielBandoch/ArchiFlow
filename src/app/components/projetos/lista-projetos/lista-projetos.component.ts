import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
import { Projeto, StatusProjeto, TipoProjeto } from '../../../models/projeto.model';
import { CriarProjetoModalComponent } from '../../../dialogs/projetos/criar-projeto-modal/criar-projeto-modal.component';

@Component({
  selector: 'app-lista-projetos',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM, FormsModule],
  templateUrl: './lista-projetos.component.html',
  styleUrl: './lista-projetos.component.scss'
})
export class ListaProjetosComponent implements OnInit {
  private projetoService = inject(ProjetoService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  projetos: Projeto[] = [];
  projetosFiltrados: Projeto[] = [];
  searchQuery = '';
  filtroStatus: 'todos' | 'andamento' | 'concluidos' | 'briefing' = 'todos';
  loading = true;

  StatusProjeto = StatusProjeto;
  TipoProjeto = TipoProjeto;

  get totalProjetos(): number {
    return this.projetos.length;
  }

  get totalEmAndamento(): number {
    return this.projetos.filter(p => 
      p.status === StatusProjeto.Desenvolvimento || 
      p.status === StatusProjeto.Revisao || 
      p.status === StatusProjeto.Aprovacao || 
      p.status === StatusProjeto.Execucao
    ).length;
  }

  get totalConcluidos(): number {
    return this.projetos.filter(p => p.status === StatusProjeto.Concluido).length;
  }

  get totalMetragem(): number {
    return this.projetos.reduce((acc, p) => acc + (p.metragemTotal || 0), 0);
  }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  normalizarStatus(status: any): StatusProjeto {
    if (typeof status === 'string') {
      const idx = ['Briefing', 'Desenvolvimento', 'Revisao', 'Aprovacao', 'Execucao', 'Concluido', 'Cancelado'].indexOf(status);
      if (idx >= 0) return idx as StatusProjeto;
    }
    return Number(status) as StatusProjeto;
  }

  carregarProjetos(): void {
    this.loading = true;
    this.projetoService.obterTodos().subscribe({
      next: (data) => {
        this.projetos = data.map(p => ({
          ...p,
          status: this.normalizarStatus(p.status)
        }));
        this.filtrarProjetos();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao carregar projetos', err);
        this.notificationService.error('Erro ao carregar lista de projetos.');
      }
    });
  }

  setFiltro(status: 'todos' | 'andamento' | 'concluidos' | 'briefing'): void {
    this.filtroStatus = status;
    this.filtrarProjetos();
  }

  filtrarProjetos(): void {
    let result = this.projetos;

    if (this.filtroStatus === 'andamento') {
      result = result.filter(p => 
        p.status === StatusProjeto.Desenvolvimento || 
        p.status === StatusProjeto.Revisao || 
        p.status === StatusProjeto.Aprovacao || 
        p.status === StatusProjeto.Execucao
      );
    } else if (this.filtroStatus === 'concluidos') {
      result = result.filter(p => p.status === StatusProjeto.Concluido);
    } else if (this.filtroStatus === 'briefing') {
      result = result.filter(p => p.status === StatusProjeto.Briefing);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.nome.toLowerCase().includes(q) ||
        (p.descricao && p.descricao.toLowerCase().includes(q)) ||
        (p.clienteNome && p.clienteNome.toLowerCase().includes(q)) ||
        p.tipoLabel.toLowerCase().includes(q)
      );
    }

    this.projetosFiltrados = result;
  }

  abrirCriarModal(): void {
    const ref = this.dialogService.open(CriarProjetoModalComponent);
    ref.instance.saved.subscribe((novo: Projeto) => {
      this.carregarProjetos();
      this.router.navigate(['/projetos', novo.id]);
    });
  }

  verDetalhes(id: string): void {
    this.router.navigate(['/projetos', id]);
  }
}
