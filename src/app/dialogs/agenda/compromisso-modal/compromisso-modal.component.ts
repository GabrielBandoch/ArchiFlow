import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Compromisso, CriarCompromissoCommand, AtualizarCompromissoCommand, TiposCompromisso } from '../../../models/agenda.model';
import { AgendaForm } from '../../../components/agenda/agenda.form';
import { Projeto } from '../../../models/projeto.model';
import { Cliente } from '../../../models/cliente.model';
import { Lead } from '../../../models/lead.model';
import { AgendaService } from '../../../core/api/agenda/agenda.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { LeadService } from '../../../core/api/leads/lead.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../../shared/components/select/select.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ClientSearchComponent } from '../../../shared/components/client-search/client-search.component';
import { ProjectSearchComponent } from '../../../shared/components/project-search/project-search.component';
import { LeadSearchComponent } from '../../../shared/components/lead-search/lead-search.component';

import { UsuarioService } from '../../../core/api/usuarios/usuario.service';
import { MembroEquipe } from '../../../models/usuario.model';

@Component({
  selector: 'app-compromisso-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ClientSearchComponent,
    ProjectSearchComponent,
    LeadSearchComponent
  ],
  templateUrl: './compromisso-modal.component.html',
  styleUrls: ['./compromisso-modal.component.scss']
})
export class CompromissoModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() compromissoParaEdicao: Compromisso | null = null;
  @Input() dataInicial: string | null = null; // YYYY-MM-DD

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Compromisso>();

  form!: FormGroup;
  saving = false;
  submitted = false;
  errorMessage = '';

  projetos: Projeto[] = [];
  clientes: Cliente[] = [];
  leads: Lead[] = [];
  membrosEquipe: MembroEquipe[] = [];
  usuariosOptions: SelectOption[] = [];
  tipoVinculo: 'nenhum' | 'projeto' | 'cliente' | 'lead' = 'nenhum';

  tiposOptions: SelectOption[] = [
    { label: 'Reunião com Cliente', value: TiposCompromisso.ReuniaoCliente },
    { label: 'Visita à Obra', value: TiposCompromisso.VisitaObra },
    { label: 'Medição Técnica', value: TiposCompromisso.MedicaoTecnica },
    { label: 'Apresentação de Projeto', value: TiposCompromisso.ApresentacaoProjeto },
    { label: 'Entrega de Etapa', value: TiposCompromisso.EntregaEtapa },
    { label: 'Geral / Outro', value: TiposCompromisso.Geral }
  ];

  statusOptions: SelectOption[] = [
    { label: 'Agendado', value: 'Agendado' },
    { label: 'Concluído', value: 'Concluido' },
    { label: 'Cancelado', value: 'Cancelado' }
  ];

  projetosOptions: SelectOption[] = [
    { label: 'Nenhum projeto vinculado', value: '' }
  ];

  clientesOptions: SelectOption[] = [
    { label: 'Nenhum cliente vinculado', value: '' }
  ];

  selecionarTipo(tipo: string): void {
    this.form.patchValue({ tipo });
  }

  isTipoSelecionado(tipo: string): boolean {
    return this.form.get('tipo')?.value === tipo;
  }

  selecionarTipoVinculo(tipo: 'nenhum' | 'projeto' | 'cliente' | 'lead'): void {
    this.tipoVinculo = tipo;
    if (tipo !== 'projeto') this.form.patchValue({ projetoId: '' });
    if (tipo !== 'cliente') this.form.patchValue({ clienteId: '' });
    if (tipo !== 'lead') this.form.patchValue({ leadId: '' });
  }

  get duracaoEstimada(): string {
    const inicio = this.form.get('horaInicio')?.value;
    const fim = this.form.get('horaFim')?.value;
    if (!inicio || !fim) return '';
    const [h1, m1] = inicio.split(':').map(Number);
    const [h2, m2] = fim.split(':').map(Number);
    const diffMin = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diffMin <= 0) return 'Término menor que início';
    const horas = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    if (horas > 0 && mins > 0) return `${horas}h ${mins}min de duração`;
    if (horas > 0) return `${horas}h de duração`;
    return `${mins}min de duração`;
  }

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private projetoService: ProjetoService,
    private clienteService: ClienteService,
    private notificationService: NotificationService,
    private leadService: LeadService,
    private usuarioService: UsuarioService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarProjetos();
    this.carregarClientes();
    this.carregarLeads();
    this.carregarEquipe();
    this.atualizarValoresForm();
  }

  private carregarEquipe(): void {
    this.usuarioService.obterEquipe().subscribe({
      next: (equipe) => {
        if (equipe && equipe.length > 0) {
          this.membrosEquipe = equipe;
          this.usuariosOptions = [
            { label: 'Nenhum responsável atribuído', value: '' },
            ...equipe.map(m => ({
              label: `${m.nome}${m.cargo ? ' - ' + m.cargo : ''}`,
              value: m.id
            }))
          ];
        }
      },
      error: () => {
        this.usuariosOptions = [
          { label: 'Nenhum responsável atribuído', value: '' }
        ];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compromissoParaEdicao'] || changes['dataInicial'] || changes['show']) {
      this.atualizarValoresForm();
    }
  }

  get isEditing(): boolean {
    return !!this.compromissoParaEdicao;
  }

  get f() {
    return this.form.controls;
  }

  private initForm(): void {
    this.form = AgendaForm.createCompromisso(this.fb);
  }

  private atualizarValoresForm(): void {
    if (!this.form) return;

    this.submitted = false;
    this.errorMessage = '';

    if (this.compromissoParaEdicao) {
      if (this.compromissoParaEdicao.projetoId) {
        this.tipoVinculo = 'projeto';
      } else if (this.compromissoParaEdicao.clienteId) {
        this.tipoVinculo = 'cliente';
      } else if (this.compromissoParaEdicao.leadId) {
        this.tipoVinculo = 'lead';
      } else {
        this.tipoVinculo = 'nenhum';
      }

      const inicio = new Date(this.compromissoParaEdicao.dataHoraInicio);
      const fim = new Date(this.compromissoParaEdicao.dataHoraFim);

      const dataStr = this.formatDateToInput(inicio);
      const horaInicioStr = this.formatTimeToInput(inicio);
      const horaFimStr = this.formatTimeToInput(fim);

      this.form.patchValue({
        titulo: this.compromissoParaEdicao.titulo,
        tipo: this.compromissoParaEdicao.tipo,
        status: this.compromissoParaEdicao.status,
        data: dataStr,
        horaInicio: horaInicioStr,
        horaFim: horaFimStr,
        local: this.compromissoParaEdicao.local || '',
        descricao: this.compromissoParaEdicao.descricao || '',
        projetoId: this.compromissoParaEdicao.projetoId || '',
        clienteId: this.compromissoParaEdicao.clienteId || '',
        leadId: this.compromissoParaEdicao.leadId || '',
        usuarioId: this.compromissoParaEdicao.usuarioId || '',
        gerarGoogleMeet: false,
        linkGoogleMeet: this.compromissoParaEdicao.linkGoogleMeet || ''
      });
    } else {
      this.tipoVinculo = 'nenhum';
      const dataStr = this.dataInicial || new Date().toISOString().substring(0, 10);
      this.form.reset({
        titulo: '',
        tipo: TiposCompromisso.ReuniaoCliente,
        status: 'Agendado',
        data: dataStr,
        horaInicio: '09:00',
        horaFim: '10:00',
        local: '',
        descricao: '',
        projetoId: '',
        clienteId: '',
        leadId: '',
        usuarioId: '',
        gerarGoogleMeet: true,
        linkGoogleMeet: ''
      });
    }
  }

  private formatDateToInput(date: Date): string {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private formatTimeToInput(date: Date): string {
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  private carregarProjetos(): void {
    this.projetoService.obterTodos().subscribe({
      next: (projetos) => {
        if (projetos && projetos.length > 0) {
          this.projetos = projetos;
          const opcoes = projetos.map(p => ({
            label: p.nome,
            value: p.id
          }));
          this.projetosOptions = [
            { label: 'Nenhum projeto vinculado', value: '' },
            ...opcoes
          ];
        }
      },
      error: () => {
        // Fallback gracioso
      }
    });
  }

  private carregarClientes(): void {
    this.clienteService.obterTodos().subscribe({
      next: (clientes) => {
        if (clientes && clientes.length > 0) {
          this.clientes = clientes;
          const opcoes = clientes.map(c => ({
            label: c.nome,
            value: c.id
          }));
          this.clientesOptions = [
            { label: 'Nenhum cliente vinculado', value: '' },
            ...opcoes
          ];
        }
      },
      error: () => {
        // Fallback gracioso
      }
    });
  }

  private carregarLeads(): void {
    this.leadService.obterTodos().subscribe({
      next: (leads) => {
        if (leads && leads.length > 0) {
          this.leads = leads;
        }
      },
      error: () => {
        // Fallback gracioso
      }
    });
  }

  abrirGoogleAgenda(): void {
    if (this.compromissoParaEdicao?.linkGoogleCalendarWeb) {
      window.open(this.compromissoParaEdicao.linkGoogleCalendarWeb, '_blank');
    }
  }

  abrirGoogleMeet(): void {
    const link = this.form.get('linkGoogleMeet')?.value || this.compromissoParaEdicao?.linkGoogleMeet;
    if (link) {
      window.open(link, '_blank');
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      this.notificationService.warning('Preencha os campos obrigatórios do compromisso (título, data e horários).');
      return;
    }

    const val = this.form.value;

    const dataHoraInicio = `${val.data}T${val.horaInicio}:00`;
    const dataHoraFim = `${val.data}T${val.horaFim}:00`;

    if (new Date(dataHoraFim) <= new Date(dataHoraInicio)) {
      this.errorMessage = 'O horário de término deve ser posterior ao horário de início.';
      this.notificationService.warning('O horário de término deve ser posterior ao horário de início.');
      return;
    }

    this.saving = true;

    const projetoId = this.tipoVinculo === 'projeto' && val.projetoId ? val.projetoId : undefined;
    const clienteId = this.tipoVinculo === 'cliente' && val.clienteId ? val.clienteId : undefined;
    const leadId = this.tipoVinculo === 'lead' && val.leadId ? val.leadId : undefined;
    const usuarioId = val.usuarioId ? val.usuarioId : undefined;

    if (this.isEditing && this.compromissoParaEdicao) {
      const command: AtualizarCompromissoCommand = {
        titulo: val.titulo,
        dataHoraInicio,
        dataHoraFim,
        tipo: val.tipo,
        status: val.status,
        local: val.local || undefined,
        descricao: val.descricao || undefined,
        linkGoogleMeet: val.linkGoogleMeet || undefined,
        projetoId,
        clienteId,
        usuarioId,
        ...(leadId ? { leadId } : {})
      } as AtualizarCompromissoCommand;

      this.agendaService.atualizar(this.compromissoParaEdicao.id, command).subscribe({
        next: (compromisso) => {
          this.saving = false;
          this.notificationService.success(`Compromisso "${compromisso.titulo}" atualizado com sucesso!`);
          this.saved.emit(compromisso);
          this.onClose();
        },
        error: (err) => {
          this.saving = false;
          let msg = err.error?.error || err.error?.message || err.error?.mensagem;
          if (!msg && err.error?.errors) {
            const firstKey = Object.keys(err.error.errors)[0];
            msg = err.error.errors[firstKey]?.[0];
          }
          this.errorMessage = msg || 'Erro ao atualizar o compromisso.';
          this.notificationService.error(this.errorMessage);
        }
      });
    } else {
      const command: CriarCompromissoCommand = {
        titulo: val.titulo,
        dataHoraInicio,
        dataHoraFim,
        tipo: val.tipo,
        local: val.local || undefined,
        descricao: val.descricao || undefined,
        projetoId,
        clienteId,
        usuarioId,
        gerarGoogleMeet: val.gerarGoogleMeet,
        ...(leadId ? { leadId } : {})
      } as CriarCompromissoCommand;

      this.agendaService.criar(command).subscribe({
        next: (compromisso) => {
          this.saving = false;
          this.notificationService.success(`Compromisso "${compromisso.titulo}" agendado com sucesso!`);
          this.saved.emit(compromisso);
          this.onClose();
        },
        error: (err) => {
          this.saving = false;
          let msg = err.error?.error || err.error?.message || err.error?.mensagem;
          if (!msg && err.error?.errors) {
            const firstKey = Object.keys(err.error.errors)[0];
            msg = err.error.errors[firstKey]?.[0];
          }
          this.errorMessage = msg || 'Erro ao criar o compromisso.';
          this.notificationService.error(this.errorMessage);
        }
      });
    }
  }
}
