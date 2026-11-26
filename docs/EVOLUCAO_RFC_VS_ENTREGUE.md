# Evolução do Projeto: RFC v1.0 vs. Sistema Entregue e ADRs

Este documento responde diretamente à pergunta: ***"O que mudou entre a proposta aprovada no RFC (Março/2026) e a plataforma entregue em produção (Novembro/2026), e por que essas decisões foram tomadas?"***

> O documento original permanece preservado em [`docs/rfc.md`](rfc.md) e [`docs/rfc_tcc.pdf`](rfc_tcc.pdf) para comparação direta.

---

## 1. Visão Executiva da Evolução

No RFC v1.0, o sistema (então chamado **ArchiFlow**) previa um MVP composto por **4 módulos** (Leads, CRM/Clientes, Projetos e Portal do Cliente) e **3 módulos pós-TCC** (Simulador de Honorários, Gestão Financeira e Gestão de Fornecedores), rodando com **9 tabelas** em um modelo single-tenant simples.

Durante o desenvolvimento em parceria contínua com a **Duna Arquitetura** (Joinville/SC), a validação prática mostrou que o escritório precisava do **ciclo completo operacional** — incluindo **Financeiro**, **Fornecedores**, **Agenda integrada ao Google Calendar**, **Chat em Tempo Real no Portal** e **Templates de Projeto** — para de fato substituir planilhas e WhatsApp no dia a dia. Além disso, para viabilizar o uso real em produção pela Duna Arquitetura e por futuros escritórios com total isolamento de dados (LGPD), o sistema foi reestruturado para **arquitetura SaaS Multi-Tenant com 1 banco PostgreSQL por cliente** sob a marca **COTU**.

---

## 2. Comparativo Macro: RFC v1.0 vs. Entrega Final

| Dimensão | Previsto no RFC v1.0 (Mar/2026) | Entregue em Produção (Nov/2026) | Classificação |
| :--- | :--- | :--- | :--- |
| **Identidade / Marca** | `ArchiFlow` | **COTU** *(mantendo namespaces técnicos `ArchiFlow.*`)* | Evolução de Branding |
| **Módulo 1 — Gestão de Leads** | Cadastro, status Kanban, histórico | Kanban completo + **Origens configuráveis (`Origens_Lead`)** + motivo de perda | **Entregue + Evoluído** |
| **Módulo 2 — CRM / Clientes** | Conversão 1-clique, cadastro, senha única | Conversão 1-clique + **Multi-Representantes por Cliente** com convite por token assinado (`/ativar-conta`) | **Entregue + Evoluído** |
| **Módulo 3 — Gestão de Projetos** | Projetos, etapas, tarefas e upload | Projetos + **Templates de Workflow (`Templates_Projeto`/`Templates_Etapa`)** + prazos individuais por etapa/tarefa + Storage AWS S3 / local | **Entregue + Evoluído** |
| **Módulo 4 — Portal do Cliente** | Leitura de etapas, cronograma e arquivos | Portal white-label com logotipo/cor do escritório, múltiplos projetos por cliente, entregáveis com datas e **Chat em tempo real** | **Entregue + Evoluído** |
| **Módulo 6 — Gestão Financeira** | Previsto para **Pós-TCC** | **Antecipado e Entregue:** Contratos, Parcelas, Baixas, Alertas, Comprovantes S3 e **Despesas (vinculadas ou avulsas do escritório)** | **Antecipado** |
| **Módulo 7 — Gestão de Fornecedores** | Previsto para **Pós-TCC** | **Antecipado e Entregue:** Diretório, vínculo N:N por projeto, avaliações 1–5 com recálculo de média e contato direto via WhatsApp | **Antecipado** |
| **Módulo 5 — Simulador de Honorários** | Previsto para **Pós-TCC** | Chegou a ser prototipado com Strategy/Builder GoF, mas foi **consolidado/removido na versão atual** (26/10/2026) para manter foco e simplicidade operacional | **Postergado (Pós-TCC)** |
| **Agenda & Google Calendar** | Listado como **Fora do Escopo** | **Implementado:** Calendário corporativo, tarefas integradas, exportação `.ics`, Google Meet e sincronização OAuth 2.0 / Service Account | **Adicionado** |
| **Chat Interno no Portal** | Listado como **Fora do Escopo** | **Implementado:** Chat em tempo real via **SignalR (`/hubs/chat`)** com persistência e proteção anti-IDOR por projeto | **Adicionado** |
| **Gestão de Equipe & RBAC** | Arquiteto único / sem gestão de equipe | **Implementado:** Múltiplos papéis (`Administrador`, `Gerente`, `Colaborador`, `Estagiario`, `Financeiro`) + **permissão granular por módulo (`ModulosPermitidos`)** | **Adicionado** |
| **White-Label & Perfil** | Não previsto | **Implementado:** `Dados_Empresa` (logo, cor primária, CAU/CNPJ), perfil próprio e recuperação de senha por token hash | **Adicionado** |
| **Dashboard Personalizável** | Layout fixo | **Implementado:** Widgets configuráveis persistidos por usuário (`Preferencias_Dashboard`) | **Adicionado** |
| **Modelo Multi-Tenant SaaS** | Banco único compartilhado | **Implementado:** **Database-per-Tenant (`cotu_<subdominio>`)** com auto-provisionamento, SSL On-Demand + Landing + Painel SuperAdmin | **Adicionado** |
| **Banco de Dados** | 9 tabelas no DER inicial | **25 tabelas por tenant** (`ArchiFlowDbContext`) + **2 tabelas no banco master** (`AdminDbContext`) | **Expandido (9 → 25+2)** |
| **Infraestrutura de Produção** | Deploy genérico / AWS CDK | **Docker Compose + Caddy 2 (VPS Hostinger)** em produção + **AWS S3/SES** ativos + **AWS CDK** preservado em `infra/` | **Evoluído** |

