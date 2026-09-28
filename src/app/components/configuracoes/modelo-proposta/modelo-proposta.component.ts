import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
import { ConfiguracaoProposta, CONFIGURACAO_PROPOSTA_PADRAO } from '../../../core/models/configuracao-proposta.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NotificationService } from '../../../core/services/notification.service';
import { ModalPropostaPdfComponent, PropostaVisualizacaoData } from '../../honorarios/modal-proposta-pdf/modal-proposta-pdf.component';

@Component({
  selector: 'app-modelo-proposta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, ModalPropostaPdfComponent],
  templateUrl: './modelo-proposta.component.html',
  styleUrls: ['./modelo-proposta.component.scss']
})
export class ModeloPropostaComponent implements OnInit {
  public form!: FormGroup;
  public abaAtiva: 'identidade' | 'secoes' | 'textos' | 'whatsapp' = 'identidade';
  public modalPdfAberto = false;

  public previewData: PropostaVisualizacaoData = {
    codigo: 'PROP-2026-084',
    titulo: 'Projeto Residencial Villa Bella',
    clienteNome: 'Dr. Roberto & Mariana Silveira',
    clienteEmail: 'roberto.silveira@email.com',
    clienteTelefone: '47999466073',
    metragemQuadrada: 285.50,
    padraoImovelNome: 'Alto Padrão',
    tipoProjetoNome: 'Residencial Completo',
    valorTotalSugerido: 48500.00,
    valorFinalAjustado: 45000.00,
    criadoEm: new Date().toISOString(),
    statusNome: 'Aprovada',
    etapas: [
      { nome: 'Levantamento & Briefing', descricao: 'Levantamento topográfico, diagnóstico de necessidades e partido arquitetônico.', percentual: 10, valor: 4500.00, prazo: '10 dias úteis' },
      { nome: 'Estudo Preliminar & 3D', descricao: 'Plantas baixas conceituais, layout humanizado e maquete eletrônica 3D realista.', percentual: 30, valor: 13500.00, prazo: '20 dias úteis' },
      { nome: 'Anteprojeto & Aprovação Legal', descricao: 'Pranchas normativas para submissão à prefeitura e condomínio.', percentual: 25, valor: 11250.00, prazo: '15 dias úteis' },
      { nome: 'Projeto Executivo de Arquitetura', descricao: 'Caderno técnico completo de paginação, iluminação, forros e acabamentos.', percentual: 25, valor: 11250.00, prazo: '25 dias úteis' },
      { nome: 'Detalhamento de Interiores & Marcenaria', descricao: 'Detalhamento milimétrico de marcenaria sob medida e especificações.', percentual: 10, valor: 4500.00, prazo: '15 dias úteis' }
    ],
    memoriaCalculo: {
      horasEstimadasTotal: 180,
      valorHoraBase: 250,
      valorM2Base: 157.62,
      valorBase: 45000.00
    }
  };

  constructor(
    private fb: FormBuilder,
    private configService: ConfiguracaoPropostaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm(this.configService.getConfiguracao());
    this.configService.carregarDoServidor().subscribe({
      next: (config) => {
        if (config) {
          this.form.patchValue(config);
        }
      }
    });
  }

  private initForm(config: ConfiguracaoProposta): void {
    this.form = this.fb.group({
      nomeEscritorio: [config.nomeEscritorio, [Validators.required]],
      slogan: [config.slogan],
      registroProfissional: [config.registroProfissional],
      email: [config.email, [Validators.required, Validators.email]],
      telefone: [config.telefone, [Validators.required]],
      endereco: [config.endereco],
      logoUrl: [config.logoUrl || ''],
      corPrimaria: [config.corPrimaria || '#b5603c', [Validators.required]],

      exibirCabecalho: [config.exibirCabecalho],
      exibirResumo: [config.exibirResumo],
      exibirTabelaEtapas: [config.exibirTabelaEtapas],
      exibirMemoriaCalculo: [config.exibirMemoriaCalculo],
      exibirCondicoesPagamento: [config.exibirCondicoesPagamento],
      exibirTermosGerais: [config.exibirTermosGerais],
      exibirAssinaturas: [config.exibirAssinaturas],

      textoApresentacao: [config.textoApresentacao, [Validators.required]],
      validadeDias: [config.validadeDias, [Validators.required, Validators.min(1)]],
      condicoesPagamentoPadrao: [config.condicoesPagamentoPadrao, [Validators.required]],
      chavePix: [config.chavePix],
      dadosBancarios: [config.dadosBancarios],
      termosGerais: [config.termosGerais, [Validators.required]],
      templateMensagemWhatsapp: [config.templateMensagemWhatsapp, [Validators.required]]
    });
  }

  public setAba(aba: 'identidade' | 'secoes' | 'textos' | 'whatsapp'): void {
    this.abaAtiva = aba;
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.notificationService.warning('Por favor, selecione um arquivo de imagem válido (PNG, SVG ou JPG).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.notificationService.warning('A imagem do logotipo deve ter no máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.form.patchValue({ logoUrl: base64 });
        this.notificationService.success('Logotipo carregado com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  }

  public removerLogotipo(): void {
    this.form.patchValue({ logoUrl: '' });
    this.notificationService.info('Logotipo removido.');
  }

  public salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const valores: ConfiguracaoProposta = this.form.value;
    this.configService.salvarConfiguracao(valores).subscribe({
      next: () => {
        this.notificationService.success('Configurações do modelo de proposta salvas com sucesso!');
      },
      error: () => {
        this.notificationService.error('Erro ao salvar configurações.');
      }
    });
  }

  public restaurarPadrao(): void {
    if (confirm('Deseja restaurar todas as configurações e textos para o padrão original do ArchiFlow?')) {
      const padrao = this.configService.resetarPadroes();
      this.form.patchValue(padrao);
      this.notificationService.info('Configurações restauradas com sucesso.');
    }
  }

  public testarImpressao(): void {
    this.modalPdfAberto = true;
  }

  public fecharModalPdf(): void {
    this.modalPdfAberto = false;
  }

  public get configAtual(): ConfiguracaoProposta {
    return this.form ? this.form.value : CONFIGURACAO_PROPOSTA_PADRAO;
  }

  public formatarMoeda(valor?: number): string {
    return this.configService.formatarMoeda(valor || 0);
  }

  public get previewWhatsappMsg(): string {
    return this.configService.gerarMensagemWhatsapp({
      clienteNome: this.previewData.clienteNome,
      projetoTitulo: this.previewData.titulo,
      metragem: this.previewData.metragemQuadrada,
      valorFinal: this.previewData.valorFinalAjustado
    }, this.configAtual);
  }
}
