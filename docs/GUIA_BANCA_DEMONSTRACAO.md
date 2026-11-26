# Guia de Demonstração para a Banca Avaliadora

Este guia reúne os dados de acesso e um roteiro prático para explorar todas as funcionalidades entregues na plataforma **COTU (ArchiFlow)** em ambiente de produção.

---

## 1. Acesso ao Ambiente Exclusivo da Banca (`TCC`)

Para a apresentação e avaliação pelos professores, foi configurado o subdomínio isolado **`tcc.cotu.com.br`**, utilizando a mesma arquitetura Multi-Tenant de produção (banco PostgreSQL próprio `cotu_tcc`, separado dos dados reais da Duna Arquitetura em `duna.cotu.com.br`):

- **URL de Acesso:** `https://tcc.cotu.com.br/`
- **Escritório configurado (White-Label):** `COTU Studio — Demonstração TCC` (Joinville/SC)

### Credenciais de Avaliação Disponíveis

| Perfil / Papel | E-mail (Login) | Senha | Escopo / Permissões |
| :--- | :--- | :--- | :--- |
| **Arquiteto Sócio / Admin (Banca)** | `professores@cotu.com.br` | `catolicasc123456` | Acesso completo aos **7 módulos operacionais** |
| **Portal do Cliente (`Família Nogueira`)** | `nogueira.cliente@cotustudio.exemplo.br` | `Cliente@2026` | `/portal` (etapas, arquivos visíveis e chat de *Residência Vale Verde*) |
| **Gerente de Projetos** *(Camila Ferreira)* | `camila.ferreira@cotustudio.exemplo.br` | `Equipe@2026` | Dashboard, Projetos, Clientes, Leads, Fornecedores e Financeiro |
| **Arquiteto Colaborador** *(Rafael Duarte)* | `rafael.duarte@cotustudio.exemplo.br` | `Equipe@2026` | Dashboard, Projetos, Clientes e Fornecedores |
| **Administrativo / Financeiro** *(Beatriz Mendes)* | `beatriz.mendes@cotustudio.exemplo.br` | `Equipe@2026` | Dashboard, Financeiro e Clientes |
| **Estagiário** *(Lucas Andrade)* | `lucas.andrade@cotustudio.exemplo.br` | `Equipe@2026` | Projetos e Fornecedores |

> **Nota técnica:** O formulário de login valida formato de e-mail (`Validators.email`). Por isso, todas as contas de avaliação utilizam endereços de e-mail completos.

### Dados de Demonstração Já Populados em `tcc.cotu.com.br`

| Módulo | Registros Prontos | Exemplos para Inspeção |
| :--- | :---: | :--- |
| **Clientes** | **4** | `Família Nogueira`, `Helena & Marcos Silveira`, `Clínica OdontoPrime`, `Café Botânico Joinville` |
| **Projetos (735 m²)** | **4** | `Residência Vale Verde — Família Nogueira` (285 m², *Desenvolvimento*), `Apartamento Jardins — Interiores` (145 m², *Aprovação*), `Clínica OdontoPrime — Sede América` (210 m², *Execução*), `Café Botânico — Consultoria de Fachada` (95 m², *Briefing*) |
| **Fornecedores** | **5** | `Marcenaria Joinville Sob Medida` (5.0), `Lumina Arquitetura em Iluminação` (5.0), `Pedras do Vale Marmoraria` (4.0), `VetroSul Esquadrias & Vidros`, `VerdeVivo Paisagismo Contemporâneo` |
| **CRM / Leads** | **9** | 1 *Novo*, 1 *Em Contato*, 1 *Proposta Enviada*, 1 *Negociando*, 4 *Convertidos*, 1 *Perdido* (com motivo) + 7 históricos |
| **Financeiro** | **3 contratos · 5 despesas** | 11 parcelas (`R$ 82.000,00` previstos / `R$ 29.000,00` recebidos) e 5 despesas (`R$ 6.345,00`) |
| **Portal & Arquivos** | **1 rep. · 2 arquivos** | `Mariana Nogueira` ativada, `planta-baixa-residencia-vale-verde.pdf`, `referencia-fachada-vale-verde.png` e chat SignalR ativo |

### Outras URLs do Ecossistema COTU (Referência)
- **Landing Page Institucional:** `https://cotu.com.br/`
- **Health Check da API Principal:** `https://api.cotu.com.br/health`

---

## 2. Roteiro Sugerido de Avaliação (Módulo a Módulo)

### Passo 1 — Dashboard Personalizável (`/dashboard`)
- Observe os cards iniciais (*Financeiro da semana*, *Projetos por fase* e *CRM & Oportunidades*), já populados com contas a pagar e recebíveis da semana, distribuição dos 4 projetos e funil de leads.
- Teste o botão de personalização para reordenar ou ativar/ocultar widgets e salvar a preferência do usuário no banco (`Preferencias_Dashboard`).