---

## 3. O que foi Adicionado, Antecipado ou Removido — Detalhamento

### 3.1 Módulos Previstos para Pós-TCC que foram Antecipados e Entregues
- **Gestão Financeira (Módulo 6):** além de `Contratos_Financeiros` e `Parcelas_Financeiras` (previstas como `Honorario` no RFC), foram implementadas `Despesas_Projetos` com suporte a **despesas operacionais avulsas (`ProjetoId` nullable)** após feedback real da Duna Arquitetura em 22/10/2026, upload de comprovantes no AWS S3 e painel de fluxo de caixa mensal/anual.
- **Gestão de Fornecedores (Módulo 7):** diretório completo de parceiros por especialidade, vínculo N:N (`Projetos_Fornecedores`) com função no projeto, sistema de notas 1–5 (`Avaliacoes_Fornecedores`) com recálculo automático da média na entidade de domínio e geração de link direto para WhatsApp com máscara validada.

### 3.2 Funcionalidades Novas (além do RFC original)
1. **Agenda Corporativa & Google Calendar:** compromissos com cliente, projeto ou lead (`Compromissos_Agenda`), fuso horário UTC normalizado, exportação universal `.ics`, criação de link Google Meet e integração via **OAuth 2.0** ou **Service Account** (`Configuracoes_Agenda_Escritorio`).
2. **Chat em Tempo Real por Projeto:** hub **SignalR** (`/hubs/chat`) com histórico persistido em `Mensagens_Chat`, contagem de mensagens não lidas e validação rigorosa de acesso ao projeto para impedir vazamento entre clientes (anti-IDOR).
3. **Templates de Workflow de Projeto:** 4 templates arquitetônicos pré-semeados no `DbSeeder` (*Residencial Completo*, *Design de Interiores & Reforma*, *Comercial & Corporativo*, *Consultoria & Viabilidade*), personalizáveis pelo escritório em `/configuracoes/templates-projeto`.
4. **Gestão de Equipe e RBAC Granular:** convite de colaboradores, redefinição de senha, ativação/desativação, papéis especializados e controle fino de módulos acessíveis (`ModulosApp`: `dashboard`, `leads`, `clientes`, `fornecedores`, `projetos`, `agenda`, `financeiro`, `configuracoes`), aplicado tanto nos guards do Angular (`moduleGuard`) quanto em atributos customizados da API (`[RequireModule]`).
5. **Portal do Cliente Multi-Representante:** em vez de uma única senha em texto/hash direto na tabela `Clientes`, criou-se `Representantes_Clientes`, permitindo que um mesmo cliente (ex.: casal, sócios de empresa ou construtora) tenha múltiplos usuários convidados por e-mail com token temporário com expiração de 72h (`ConviteTokenHash`), ativando a própria senha em `/ativar-conta` (mantendo fallback compatível com o fluxo legado de `Cliente.SenhaPortal`).
6. **Recuperação de Senha Segura:** endpoints `/api/recuperacao-senha` + tabela `Tokens_Recuperacao_Senha` (armazenando apenas o hash SHA-256 do token, com expiração e contador de tentativas) e telas `/recuperar-senha` e `/redefinir-senha`.
7. **White-Label do Escritório & Preferências:** `Dados_Empresa` permite customizar logotipo no S3, cor primária e dados institucionais; `Preferencias_Dashboard` persiste os cards escolhidos pelo usuário.
8. **Ecossistema SaaS Multi-Tenant:** arquitetura Database-per-Tenant + `ArchiFlow.Landing` + `ArchiFlow.Admin` + `ArchiFlow.Admin.API`.

