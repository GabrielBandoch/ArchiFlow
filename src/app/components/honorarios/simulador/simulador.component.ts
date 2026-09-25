import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HonorarioService } from '../../../core/api/honorarios/honorario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { LeadService } from '../../../core/api/leads/lead.service';
import { Cliente } from '../../../models/cliente.model';
import { Lead } from '../../../models/lead.model';
import {
  SimulacaoResultado,
  PropostaHonorario,
  CriarPropostaCommand
} from '../../../models/honorario.model';

import { DESIGN_SYSTEM } from '../../../shared';
import { ParametrosProjetoComponent } from './components/parametros-projeto/parametros-projeto.component';
import { EtapasEscopoComponent } from './components/etapas-escopo/etapas-escopo.component';
import { EstimativaDestaqueComponent } from './components/estimativa-destaque/estimativa-destaque.component';
import { MemoriaCalculoCardComponent } from './components/memoria-calculo/memoria-calculo.component';
import { ModalSalvarPropostaComponent } from './components/modal-salvar-proposta/modal-salvar-proposta.component';
import { ModalAjusteManualComponent } from './components/modal-ajuste-manual/modal-ajuste-manual.component';
import { ModalHistoricoPropostasComponent } from './components/modal-historico-propostas/modal-historico-propostas.component';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DESIGN_SYSTEM,
    ParametrosProjetoComponent,
    EtapasEscopoComponent,
    EstimativaDestaqueComponent,
    MemoriaCalculoCardComponent,
    ModalSalvarPropostaComponent,
    ModalAjusteManualComponent,
    ModalHistoricoPropostasComponent
  ],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.scss'
})
export class SimuladorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private honorarioService = inject(HonorarioService);
  private notificationService = inject(NotificationService);
  private clienteService = inject(ClienteService);
  private leadService = inject(LeadService);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  simulacao?: SimulacaoResultado;
  carregando = false;
  salvando = false;

  clientes: Cliente[] = [];
  leads: Lead[] = [];
  propostas: PropostaHonorario[] = [];

  modalSalvarAberto = false;
  modalHistoricoAberto = false;
  modalAjusteManualAberto = false;

  propostaForm!: FormGroup;
  ajusteForm!: FormGroup;

  etapasDisponiveis = [
    { nome: 'Estudo Preliminar & Moodboard', descricao: 'Levantamento, briefing, diagnóstico de necessidades e partido conceitual.', percentual: 20, checked: true },
    { nome: 'Anteprojeto & Modelagem 3D', descricao: 'Plantas de layout humanizadas e volumetria tridimensional realista.', percentual: 25, checked: true },
    { nome: 'Projeto Executivo & Detalhamento', descricao: 'Caderno técnico completo com paginações, iluminação, pontos e marcenaria.', percentual: 35, checked: true },
    { nome: 'Projeto Legal & Aprovação', descricao: 'Pranchas normativas para aprovação em condomínio ou prefeitura.', percentual: 10, checked: true },
    { nome: 'Entrega Técnica, Caderno & Vistoria', descricao: 'Emissão de ART/RRT, montagem do caderno final e vistoria técnica.', percentual: 10, checked: true }
  ];

  padroesImovel = [
    { valor: 0, nome: 'Econômico', fator: 'Fator 0.8' },
    { valor: 1, nome: 'Médio', fator: 'Fator 1.0' },
    { valor: 2, nome: 'Alto Padrão', fator: 'Fator 1.3' },
    { valor: 3, nome: 'Luxo', fator: 'Fator 1.6' }
  ];

  tiposProjeto = [
    { valor: 0, nome: 'Residencial' },
    { valor: 1, nome: 'Comercial' },
    { valor: 2, nome: 'Corporativo' },
    { valor: 3, nome: 'Interiores' }
  ];

  ngOnInit(): void {
    this.iniciarFormularios();
    this.carregarDadosAuxiliares();
    this.configurarObservadoresReativos();
    this.calcularSimulacao();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private iniciarFormularios(): void {
    this.form = this.fb.group({
      metragemQuadrada: [150, [Validators.required, Validators.min(1)]],
      tipoProjeto: [0, Validators.required],
      padraoImovel: [1, Validators.required],
      valorMetroQuadradoBase: [95],
      valorHoraBase: [42.86]
    });

    this.propostaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      tipoVinculo: ['nenhum'],
      clienteId: [''],
      leadId: [''],
      valorFinalAjustado: [0, [Validators.required, Validators.min(1)]],
      observacoes: ['']
    });

    this.ajusteForm = this.fb.group({
      valorAjustado: [0, [Validators.required, Validators.min(1)]],
      motivo: ['']
    });
  }

  private configurarObservadoresReativos(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.form.valid) {
          this.calcularSimulacao();
        }
      });
  }

  private carregarDadosAuxiliares(): void {
    this.clienteService.obterTodos().subscribe({
      next: (clientes) => {
        this.clientes = clientes || [];
      },
      error: () => {}
    });

    this.leadService.obterTodos().subscribe({
      next: (leads) => {
        this.leads = leads || [];
      },
      error: () => {}
    });
  }

  calcularSimulacao(): void {
    if (this.form.invalid) return;

    this.carregando = true;
    const formVal = this.form.value;
    const etapasInclusas = this.etapasDisponiveis
      .filter(e => e.checked)
      .map(e => e.nome);

    this.honorarioService.simular({
      metragemQuadrada: Number(formVal.metragemQuadrada),
      tipoProjeto: Number(formVal.tipoProjeto),
      padraoImovel: Number(formVal.padraoImovel),
      etapasInclusas,
      valorMetroQuadradoBase: formVal.valorMetroQuadradoBase ? Number(formVal.valorMetroQuadradoBase) : undefined,
      valorHoraBase: formVal.valorHoraBase ? Number(formVal.valorHoraBase) : undefined
    }).subscribe({
      next: (resultado) => {
        this.simulacao = resultado;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Não foi possível calcular a estimativa de honorários.');
      }
    });
  }

  selecionarPadrao(valor: number): void {
    this.form.patchValue({ padraoImovel: valor }, { emitEvent: false });
    this.calcularSimulacao();
  }

  toggleEtapa(index: number): void {
    this.etapasDisponiveis[index].checked = !this.etapasDisponiveis[index].checked;
    this.calcularSimulacao();
  }

  abrirModalSalvar(comVinculo: boolean = false): void {
    if (!this.simulacao) return;

    const valorSugerido = this.simulacao.valorTotalSugerido;
    const tipoNome = this.tiposProjeto.find(t => t.valor === this.form.value.tipoProjeto)?.nome || 'Projeto';

    this.propostaForm.reset({
      titulo: `Proposta ${tipoNome} - ${this.simulacao.metragemQuadrada}m²`,
      tipoVinculo: comVinculo ? 'lead' : 'nenhum',
      clienteId: '',
      leadId: '',
      valorFinalAjustado: valorSugerido,
      observacoes: ''
    });

    this.modalSalvarAberto = true;
  }

  fecharModalSalvar(): void {
    this.modalSalvarAberto = false;
  }

  salvarProposta(): void {
    if (this.propostaForm.invalid || !this.simulacao || this.salvando) return;

    this.salvando = true;
    const val = this.propostaForm.value;
    const etapasInclusas = this.etapasDisponiveis
      .filter(e => e.checked)
      .map(e => e.nome);

    const command: CriarPropostaCommand = {
      titulo: val.titulo.trim(),
      clienteId: val.tipoVinculo === 'cliente' && val.clienteId ? val.clienteId : undefined,
      leadId: val.tipoVinculo === 'lead' && val.leadId ? val.leadId : undefined,
      tipoProjeto: Number(this.form.value.tipoProjeto),
      padraoImovel: Number(this.form.value.padraoImovel),
      metragemQuadrada: Number(this.simulacao.metragemQuadrada),
      valorMetroQuadradoBase: this.simulacao.memoriaCalculo.valorMetroQuadradoBase,
      valorHoraBase: this.simulacao.memoriaCalculo.valorHoraEstimado,
      valorFinalAjustado: Number(val.valorFinalAjustado),
      etapasInclusas,
      observacoes: val.observacoes ? val.observacoes.trim() : undefined
    };

    this.honorarioService.criarProposta(command).subscribe({
      next: (proposta) => {
        this.salvando = false;
        this.modalSalvarAberto = false;
        this.notificationService.success(`Proposta ${proposta.codigo} salva com sucesso!`);
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro ao salvar proposta comercial.');
      }
    });
  }

  abrirModalAjusteManual(): void {
    if (!this.simulacao) return;

    this.ajusteForm.reset({
      valorAjustado: this.simulacao.valorTotalSugerido,
      motivo: ''
    });

    this.modalAjusteManualAberto = true;
  }

  fecharModalAjusteManual(): void {
    this.modalAjusteManualAberto = false;
  }

  confirmarAjusteManual(): void {
    if (this.ajusteForm.invalid || !this.simulacao) return;

    const valorAjustado = Number(this.ajusteForm.value.valorAjustado);
    this.simulacao = {
      ...this.simulacao,
      valorTotalSugerido: valorAjustado,
      valorMetroQuadrado: Math.round(valorAjustado / this.simulacao.metragemQuadrada)
    };

    this.modalAjusteManualAberto = false;
    this.notificationService.success('Valor da estimativa ajustado manualmente!');
  }

  abrirModalHistorico(): void {
    this.carregarPropostas();
    this.modalHistoricoAberto = true;
  }

  fecharModalHistorico(): void {
    this.modalHistoricoAberto = false;
  }

  carregarPropostas(): void {
    this.honorarioService.obterPropostas().subscribe({
      next: (propostas) => {
        this.propostas = propostas || [];
      },
      error: () => {
        this.notificationService.error('Erro ao carregar histórico de propostas.');
      }
    });
  }

  atualizarStatusProposta(proposta: PropostaHonorario, novoStatus: number): void {
    this.honorarioService.atualizarStatus(proposta.id, { status: novoStatus }).subscribe({
      next: (atualizada) => {
        proposta.status = atualizada.status;
        proposta.statusNome = atualizada.statusNome;
        this.notificationService.success(`Status da proposta ${proposta.codigo} atualizado para ${atualizada.statusNome}.`);
      },
      error: () => {
        this.notificationService.error('Erro ao atualizar status da proposta.');
      }
    });
  }

  excluirProposta(proposta: PropostaHonorario): void {
    if (!confirm(`Deseja realmente excluir a proposta ${proposta.codigo}?`)) return;

    this.honorarioService.excluirProposta(proposta.id).subscribe({
      next: () => {
        this.propostas = this.propostas.filter(p => p.id !== proposta.id);
        this.notificationService.success(`Proposta ${proposta.codigo} excluída.`);
      },
      error: () => {
        this.notificationService.error('Erro ao excluir proposta.');
      }
    });
  }

  formatarMoeda(valor?: number): string {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(dataStr?: string): string {
    if (!dataStr) return '-';
    try {
      const d = new Date(dataStr);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return dataStr;
    }
  }
}
