import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../core/api/agenda/agenda.service';
import { Compromisso, TiposCompromisso, TipoCompromisso, StatusCompromissoType } from '../../models/agenda.model';
import { CompromissoModalComponent } from '../../dialogs/agenda/compromisso-modal/compromisso-modal.component';
import { ConfigurarAgendaModalComponent } from '../../dialogs/agenda/configurar-agenda-modal/configurar-agenda-modal.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfiguracaoAgendaEmpresa } from '../../models/agenda.model';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { NotificationService } from '../../core/services/notification.service';

export interface DiaCalendario {
  data: Date;
  diaNumero: number;
  mesmoMes: boolean;
  isHoje: boolean;
  compromissos: Compromisso[];
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    SelectComponent,
    BadgeComponent,
    EmptyStateComponent
  ],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  private agendaService = inject(AgendaService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);

  modoVisualizacao: 'calendario' | 'lista' = 'calendario';

  compromissos: Compromisso[] = [];
  configuracaoEmpresa: ConfiguracaoAgendaEmpresa | null = null;
  carregando = false;
  termoBusca = '';
  filtroTipo = 'todos';
  filtroStatus = 'todos';

  dataReferencia: Date = new Date();
  diasSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  diasMes: DiaCalendario[] = [];

  filtroTipoOptions: SelectOption[] = [
    { label: 'Todos os Tipos', value: 'todos' },
    { label: 'Reunião com Cliente', value: TiposCompromisso.ReuniaoCliente },
    { label: 'Visita à Obra', value: TiposCompromisso.VisitaObra },
    { label: 'Medição Técnica', value: TiposCompromisso.MedicaoTecnica },
    { label: 'Apresentação de Projeto', value: TiposCompromisso.ApresentacaoProjeto },
    { label: 'Entrega de Etapa', value: TiposCompromisso.EntregaEtapa },
    { label: 'Geral / Outro', value: TiposCompromisso.Geral }
  ];

  filtroStatusOptions: SelectOption[] = [
    { label: 'Todos os Status', value: 'todos' },
    { label: 'Agendados', value: 'Agendado' },
    { label: 'Concluídos', value: 'Concluido' },
    { label: 'Cancelados', value: 'Cancelado' }
  ];

  get podeConfigurarAgenda(): boolean {
    const perfil = this.authService.currentUserValue?.perfil;
    return perfil === 'Administrador' || perfil === 'Gerente' || perfil === 'ArquitetoAdmin';
  }

  ngOnInit(): void {
    this.tratarRetornoOAuthPopup();
    this.carregarCompromissos();
    this.carregarConfiguracaoEmpresa();
  }

  private tratarRetornoOAuthPopup(): void {
    if (typeof window !== 'undefined' && window.opener && window.location.search.includes('code=')) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
          window.opener.postMessage({ type: 'GOOGLE_OAUTH_CODE', code }, window.location.origin);
          window.close();
        }
      } catch (e) {
        console.error('Erro ao processar retorno OAuth:', e);
      }
    }
  }

  carregarConfiguracaoEmpresa(): void {
    this.agendaService.obterConfiguracaoAgendaEmpresa().subscribe({
      next: (config) => {
        this.configuracaoEmpresa = config;
      },
      error: () => {
        this.configuracaoEmpresa = null;
      }
    });
  }

  abrirModalConfiguracao(): void {
    const ref = this.dialogService.open(ConfigurarAgendaModalComponent);
    ref.instance.saved.subscribe((config: ConfiguracaoAgendaEmpresa) => {
      this.configuracaoEmpresa = config;
    });
  }

  abrirGoogleAgendaEmpresa(): void {
    if (this.configuracaoEmpresa?.linkEmbedGoogleCalendar) {
      window.open(this.configuracaoEmpresa.linkEmbedGoogleCalendar, '_blank');
    }
  }

  get mesAnoTitulo(): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[this.dataReferencia.getMonth()]} de ${this.dataReferencia.getFullYear()}`;
  }

  get totalCompromissosMes(): number {
    return this.compromissos.length;
  }

  get totalReunioes(): number {
    return this.compromissos.filter(c => c.tipo === TiposCompromisso.ReuniaoCliente || c.tipo === TiposCompromisso.ApresentacaoProjeto).length;
  }

  get totalVisitasObras(): number {
    return this.compromissos.filter(c => c.tipo === TiposCompromisso.VisitaObra || c.tipo === TiposCompromisso.MedicaoTecnica).length;
  }

  get totalConcluidos(): number {
    return this.compromissos.filter(c => c.status === 'Concluido').length;
  }

  get compromissosFiltrados(): Compromisso[] {
    return this.compromissos.filter(item => {
      const matchBusca = !this.termoBusca ||
        item.titulo.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (item.local && item.local.toLowerCase().includes(this.termoBusca.toLowerCase())) ||
        (item.nomeCliente && item.nomeCliente.toLowerCase().includes(this.termoBusca.toLowerCase())) ||
        (item.nomeProjeto && item.nomeProjeto.toLowerCase().includes(this.termoBusca.toLowerCase()));

      const matchTipo = this.filtroTipo === 'todos' || item.tipo === this.filtroTipo;
      const matchStatus = this.filtroStatus === 'todos' || item.status === this.filtroStatus;

      return matchBusca && matchTipo && matchStatus;
    });
  }

  carregarCompromissos(): void {
    this.carregando = true;

    // Obter primeiro e último dia do mês corrente na visão
    const ano = this.dataReferencia.getFullYear();
    const mes = this.dataReferencia.getMonth();
    const inicio = new Date(ano, mes, 1, 0, 0, 0).toISOString();
    const fim = new Date(ano, mes + 1, 0, 23, 59, 59).toISOString();

    this.agendaService.listar(inicio, fim).subscribe({
      next: (dados) => {
        this.compromissos = dados || [];
        this.gerarGradeCalendario();
        this.carregando = false;
      },
      error: () => {
        this.compromissos = [];
        this.gerarGradeCalendario();
        this.carregando = false;
      }
    });
  }

  gerarGradeCalendario(): void {
    const ano = this.dataReferencia.getFullYear();
    const mes = this.dataReferencia.getMonth();
    const primeiroDiaMes = new Date(ano, mes, 1);
    const ultimoDiaMes = new Date(ano, mes + 1, 0);

    const dias: DiaCalendario[] = [];
    const hojeStr = new Date().toDateString();

    // Dias do mês anterior para completar o início da semana (Domingo = 0)
    const diaSemanaInicio = primeiroDiaMes.getDay();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      const data = new Date(ano, mes, -i);
      dias.push({
        data,
        diaNumero: data.getDate(),
        mesmoMes: false,
        isHoje: data.toDateString() === hojeStr,
        compromissos: this.obterCompromissosDoDia(data)
      });
    }

    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
      const data = new Date(ano, mes, dia);
      dias.push({
        data,
        diaNumero: dia,
        mesmoMes: true,
        isHoje: data.toDateString() === hojeStr,
        compromissos: this.obterCompromissosDoDia(data)
      });
    }

    // Dias do próximo mês para fechar a grade (múltiplo de 7)
    const resto = dias.length % 7;
    if (resto > 0) {
      const faltam = 7 - resto;
      for (let i = 1; i <= faltam; i++) {
        const data = new Date(ano, mes + 1, i);
        dias.push({
          data,
          diaNumero: data.getDate(),
          mesmoMes: false,
          isHoje: data.toDateString() === hojeStr,
          compromissos: this.obterCompromissosDoDia(data)
        });
      }
    }

    this.diasMes = dias;
  }

  private obterCompromissosDoDia(data: Date): Compromisso[] {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();

    return this.compromissosFiltrados.filter(c => {
      const dataComp = new Date(c.dataHoraInicio);
      return dataComp.getFullYear() === ano &&
             dataComp.getMonth() === mes &&
             dataComp.getDate() === dia;
    });
  }

  mesAnterior(): void {
    this.dataReferencia = new Date(this.dataReferencia.getFullYear(), this.dataReferencia.getMonth() - 1, 1);
    this.carregarCompromissos();
  }

  proximoMes(): void {
    this.dataReferencia = new Date(this.dataReferencia.getFullYear(), this.dataReferencia.getMonth() + 1, 1);
    this.carregarCompromissos();
  }

  irParaHoje(): void {
    this.dataReferencia = new Date();
    this.carregarCompromissos();
  }

  abrirModalNovo(data?: Date): void {
    let dataInicial: string;
    if (data) {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      dataInicial = `${ano}-${mes}-${dia}`;
    } else {
      dataInicial = new Date().toISOString().substring(0, 10);
    }

    const ref = this.dialogService.open(CompromissoModalComponent, {
      data: { dataInicial }
    });
    ref.instance.saved.subscribe(() => {
      this.carregarCompromissos();
    });
  }

  abrirModalEditar(compromisso: Compromisso, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const ref = this.dialogService.open(CompromissoModalComponent, {
      data: { compromissoParaEdicao: compromisso }
    });
    ref.instance.saved.subscribe(() => {
      this.carregarCompromissos();
    });
  }

  onCompromissoSalvo(): void {
    this.carregarCompromissos();
  }

  marcarComoConcluido(compromisso: Compromisso, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const novoStatus: StatusCompromissoType = compromisso.status === 'Concluido' ? 'Agendado' : 'Concluido';
    this.agendaService.alterarStatus(compromisso.id, { status: novoStatus }).subscribe({
      next: () => {
        compromisso.status = novoStatus;
        this.carregarCompromissos();
      }
    });
  }

  abrirModalExcluir(compromisso: Compromisso, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const ref = this.dialogService.open(ConfirmDialogComponent, {
      data: {
        title: 'Remover Compromisso da Agenda',
        message: `Tem certeza que deseja remover o compromisso "${compromisso.titulo}"? Esta ação não pode ser desfeita.`
      }
    });
    ref.instance.confirm.subscribe(() => {
      this.agendaService.excluir(compromisso.id).subscribe({
        next: () => {
          this.notificationService.success('Compromisso excluído com sucesso.');
          this.carregarCompromissos();
        },
        error: () => {
          this.notificationService.error('Não foi possível excluir o compromisso.');
        }
      });
    });
  }

  abrirGoogleAgenda(compromisso: Compromisso, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (compromisso.linkGoogleCalendarWeb) {
      window.open(compromisso.linkGoogleCalendarWeb, '_blank');
    }
  }

  abrirMeet(compromisso: Compromisso, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (compromisso.linkGoogleMeet) {
      window.open(compromisso.linkGoogleMeet, '_blank');
    }
  }

  baixarIcs(): void {
    const url = this.agendaService.exportarIcsUrl();
    window.open(url, '_blank');
  }

  obterBadgeClasseTipo(tipo: TipoCompromisso): string {
    switch (tipo) {
      case TiposCompromisso.ReuniaoCliente:
        return 'badge-tipo-reuniao';
      case TiposCompromisso.VisitaObra:
        return 'badge-tipo-obra';
      case TiposCompromisso.MedicaoTecnica:
        return 'badge-tipo-medicao';
      case TiposCompromisso.ApresentacaoProjeto:
        return 'badge-tipo-apresentacao';
      case TiposCompromisso.EntregaEtapa:
        return 'badge-tipo-entrega';
      default:
        return 'badge-tipo-geral';
    }
  }

  obterNomeTipo(tipo: TipoCompromisso): string {
    const map: Record<string, string> = {
      [TiposCompromisso.ReuniaoCliente]: 'Reunião',
      [TiposCompromisso.VisitaObra]: 'Visita Obra',
      [TiposCompromisso.MedicaoTecnica]: 'Medição',
      [TiposCompromisso.ApresentacaoProjeto]: 'Apresentação',
      [TiposCompromisso.EntregaEtapa]: 'Entrega Etapa',
      [TiposCompromisso.Geral]: 'Geral'
    };
    return map[tipo] || tipo;
  }

  formatarHora(dataIso: string): string {
    const d = new Date(dataIso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatarDataCompleta(dataIso: string): string {
    const d = new Date(dataIso);
    return d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  }

  obterBadgeVarianteTipo(tipo: TipoCompromisso): 'primary' | 'info' | 'warning' | 'neutral' {
    switch (tipo) {
      case TiposCompromisso.ReuniaoCliente:
      case TiposCompromisso.ApresentacaoProjeto:
        return 'primary';
      case TiposCompromisso.VisitaObra:
        return 'warning';
      case TiposCompromisso.MedicaoTecnica:
      case TiposCompromisso.EntregaEtapa:
        return 'info';
      default:
        return 'neutral';
    }
  }

  obterBadgeVarianteStatus(status: StatusCompromissoType | string): 'success' | 'danger' | 'neutral' {
    if (status === 'Concluido') return 'success';
    if (status === 'Cancelado') return 'danger';
    return 'neutral';
  }
}