### 3.3 Por que o Simulador de Honorários foi Consolidado / Postergado
Durante o desenvolvimento, o módulo de **Simulador de Honorários e Propostas PDF** chegou a ser implementado em branch específica utilizando padrões GoF (*Strategy*, *Factory*, *Builder*). Contudo, em **26/10/2026** (commits `5d1f57d` no backend e `ef07535` no frontend, `"refactor: consolidar modulos centrais e simplificar estrutura do projeto"`), tomou-se a decisão consciente de **remover esse módulo da entrega do TCC**, pelos seguintes motivos:
1. O próprio RFC já classificava o Módulo 5 como **Pós-TCC**.
2. Na validação de campo com a **Duna Arquitetura**, a sócia relatou que os escritórios utilizam modelos de proposta comercial muito próprios (inclusive mantendo o modelo atual em adaptação) e que a complexidade de precificação automática distraía da prioridade máxima do escritório: **gestão de projetos, financeiro real (entradas/saídas), agenda e portal do cliente**.
3. A remoção reduziu mais de 14.000 linhas entre frontend e backend, elevando a coesão do código, simplificando a UX e concentrando os testes e a qualidade no núcleo usado diariamente em produção.

---

## 4. Matriz de Rastreabilidade de Requisitos (RFC vs. Estado Atual)

### 4.1 Requisitos Funcionais do RFC (RF01 a RF32) + Novos Requisitos (RF33 a RF40)

| ID | Módulo | Descrição Resumida | Status Atual | Observação / Onde está |
| :--- | :--- | :--- | :--- | :--- |
| **RF01–RF05** | Leads | Cadastro, status Kanban, totalizadores, histórico e datas | **Entregue** | `LeadsController`, `OrigensLeadController` |
| **RF06–RF10** | CRM / Clientes | Conversão 1-clique, cadastro completo, histórico e controle de acesso ao portal | **Entregue + Evoluído** | `ClientesController` + `ClienteRepresentantesController` |
| **RF11–RF16** | Projetos | Criação, etapas customizáveis, tarefas, upload com visibilidade, cronograma e status | **Entregue + Evoluído** | `ProjetosController`, `TemplatesProjetoController`, `ArquivosController` |
| **RF17–RF21** | Portal do Cliente | Acesso exclusivo autenticado, etapa atual, cronograma, arquivos visíveis e modo leitura | **Entregue + Evoluído** | `portal-cliente.component` + `ProjetoOwnerHandler` + Chat |
| **RF22–RF24** | Simulador Honorários | Estimativa por metragem/padrão, memória de cálculo e proposta | **Pós-TCC** | Removido na consolidação `5d1f57d` / `ef07535` |
| **RF25–RF29** | Financeiro | Honorários, parcelas, status, painel consolidado, alertas e saídas | **Entregue + Evoluído** | `FinanceiroController` (inclui `Contratos_Financeiros`, `Parcelas_Financeiras`, `Despesas_Projetos`) |
| **RF30–RF32** | Fornecedores | Cadastro, vinculação a projetos, avaliações 1–5 e histórico/média | **Entregue** | `FornecedoresController` |
| **RF33** *(novo)* | Agenda | Compromissos vinculados a projeto/cliente/lead, export `.ics` e Google Calendar OAuth/Meet | **Entregue** | `AgendaController`, `GoogleCalendarService` |
| **RF34** *(novo)* | Chat em Tempo Real | Troca de mensagens entre equipe e cliente dentro do projeto | **Entregue** | `MensagensChatController` + `ChatHub` (`/hubs/chat`) |
| **RF35** *(novo)* | Equipe & RBAC | Convite, papéis e permissões granulares por módulo (`ModulosPermitidos`) | **Entregue** | `UsuariosController`, `[RequireModule]`, `moduleGuard` |
| **RF36** *(novo)* | Templates de Projeto | Modelos reutilizáveis de etapas e tarefas pré-carregados | **Entregue** | `TemplatesProjetoController`, `DbSeeder` |
| **RF37** *(novo)* | White-Label & Perfil | Personalização de logo, cor primária, dados do escritório e perfil | **Entregue** | `EmpresaConfiguracoesController`, `UsuariosController` |
| **RF38** *(novo)* | Recuperação de Senha | Fluxo completo de esqueci/redefinir senha via token hash + e-mail | **Entregue** | `RecuperacaoSenhaController` |
| **RF39** *(novo)* | Dashboard Dinâmico | Personalização e persistência de widgets por usuário | **Entregue** | `DashboardController`, `Preferencias_Dashboard` |
| **RF40** *(novo)* | Multi-Tenancy & SaaS | Isolamento por banco (`cotu_<tenant>`), auto-provisionamento e gestão SuperAdmin | **Entregue** | `TenantResolutionMiddleware`, `TenantDatabaseProvisioner`, `ArchiFlow.Admin.API` |

