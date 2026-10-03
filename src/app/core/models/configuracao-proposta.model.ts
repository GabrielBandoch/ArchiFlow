export interface ConfiguracaoProposta {
  nomeEscritorio: string;
  slogan: string;
  registroProfissional: string;
  email: string;
  telefone: string;
  endereco: string;
  logoUrl?: string;
  corPrimaria: string;

  exibirCabecalho: boolean;
  exibirResumo: boolean;
  exibirTabelaEtapas: boolean;
  exibirMemoriaCalculo: boolean;
  exibirCondicoesPagamento: boolean;
  exibirTermosGerais: boolean;
  exibirAssinaturas: boolean;

  textoApresentacao: string;
  validadeDias: number;
  condicoesPagamentoPadrao: string;
  chavePix: string;
  dadosBancarios: string;
  termosGerais: string;
  templateMensagemWhatsapp: string;

  configurado: boolean;
}

export const CONFIGURACAO_PROPOSTA_PADRAO: ConfiguracaoProposta = {
  nomeEscritorio: '',
  slogan: '',
  registroProfissional: '',
  email: '',
  telefone: '',
  endereco: '',
  logoUrl: '',
  corPrimaria: '#765538',

  exibirCabecalho: true,
  exibirResumo: true,
  exibirTabelaEtapas: true,
  exibirMemoriaCalculo: false,
  exibirCondicoesPagamento: true,
  exibirTermosGerais: true,
  exibirAssinaturas: true,

  textoApresentacao: 'Apresentamos nossa proposta técnica e comercial para o desenvolvimento do seu projeto arquitetônico, estruturada com rigor metodológico, atendimento personalizado e foco em excelência e viabilidade construtiva.',
  validadeDias: 15,
  condicoesPagamentoPadrao: 'Entrada de 30% no aceite da proposta + saldo parcelado em parcelas mensais conforme o desenvolvimento das etapas contratadas.',
  chavePix: '',
  dadosBancarios: '',
  termosGerais: `1. O escopo compreende estritamente as etapas e serviços descritos nesta proposta.\n2. Estão inclusas até 2 (duas) rodadas de revisões conceituais na fase de Estudo Preliminar.\n3. Projetos complementares e taxas de aprovação em órgãos públicos são de responsabilidade do contratante ou contratados à parte.\n4. Os prazos de execução passam a contar a partir da assinatura do contrato e fornecimento dos dados do imóvel.`,
  templateMensagemWhatsapp: `Olá {cliente}! Segue a proposta comercial para o projeto *{projeto}* ({metragem} m²) elaborada por {escritorio}.\n\n💰 *Valor Total:* {valor}\n📅 *Validade:* {validade} dias\n\nFicamos à disposição para esclarecer qualquer dúvida ou agendar uma reunião!`,
  configurado: false
};
