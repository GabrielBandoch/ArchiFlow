import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
import { ConfiguracaoProposta, CONFIGURACAO_PROPOSTA_PADRAO } from '../../../core/models/configuracao-proposta.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ModalPropostaPdfComponent } from '../../honorarios/modal-proposta-pdf/modal-proposta-pdf.component';
import { PropostaVisualizacaoData } from '../../../models/proposta-pdf.types';
import { ModeloPropostaForm } from './modelo-proposta.form';

@Component({
  selector: 'app-modelo-proposta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './modelo-proposta.component.html',
  styleUrls: ['./modelo-proposta.component.scss']
})
export class ModeloPropostaComponent implements OnInit {
  public form!: FormGroup;
  public abaAtiva: 'identidade' | 'secoes' | 'textos' | 'whatsapp' = 'identidade';

  public previewData: PropostaVisualizacaoData = {
    codigo: 'PROP-2026-084',
    titulo: 'Projeto Residencial Villa Bella',
    clienteNome: 'Dr. Roberto & Mariana Silveira',
    clienteEmail: 'cliente@exemplo.com',
    clienteTelefone: '11987654321',
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
    private notificationService: NotificationService,
    private dialogService: DialogService
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
    this.form = ModeloPropostaForm.create(this.fb, config);
  }

  public setAba(aba: 'identidade' | 'secoes' | 'textos' | 'whatsapp'): void {
    this.abaAtiva = aba;
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.notificationService.warning('Formato inválido. Por favor, envie uma imagem PNG, SVG ou JPG.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.notificationService.warning('Arquivo muito grande. O limite máximo do logotipo é 2 MB.');
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

  public removerLogo(): void {
    this.form.patchValue({ logoUrl: '' });
    this.notificationService.info('Logotipo removido.');
  }

  public removerLogotipo(): void {
    this.removerLogo();
  }

  public selecionarCor(corHex: string): void {
    this.form.patchValue({ corPrimaria: corHex });
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
    this.dialogService.confirm({
      title: 'Restaurar Padrões',
      message: 'Deseja restaurar todas as configurações e textos para o padrão original do ArchiFlow?'
    }).subscribe((confirmado) => {
      if (confirmado) {
        const padrao = this.configService.resetarPadroes();
        this.form.patchValue(padrao);
        this.notificationService.info('Configurações restauradas com sucesso.');
      }
    });
  }

  public testarImpressao(): void {
    this.dialogService.open(ModalPropostaPdfComponent, {
      data: {
        proposta: this.previewData
      }
    });
  }

  public get configAtual(): ConfiguracaoProposta {
    return this.form ? this.form.value : CONFIGURACAO_PROPOSTA_PADRAO;
  }

  public formatarMoeda(valor?: number): string {
    return this.configService.formatarMoeda(valor || 0);
  }

  public inserirTagWhatsapp(tag: string): void {
    const atual = this.form.get('templateMensagemWhatsapp')?.value || '';
    this.form.patchValue({ templateMensagemWhatsapp: atual + tag });
  }

  public get previewWhatsappMsg(): string {
    return this.configService.gerarMensagemWhatsapp({
      clienteNome: this.previewData.clienteNome,
      projetoTitulo: this.previewData.titulo,
      metragem: this.previewData.metragemQuadrada,
      valorFinal: this.previewData.valorFinalAjustado
    }, this.form.value);
  }

  public readonly paletasPredefinidas = [
    { nome: 'Terracota Studio (Padrão)', hex: '#765538', cor: '#765538' },
    { nome: 'Carvão Arquitetônico', hex: '#2B2B2B', cor: '#2B2B2B' },
    { nome: 'Nogueira Escura', hex: '#4A3525', cor: '#4A3525' },
    { nome: 'Verde Botânico', hex: '#2D4A3E', cor: '#2D4A3E' },
    { nome: 'Azul Concreto', hex: '#2C3E50', cor: '#2C3E50' },
    { nome: 'Bronze Metálico', hex: '#8C6D46', cor: '#8C6D46' }
  ];
}