### 4.2 Requisitos Não Funcionais (RNF01 a RNF08)

| ID | Requisito | Como foi atendido na entrega |
| :--- | :--- | :--- |
| **RNF01 / RNF02** | Performance e capacidade | Arquitetura stateless com JWT, `AsNoTracking()` em leituras, pooling Npgsql, Caddy HTTP/2+HTTP/3 e build Angular AOT otimizado via Nginx. |
| **RNF03** | Autenticação JWT segura | HS256 com `ClockSkew = Zero`, BCrypt (`workFactor: 12`), tokens com `user_type`, `tenant`, `cliente_id` e `projeto_id`. |
| **RNF04** | Isolamento estrito de perfis e tenants | **Isolamento em dois níveis:** físico por banco (`cotu_<tenant>`) + autorização `ProjetoOwnerRequirement` / `ModulosPermitidos` / guards Angular. |
| **RNF05** | Responsividade Desktop/Mobile | Design System SCSS responsivo validado inclusive em **iPad** pela usuária operacional da Duna Arquitetura. |
| **RNF06** | Disponibilidade e monitoramento | Containers Docker com `restart: unless-stopped`, PostgreSQL `pg_isready` healthcheck e endpoint `/health` com `DatabaseHealthCheck`. |
| **RNF07** | Arquitetura em camadas e testes >= 75% backend / 25% frontend | Clean Architecture + Facades + Repositories; **Backend com 97,69% de cobertura de linhas e 80,56% de branches (84 suítes xUnit)** + **Frontend com 63,70% de linhas e 62,76% de statements (103 arquivos `.spec.ts`)** + **SonarCloud Quality Gate Passed** no CI. |
| **RNF08** | LGPD e proteção de dados | Isolamento físico por cliente/escritório, exclusão/desativação sem exposição cruzada, hashes irreversíveis em senhas e tokens, buckets S3 privados/controlados. |

### 4.3 Conformidade com Normas e Regulamentações (`normas.md`)

