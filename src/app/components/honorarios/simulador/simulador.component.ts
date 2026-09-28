import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HonorarioService } from '../../../core/api/honorarios/honorario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { LeadService } from '../../../core/api/leads/lead.service';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
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
import { ModalPropostaPdfComponent, PropostaVisualizacaoData } from '../modal-proposta-pdf/modal-proposta-pdf.component';

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
    ModalHistoricoPropostasComponent,
    ModalPropostaPdfComponent
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
  private configPropostaService = inject(ConfiguracaoPropostaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  abaAtiva: 'calculadora' | 'historico' = 'calculadora';
  filtroStatus: number | 'todos' = 'todos';
  busca = '';

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
  modalPdfAberto = false;
  propostaParaPdf: PropostaVisualizacaoData | null = null;

  propostaForm!: FormGroup;
  ajusteForm!: FormGroup;

  preselectedClienteId?: string;
  preselectedLeadId?: string;

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

  get propostasFiltradas(): PropostaHonorario[] {
    return this.propostas.filter(p => {
      const matchStatus = this.filtroStatus === 'todos' || p.status === this.filtroStatus;
      const termo = this.busca.toLowerCase().trim();
      const matchBusca = !termo ||
        p.codigo?.toLowerCase().includes(termo) ||
        p.titulo?.toLowerCase().includes(termo) ||
        p.clienteNome?.toLowerCase().includes(termo) ||
        p.leadNome?.toLowerCase().includes(termo);
      return matchStatus && matchBusca;
    });
  }

  ngOnInit(): void {
    this.iniciarFormularios();
    this.carregarDadosAuxiliares();
    this.configurarObservadoresReativos();
    this.calcularSimulacao();
    this.carregarPropostas();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['tab'] === 'historico') {
        this.abaAtiva = 'historico';
      }
      if (params['clienteId']) {
        this.preselectedClienteId = params['clienteId'];
        this.form.patchValue({ tipoVinculo: 'cliente', clienteId: params['clienteId'] });
      }
      if (params['leadId']) {
        this.preselectedLeadId = params['leadId'];
        this.form.patchValue({ tipoVinculo: 'lead', leadId: params['leadId'] });
      }
    });
  }

  setAba(aba: 'calculadora' | 'historico'): void {
    this.abaAtiva = aba;
    if (aba === 'historico') {
      this.carregarPropostas();
    }
  }

  setFiltroStatus(status: number | 'todos'): void {
    this.filtroStatus = status;
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
      valorHoraBase: [42.86],
      tipoVinculo: ['nenhum'],
      clienteId: [''],
      leadId: [''],
      clienteNome: [''],
      clienteTelefone: [''],
      clienteEmail: ['']
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

    let tipoVinculo = this.form.value.tipoVinculo || 'nenhum';
    let clienteId = this.form.value.clienteId || '';
    let leadId = this.form.value.leadId || '';

    if (this.preselectedLeadId) {
      tipoVinculo = 'lead';
      leadId = this.preselectedLeadId;
    } else if (this.preselectedClienteId) {
      tipoVinculo = 'cliente';
      clienteId = this.preselectedClienteId;
    } else if (comVinculo && tipoVinculo === 'nenhum') {
      tipoVinculo = 'lead';
    }

    const clienteInfo = this.extrairDadosClienteVinculado();
    const titulo = !clienteInfo.isRascunho
      ? `Proposta ${tipoNome} - ${clienteInfo.nome} (${this.simulacao.metragemQuadrada}m²)`
      : `Proposta ${tipoNome} - ${this.simulacao.metragemQuadrada}m²`;

    this.propostaForm.reset({
      titulo,
      tipoVinculo: tipoVinculo === 'avulso' ? 'nenhum' : tipoVinculo,
      clienteId,
      leadId,
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
        this.carregarPropostas();
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

  private extrairDadosClienteVinculado(): { nome: string; email: string; telefone: string; isRascunho: boolean } {
    const tipo = this.form.get('tipoVinculo')?.value;
    if (tipo === 'cliente' && this.form.get('clienteId')?.value) {
      const cli = this.clientes.find(c => c.id === this.form.get('clienteId')?.value);
      if (cli) {
        return {
          nome: cli.nome,
          email: cli.email || '',
          telefone: cli.telefone || '',
          isRascunho: false
        };
      }
    } else if (tipo === 'lead' && this.form.get('leadId')?.value) {
      const lead = this.leads.find(l => l.id === this.form.get('leadId')?.value);
      if (lead) {
        return {
          nome: lead.nome,
          email: lead.email || '',
          telefone: lead.telefone || '',
          isRascunho: false
        };
      }
    } else if (tipo === 'avulso' && this.form.get('clienteNome')?.value?.trim()) {
      return {
        nome: this.form.get('clienteNome')?.value.trim(),
        email: this.form.get('clienteEmail')?.value?.trim() || '',
        telefone: this.form.get('clienteTelefone')?.value?.trim() || '',
        isRascunho: false
      };
    }
    return {
      nome: 'Cliente em Negociação',
      email: '',
      telefone: '',
      isRascunho: true
    };
  }

  // --- PDF & WHATSAPP ACTIONS ---
  abrirPdfSimulacaoAtual(): void {
    if (!this.simulacao) return;

    if (!this.configPropostaService.isConfigurado()) {
      this.notificationService.warning('Antes de gerar propostas e PDFs comerciais, configure os dados oficiais do seu escritório em Configurações > Modelo de Proposta.');
      this.router.navigate(['/configuracoes/modelo-proposta']);
      return;
    }

    const clienteInfo = this.extrairDadosClienteVinculado();
    if (clienteInfo.isRascunho) {
      this.notificationService.info('Dica: Gerando proposta como Modelo/Rascunho. Para personalizar com os dados do cliente, selecione um Lead ou Cliente nos parâmetros ao lado.');
    }

    const tipoNome = this.tiposProjeto.find(t => t.valor === this.form.value.tipoProjeto)?.nome || 'Projeto Arquitetônico';
    const padraoNome = this.padroesImovel.find(p => p.valor === this.form.value.padraoImovel)?.nome || 'Padrão Médio';
    const valorTotal = this.simulacao.valorTotalSugerido;

    const etapas = this.etapasDisponiveis
      .filter(e => e.checked)
      .map(e => ({
        nome: e.nome,
        descricao: e.descricao,
        percentual: e.percentual,
        valor: (valorTotal * e.percentual) / 100,
        prazo: 'A definir'
      }));

    const tituloProposta = clienteInfo.isRascunho
      ? `Projeto ${tipoNome} (${this.simulacao.metragemQuadrada} m²)`
      : `Projeto ${tipoNome} - ${clienteInfo.nome} (${this.simulacao.metragemQuadrada} m²)`;

    this.propostaParaPdf = {
      codigo: 'SIMULAÇÃO-' + Math.floor(1000 + Math.random() * 9000),
      titulo: tituloProposta,
      clienteNome: clienteInfo.nome,
      clienteEmail: clienteInfo.email || undefined,
      clienteTelefone: clienteInfo.telefone || undefined,
      metragemQuadrada: this.simulacao.metragemQuadrada,
      tipoProjetoNome: tipoNome,
      padraoImovelNome: padraoNome,
      valorTotalSugerido: this.simulacao.valorTotalSugerido,
      valorFinalAjustado: this.simulacao.valorTotalSugerido,
      criadoEm: new Date().toISOString(),
      etapas,
      memoriaCalculo: {
        horasEstimadasTotal: this.simulacao.horasEstimadasTotal,
        valorHoraBase: this.simulacao.memoriaCalculo?.valorHoraEstimado,
        valorM2Base: this.simulacao.memoriaCalculo?.valorMetroQuadradoBase,
        valorBase: this.simulacao.memoriaCalculo?.valorBase
      }
    };

    this.modalPdfAberto = true;
  }

  compartilharWhatsappSimulacaoAtual(): void {
    if (!this.simulacao) return;

    if (!this.configPropostaService.isConfigurado()) {
      this.notificationService.warning('Antes de compartilhar propostas comerciais, configure os dados oficiais do seu escritório em Configurações > Modelo de Proposta.');
      this.router.navigate(['/configuracoes/modelo-proposta']);
      return;
    }

    const clienteInfo = this.extrairDadosClienteVinculado();
    const tipoNome = this.tiposProjeto.find(t => t.valor === this.form.value.tipoProjeto)?.nome || 'Projeto Arquitetônico';
    
    if (clienteInfo.isRascunho || !clienteInfo.telefone) {
      this.notificationService.warning('Para enviar a proposta via WhatsApp, selecione um Lead ou Cliente com telefone cadastrado nos parâmetros da simulação.');
      return;
    }

    const msg = this.configPropostaService.gerarMensagemWhatsapp({
      clienteNome: clienteInfo.nome,
      projetoTitulo: `Projeto ${tipoNome}`,
      metragem: this.simulacao.metragemQuadrada,
      valorFinal: this.simulacao.valorTotalSugerido
    });

    const link = this.configPropostaService.gerarLinkWhatsapp(clienteInfo.telefone, msg);
    window.open(link, '_blank');
    this.notificationService.success('Link do WhatsApp gerado com sucesso!');
  }

  abrirPdfPropostaSalva(proposta: PropostaHonorario): void {
    if (!this.configPropostaService.isConfigurado()) {
      this.notificationService.warning('Antes de visualizar e exportar propostas em PDF, configure os dados oficiais do seu escritório em Configurações > Modelo de Proposta.');
      this.router.navigate(['/configuracoes/modelo-proposta']);
      return;
    }

    const etapas = (proposta.itensEtapa || []).map((i: any) => ({
      nome: i.nomeEtapa,
      descricao: i.descricao,
      percentual: i.percentual,
      valor: i.valor,
      incluso: i.incluso
    }));

    const clienteRel = this.clientes.find(c => c.id === proposta.clienteId);
    const leadRel = this.leads.find(l => l.id === proposta.leadId);

    this.propostaParaPdf = {
      id: proposta.id,
      codigo: proposta.codigo,
      titulo: proposta.titulo,
      clienteNome: proposta.clienteNome || (clienteRel ? clienteRel.nome : (leadRel ? leadRel.nome : undefined)),
      clienteEmail: clienteRel?.email || leadRel?.email,
      clienteTelefone: clienteRel?.telefone || leadRel?.telefone,
      leadNome: proposta.leadNome,
      metragemQuadrada: proposta.metragemQuadrada,
      padraoImovelNome: proposta.padraoImovelNome,
      tipoProjetoNome: proposta.tipoProjetoNome,
      valorTotalSugerido: proposta.valorTotalSugerido,
      valorFinalAjustado: proposta.valorFinalAjustado,
      criadoEm: proposta.criadoEm,
      statusNome: proposta.statusNome,
      etapas: etapas.length > 0 ? etapas : [
        { nome: 'Escopo Geral do Projeto Contratado', percentual: 100, valor: proposta.valorFinalAjustado }
      ],
      memoriaCalculo: {
        horasEstimadasTotal: proposta.horasEstimadasTotal,
        valorHoraBase: proposta.valorHoraBase,
        valorM2Base: proposta.valorMetroQuadradoBase,
        valorBase: proposta.valorBase
      }
    };

    this.modalPdfAberto = true;
  }

  compartilharWhatsappPropostaSalva(proposta: PropostaHonorario): void {
    if (!this.configPropostaService.isConfigurado()) {
      this.notificationService.warning('Antes de compartilhar propostas comerciais, configure os dados oficiais do seu escritório em Configurações > Modelo de Proposta.');
      this.router.navigate(['/configuracoes/modelo-proposta']);
      return;
    }

    const clienteRel = this.clientes.find(c => c.id === proposta.clienteId);
    const leadRel = this.leads.find(l => l.id === proposta.leadId);
    const tel = clienteRel?.telefone || leadRel?.telefone || '';

    if (!tel) {
      this.notificationService.warning('Esta proposta não possui um telefone de contato cadastrado para envio automático via WhatsApp.');
      return;
    }

    const msg = this.configPropostaService.gerarMensagemWhatsapp({
      clienteNome: proposta.clienteNome || clienteRel?.nome || leadRel?.nome,
      projetoTitulo: proposta.titulo,
      metragem: proposta.metragemQuadrada,
      valorFinal: proposta.valorFinalAjustado
    });

    const link = this.configPropostaService.gerarLinkWhatsapp(tel, msg);
    window.open(link, '_blank');
    this.notificationService.success('Link do WhatsApp gerado com sucesso!');
  }

  fecharModalPdf(): void {
    this.modalPdfAberto = false;
    this.propostaParaPdf = null;
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
