# Guia de Demonstração para a Banca Avaliadora

Este guia reúne os dados de acesso e um roteiro prático para explorar todas as funcionalidades entregues na plataforma **COTU (ArchiFlow)** em ambiente de produção.

---

## 1. Acesso ao Ambiente Exclusivo da Banca (`TCC`)

Para a apresentação e avaliação pelos professores, foi configurado o subdomínio isolado **`tcc.cotu.com.br`**, utilizando a mesma arquitetura Multi-Tenant de produção (banco PostgreSQL próprio `cotu_tcc`, separado dos dados reais da Duna Arquitetura em `duna.cotu.com.br`):

| Campo | Valor |
| :--- | :--- |
| **URL de Acesso** | `https://tcc.cotu.com.br/` |
| **E-mail (Login)** | `professores@cotu.com.br` |
| **Senha** | `catolicasc123456` |
| **Perfil / Permissão** | `Administrador` *(acesso completo aos 7 módulos operacionais)* |

> **Nota técnica:** O formulário de login valida formato de e-mail (`Validators.email`). Por isso, o usuário de avaliação utiliza o e-mail completo `professores@cotu.com.br`.

### Outras URLs do Ecossistema COTU (Referência)
- **Landing Page Institucional:** `https://cotu.com.br/`
- **Health Check da API Principal:** `https://api.cotu.com.br/health`

---

## 2. Roteiro Sugerido de Avaliação (Módulo a Módulo)

### Passo 1 — Dashboard Personalizável (`/dashboard`)
- Observe os cards iniciais (*O que fazer hoje*, *Financeiro da semana*, *Projetos por fase* e *CRM / Leads*).
- Teste o botão de personalização para ativar/ocultar widgets e salvar a preferência do usuário no banco (`Preferencias_Dashboard`).

### Passo 2 — Funil Comercial de Leads (`/leads` e `/configuracoes/origens-lead`)
- Crie um novo lead informando nome, e-mail, telefone (com máscara validada) e origem (ex.: `Instagram`, `Indicação`).
- Arraste o card no **Quadro Kanban** entre as colunas (*Novo* → *Em Contato* → *Proposta Enviada* → *Negociando*).
- Teste o registro de histórico de contatos dentro do lead e observe o fluxo alternativo ao mover para *Perdido* (solicitação obrigatória de motivo).

### Passo 3 — CRM de Clientes & Multi-Representantes (`/clientes`)
- Converta um lead para cliente com 1 clique ou abra o cliente existente (`Família Nogueira — Residência Vale Verde`).
- Na ficha do cliente, explore a aba de **Representantes**: cadastre um representante (ex.: cônjuge ou sócio), o que dispara fluxo de convite assinado por token para ativação em `/ativar-conta`.

### Passo 4 — Projetos, Templates, Etapas, Arquivos & Chat (`/projetos`)
- Em `/configuracoes/templates-projeto`, veja os 4 templates pré-semeados (*Residencial*, *Interiores*, *Comercial*, *Consultoria*) e crie ou edite um modelo.
- Crie um novo projeto vinculado ao cliente escolhendo um template: todas as etapas e tarefas padrão serão instanciadas automaticamente.
- Dentro do detalhe do projeto (`Residência Vale Verde`):
  - Avance status de etapas e defina datas previstas de entrega;
  - Conclua tarefas e defina prazos individuais;
  - Faça upload de um arquivo e alterne a flag **"Visível ao cliente"**;
  - Envie uma mensagem na aba de **Chat em Tempo Real** (SignalR `/hubs/chat`).

### Passo 5 — Portal do Cliente (`/portal`)
- Ao criar/ativar um representante (ou usar o acesso de cliente), faça login no Portal do Cliente em uma aba anônima em `https://tcc.cotu.com.br/`:
  - Verifique a identidade visual white-label do escritório;
  - Confira a etapa atual, o cronograma de entregas, somente os arquivos marcados como visíveis e a comunicação direta no Chat do projeto (sem acesso a áreas administrativas ou dados financeiros internos).

### Passo 6 — Módulo Financeiro (`/financeiro`)
- Confira o contrato já lançado (`R$ 36.000,00` com 1ª parcela quitada via PIX) ou crie um novo Contrato Financeiro com geração automática de parcelas.
- Registre a baixa de uma parcela com forma de pagamento (PIX, Boleto, etc.).
- Crie uma **Despesa Operacional** (tanto vinculada a um projeto quanto avulsa do escritório) e observe o reflexo imediato nos gráficos mensais e alertas de vencimento.

### Passo 7 — Diretório de Fornecedores (`/fornecedores`)
- Confira o fornecedor cadastrado (`Marcenaria Joinville Sob Medida`) ou cadastre um novo parceiro com cidade, especialidade e telefone.
- Registre uma avaliação de 1 a 5 estrelas (a média é recalculada automaticamente no domínio), vincule-o a um projeto e teste o atalho de contato direto via **WhatsApp Web**.

### Passo 8 — Configurações, White-Label e Gestão de Equipe (`/configuracoes`)
- **`/configuracoes/empresa`:** altere o nome do escritório, CAU/CNPJ, cor primária ou logotipo.
- **`/configuracoes/equipe`:** convide um membro escolhendo papel (`Gerente`, `Colaborador`, `Estagiario`, `Financeiro`) e selecione quais módulos específicos ele poderá enxergar e acessar (`ModulosPermitidos`).