### Passo 2 — Funil Comercial de Leads (`/leads` e `/configuracoes/origens-lead`)
- Crie um novo lead informando nome, e-mail, telefone (com máscara validada) e origem (ex.: `Instagram`, `Indicação`).
- Arraste o card no **Quadro Kanban** entre as colunas (*Novo* → *Em Contato* → *Proposta Enviada* → *Negociando*).
- Teste o registro de histórico de contatos dentro do lead e observe o fluxo alternativo ao mover para *Perdido* (solicitação obrigatória de motivo).

### Passo 3 — CRM de Clientes, Portal & Multi-Representantes (`/clientes` e `/projetos/:id`)
- Converta um lead para cliente com 1 clique ou abra um dos 4 clientes existentes (`Família Nogueira`, `Helena & Marcos Silveira`, `Clínica OdontoPrime` ou `Café Botânico Joinville`).
- Na ficha do cliente, teste o botão **Suspender Portal / Liberar Portal** (que revoga/restaura imediatamente o acesso do cliente) e **Editar Ficha**.
- Dentro do detalhe do projeto (`Residência Vale Verde — Família Nogueira`), explore a aba **Portal do Cliente** para gerenciar os **Representantes** (ex.: `Mariana Nogueira` já ativa, ou cadastre um novo contato para disparar convite assinado por token em `/ativar-conta`).

### Passo 4 — Projetos, Templates, Etapas, Arquivos & Chat (`/projetos`)
- Em `/configuracoes/templates-projeto`, veja os 4 templates pré-semeados (*Residencial*, *Interiores*, *Comercial*, *Consultoria*) e crie ou edite um modelo.
- Crie um novo projeto vinculado ao cliente escolhendo um template: todas as etapas e tarefas padrão serão instanciadas automaticamente.
- Dentro do detalhe do projeto (`Residência Vale Verde — Família Nogueira`):
  - Avance status de etapas e defina datas previstas de entrega;
  - Conclua tarefas e defina prazos individuais;
  - Confira na aba **Arquivos & Pranchas** a planta PDF e a imagem já enviadas ou faça upload de um novo arquivo alternando a flag **"Disponibilizar no Portal do Cliente"**;
  - Envie uma mensagem no **Chat em Tempo Real** flutuante (SignalR `/hubs/chat`).

### Passo 5 — Portal do Cliente (`/portal`)
- Em uma aba anônima em `https://tcc.cotu.com.br/`, faça login diretamente com o acesso de cliente pronto (`nogueira.cliente@cotustudio.exemplo.br` / `Cliente@2026`):
  - Verifique a identidade visual white-label do escritório (`COTU Studio — Demonstração TCC`);
  - Confira a etapa atual (*Anteprojeto e Modelagem 3D*), o cronograma de entregas, os arquivos marcados como visíveis e a comunicação bidirecional no Chat do projeto (sem acesso a áreas administrativas ou dados financeiros internos).

### Passo 6 — Módulo Financeiro (`/financeiro`)
- Confira os **3 contratos lançados** (`R$ 82.000,00` previstos no total, sendo `R$ 29.000,00` já recebidos via PIX e Transferência Bancária entre `Residência Vale Verde`, `Apartamento Jardins` e `Clínica OdontoPrime`) ou gere um novo Contrato Parcelado.
- Registre a baixa de uma parcela pendente informando data, forma de pagamento e comprovante opcional.
- Na aba **Saídas & Despesas de Projetos**, confira as **5 despesas** lançadas (3 pagas e 2 pendentes na semana) ou registre uma nova despesa avulsa/vinculada a projeto.

### Passo 7 — Diretório de Fornecedores (`/fornecedores`)
- Confira os **5 fornecedores cadastrados** (`Marcenaria Joinville Sob Medida`, `Lumina Arquitetura em Iluminação`, `Pedras do Vale Marmoraria`, `VetroSul Esquadrias & Vidros` e `VerdeVivo Paisagismo Contemporâneo`) ou cadastre um novo parceiro.
- Registre uma avaliação de 1 a 5 estrelas (a média é recalculada automaticamente no domínio), vincule-o a um projeto e teste o atalho de contato direto via **WhatsApp Web**.

### Passo 8 — Configurações, White-Label e Equipe RBAC (`/configuracoes`)
- **`/configuracoes/empresa`:** altere o nome do escritório, CAU/CNPJ, cor primária ou logotipo e veja o reflexo imediato no Portal do Cliente.
- **`/configuracoes/equipe`:** visualize os membros já cadastrados (`Camila Ferreira`, `Rafael Duarte`, `Beatriz Mendes` e `Lucas Andrade`) ou convide um novo colaborador testando o login com um dos perfis acima (senha `Equipe@2026`) para validar a restrição dinâmica de menu e rotas (`ModulosPermitidos`).