- **LGPD (Lei nº 13.709/2018):** cada escritório opera em banco PostgreSQL isolado (`cotu_<subdominio>`), facilitando auditoria, backup e exclusão de dados do titular sem afetar outros clientes; senhas protegidas com `BCrypt` (`workFactor: 12`) e tokens de recuperação/convite armazenados apenas por hash SHA-256.
- **Acessibilidade (WCAG 2.1 AA):** ajuste de contraste em inputs e botões do Design System SCSS (validado na Issue #23 / PR #22) e formulários com labels e mensagens de erro acessíveis.
- **Desenvolvimento Seguro (OWASP Top 10):** proteção contra SQL Injection (EF Core parametrizado + regex whitelist no provisionador), controle de acesso estrito por role/módulo/propriedade (anti-IDOR no `ProjetoOwnerHandler` e `ChatHub`), validação MIME/tamanho em uploads (`FileSecurityValidator`), HTTPS obrigatório via Caddy e headers/CORS restritos.
- **Licença de Software:** ambos os repositórios públicos (`ArchiFlow` e `ArchiFlow.API`) adotam a **Licença MIT** (`LICENSE` na raiz) e utilizam exclusivamente dependências open-source compatíveis.

---

## 5. Resumo da Validação de Extensão com a Duna Arquitetura

Entre outubro e novembro de 2026, a plataforma foi implantada em produção (`https://duna.cotu.com.br`) e validada continuamente em ciclos de feedback com **Sarah Bandoch** (sócia da Duna Arquitetura):

- **08/10/2026:** Solicitação de exibição de tarefas e entregas na agenda → integrada ao calendário corporativo.
- **15/10/2026:** Simplificação do Dashboard inicial ("O que fazer hoje", financeiro da semana e projetos por fase) → validada em produção e aprovada.
- **21/10/2026:** Ajuste de fuso horário UTC nos compromissos da agenda e correção do modal de templates de workflow → aprovados.
- **22/10/2026:** Desacoplamento de projeto em despesas operacionais avulsas (`ProjetoId` nullable) e inclusão de prazos editáveis por etapa e tarefa visíveis ao cliente no portal → aprovados em 24/10/2026.
- **Testes em dispositivos reais:** homologação em iPad e adoção direta pelos clientes finais da Duna Arquitetura no Portal do Cliente.

---

## 6. Decisões Arquiteturais (ADRs)

### ADR-01 — Multi-Tenancy Database-per-Tenant (`cotu_<subdominio>`)
- **Contexto:** O RFC previa um único banco compartilhado. Ao colocar o sistema em produção para a Duna Arquitetura e estruturar a oferta SaaS para outros escritórios, surgiu o risco de vazamento acidental de dados entre escritórios por falha de filtro `WHERE EscritorioId = ...` e a dificuldade de backup/exclusão LGPD por escritório.
- **Decisão:** Adotar **1 banco de dados PostgreSQL isolado por tenant** (`cotu`, `cotu_staging`, `cotu_duna`, `cotu_tcc`, etc.), resolvido dinamicamente por requisição via subdomínio e claim JWT `tenant`.
- **Alternativas consideradas:** Discriminator column (`TenantId` global com Query Filters) ou Schema-per-Tenant.
- **Consequências:** Isolamento físico absoluto, conformidade LGPD simplificada e backups independentes; em contrapartida, exige pool/provisionamento dinâmico e execução de migrations por base.

### ADR-02 — Auto-Provisionamento sob Demanda + Caddy On-Demand TLS
- **Contexto:** Criar manualmente banco de dados, rodar migrations, aplicar seeds e emitir certificado SSL para cada novo escritório inviabilizaria a escala do SaaS.
- **Decisão:** Criar o `TenantDatabaseProvisioner` (com `SemaphoreSlim` por tenant, cache em memória e whitelist regex `^[a-z0-9_]+$`) combinado ao `Caddy` com `*.cotu.com.br` e `on_demand_tls` validado pelo `/health`.
- **Consequências:** Um novo subdomínio passa a ter banco criado, migrado, semeado e certificado HTTPS emitido automaticamente na primeira requisição.

### ADR-03 — Separação em Ecossistema de 5 Aplicações (App, API, Admin, Admin API, Landing)
- **Contexto:** Misturar a gestão interna de assinaturas/faturamento dos escritórios (SuperAdmin) dentro da mesma API dos clientes gerava acoplamento de segurança e risco de privilégios (`AdministradorGeral` cruzando tenants, corrigido no PR #54 da API).
- **Decisão:** Isolar `ArchiFlow.Landing` (`cotu.com.br`) e a dupla `ArchiFlow.Admin` + `ArchiFlow.Admin.API` (`app.cotu.com.br`) conectada exclusivamente ao banco master `cotu`, separando-os da dupla principal `ArchiFlow` + `ArchiFlow.API` (`*.cotu.com.br`).
- **Consequências:** Superfície de ataque reduzida, deploy independente e eliminação de bypass entre SuperAdmin e workspaces de escritórios.

### ADR-04 — Evolução do Portal do Cliente para Multi-Representantes com Convite Assinado
- **Contexto:** No RFC, o acesso ao portal era uma única senha na tabela `Clientes`. Na prática de arquitetura, um cliente pode ser um casal, uma diretoria ou sócios que precisam de acessos individuais com e-mail próprio.
- **Decisão:** Criar a entidade `Representantes_Clientes` com fluxo de convite por token (`ConviteTokenHash`, expiração e ativação em `/ativar-conta`), mantendo compatibilidade com o campo legado `CLI_Senha_Portal` no `AuthService`.
- **Consequências:** Múltiplas pessoas do mesmo cliente acessam o portal com credenciais próprias e auditoria individual, sem quebrar clientes legados.

### ADR-05 — Desacoplamento de `ProjetoId` no Financeiro e Prazos por Etapa/Tarefa
- **Contexto:** Nem toda despesa de um escritório pertence a uma obra (ex.: aluguel, plotagem geral, licenças de software), e clientes cobravam datas claras de entrega por etapa no portal.
- **Decisão:** Tornar `ProjetoId` anulável (`IsRequired(false)`, `DeleteBehavior.SetNull`) em `Contratos_Financeiros`, `Parcelas_Financeiras` e `Despesas_Projetos`, adicionar controle de pagamento em despesas (`DSP_Pago`, `DSP_Data_Pagamento`), e adicionar `ETo_Data_Fim_Prevista` e `TAR_Data_Limite`.
- **Consequências:** O módulo financeiro passou a refletir o fluxo de caixa real do escritório e o cronograma do portal ganhou previsibilidade real.

### ADR-06 — Inclusão da Agenda com Google Calendar e Chat em Tempo Real (SignalR)
- **Contexto:** Embora listados fora do escopo no RFC inicial, a entrevista contínua com a parceira mostrou que reuniões/visitas a obra e dúvidas rápidas no portal eram as principais razões pelas quais o escritório ainda dependia de WhatsApp e agendas paralelas.
- **Decisão:** Implementar `AgendaController` (suportando `.ics`, Google Meet, OAuth 2.0 e Service Account) e `ChatHub` (SignalR autenticado com verificação de acesso ao projeto).
- **Consequências:** A plataforma passou a centralizar comunicação assíncrona/síncrona e calendário de entregas no mesmo workspace.

### ADR-07 — Consolidação do Escopo e Remoção Temporária do Simulador de Honorários
- **Contexto:** Após prototipar o Simulador de Honorários e Gerador de Propostas PDF, constatou-se baixa aderência imediata frente às demandas prioritárias do escritório e aumento expressivo da base de código a manter.
- **Decisão:** Remover temporariamente o módulo na refatoração de 26/10/2026 (`5d1f57d` / `ef07535`), mantendo-o como evolução futura Pós-TCC conforme previsto originalmente no RFC.
- **Consequências:** Código mais enxuto, cobertura de testes concentrada nos módulos centrais e menor carga cognitiva para o usuário.

### ADR-08 — Clean Architecture + Facade Pattern + RBAC Granular por Módulo
- **Contexto:** A API precisava crescer para 18 controllers sem acoplar controllers diretamente a múltiplos serviços/repositórios nem restringir permissões apenas por cargo fixo.
- **Decisão:** Adotar camadas estritas (`Domain` ← `Application` ← `Infrastructure` / `API`), introduzir **Facades** por módulo entre Controllers e Services, e combinar Policies de Role com o atributo `[RequireModule]` + `moduleGuard` no Angular baseado em `USR_Modulos_Permitidos`.
- **Consequências:** Controllers enxutos, alta testabilidade unitária (84 arquivos xUnit) e controle flexível de acesso por membro da equipe.

### ADR-09 — Estratégia Híbrida de Infraestrutura (VPS Docker/Caddy + AWS S3/SES + AWS CDK)
- **Contexto:** O projeto modelou infraestrutura corporativa na AWS via CDK (`infra/ArchiFlow.Infra`), porém para viabilizar custo previsível e operação imediata com múltiplos domínios SSL durante o TCC/extensão foi necessário um ambiente enxuto.
- **Decisão:** Executar a aplicação conteinerizada em VPS Ubuntu (Hostinger) via `docker-compose.prod.yml` + `Caddy` (HTTPS automático) + CI/CD GitHub Actions via SSH, mantendo **Amazon S3** (arquivos/logos/comprovantes) e **Amazon SES / SMTP Hostinger** para e-mails, enquanto o projeto AWS CDK permanece versionado para migração Enterprise futura.
- **Consequências:** Custo fixo baixo em produção, zero cold start, certificados automáticos e caminho de escala já codificado em IaC.
