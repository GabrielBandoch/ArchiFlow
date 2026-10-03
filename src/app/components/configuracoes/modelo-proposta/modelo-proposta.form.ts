import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracaoProposta } from '../../../core/models/configuracao-proposta.model';

export class ModeloPropostaForm {
  static create(fb: FormBuilder, config: ConfiguracaoProposta): FormGroup {
    return fb.group({
      nomeEscritorio: [config.nomeEscritorio, [Validators.required]],
      slogan: [config.slogan],
      registroProfissional: [config.registroProfissional],
      email: [config.email, [Validators.required, Validators.email]],
      telefone: [config.telefone, [Validators.required]],
      endereco: [config.endereco],
      logoUrl: [config.logoUrl || ''],
      corPrimaria: [config.corPrimaria || '#765538', [Validators.required]],

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
}
