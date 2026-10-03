import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
import { ConfiguracaoProposta, CONFIGURACAO_PROPOSTA_PADRAO } from '../../../core/models/configuracao-proposta.model';
import { NotificationService } from '../../../core/services/notification.service';

import { PropostaVisualizacaoData } from '../../../models/proposta-pdf.types';
export { PropostaVisualizacaoData } from '../../../models/proposta-pdf.types';

@Component({
  selector: 'app-modal-proposta-pdf',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal-proposta-pdf.component.html',
  styleUrls: ['./modal-proposta-pdf.component.scss']
})
export class ModalPropostaPdfComponent implements OnInit, OnChanges {
  @Input() show = true;
  @Input() proposta: PropostaVisualizacaoData | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() fechado = new EventEmitter<void>();

  private router = inject(Router);
  private configService = inject(ConfiguracaoPropostaService);
  private notificationService = inject(NotificationService);

  public config: ConfiguracaoProposta = CONFIGURACAO_PROPOSTA_PADRAO;

  ngOnInit(): void {
    this.carregarConfiguracao();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.carregarConfiguracao();
    }
  }

  public carregarConfiguracao(): void {
    this.config = this.configService.getConfiguracao();
  }

  public get isConfigurado(): boolean {
    return this.configService.isConfigurado();
  }

  public fechar(): void {
    this.show = false;
    this.close.emit();
    this.fechado.emit();
  }

  public irParaConfiguracoes(): void {
    this.fechar();
    this.router.navigate(['/configuracoes/modelo-proposta']);
  }

  public imprimir(): void {
    if (!this.isConfigurado) {
      this.notificationService.warning('Para imprimir ou salvar a proposta oficial, preencha os dados do seu escritório em Configurações.');
      this.irParaConfiguracoes();
      return;
    }
    window.print();
  }

  public compartilharWhatsapp(): void {
    if (!this.proposta) return;
    if (!this.isConfigurado) {
      this.notificationService.warning('Cadastre a identidade do seu escritório em Configurações para personalizar o envio via WhatsApp.');
      this.irParaConfiguracoes();
      return;
    }

    const tel = this.proposta.clienteTelefone || '';
    const msg = this.configService.gerarMensagemWhatsapp({
      clienteNome: this.proposta.clienteNome || this.proposta.leadNome,
      projetoTitulo: this.proposta.titulo,
      metragem: this.proposta.metragemQuadrada,
      valorFinal: this.proposta.valorFinalAjustado
    }, this.config);

    const link = this.configService.gerarLinkWhatsapp(tel, msg);
    window.open(link, '_blank');
    this.notificationService.success('Link do WhatsApp gerado com sucesso!');
  }

  public enviarEmail(): void {
    if (!this.proposta) return;
    if (!this.isConfigurado) {
      this.notificationService.warning('Cadastre os contatos do seu escritório em Configurações antes de enviar por e-mail.');
      this.irParaConfiguracoes();
      return;
    }

    const email = this.proposta.clienteEmail || '';
    const assunto = encodeURIComponent(`Proposta Comercial - ${this.proposta.titulo} | ${this.config.nomeEscritorio}`);
    const corpo = encodeURIComponent(
      `Olá ${this.proposta.clienteNome || this.proposta.leadNome || 'Cliente'},\n\n` +
      `Conforme conversamos, segue o detalhamento da proposta para o projeto "${this.proposta.titulo}" (${this.proposta.metragemQuadrada} m²).\n\n` +
      `Valor total do investimento: ${this.formatarMoeda(this.proposta.valorFinalAjustado)}\n` +
      `Condições de pagamento: ${this.config.condicoesPagamentoPadrao}\n` +
      `Validade da proposta: ${this.config.validadeDias} dias\n\n` +
      `Atenciosamente,\n${this.config.nomeEscritorio}\n${this.config.telefone}`
    );

    window.open(`mailto:${email}?subject=${assunto}&body=${corpo}`, '_self');
  }

  public formatarMoeda(valor?: number): string {
    return this.configService.formatarMoeda(valor || 0);
  }
}
