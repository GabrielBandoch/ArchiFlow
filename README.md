# COTU (ArchiFlow) — Frontend Web (Angular 17)

Plataforma web de gestão de projetos, relacionamento com clientes (CRM), financeiro, fornecedores e portal white-label para escritórios de arquitetura.

- **Instituição:** Centro Universitário Católica de Santa Catarina — Joinville/SC (Engenharia de Software — TCC)
- **Autor:** Gabriel Felipe Alves Bandoch
- **Parceiro de Extensão & Validação:** Duna Arquitetura (Joinville/SC)
- **Repositório Backend:** [GabrielBandoch/ArchiFlow.API](https://github.com/GabrielBandoch/ArchiFlow.API)

![CI](https://github.com/GabrielBandoch/ArchiFlow/actions/workflows/ci.yml/badge.svg)

---

## Acesso Rápido para a Banca Avaliadora

- **Ambiente de Demonstração (Tenant TCC):** `https://tcc.cotu.com.br/`
- **Escritório configurado (White-Label):** `COTU Studio — Demonstração TCC` (Joinville/SC)
- **Roteiro de testes passo a passo:** [`docs/GUIA_BANCA_DEMONSTRACAO.md`](docs/GUIA_BANCA_DEMONSTRACAO.md)

### Credenciais de Teste Prontas (Admin, Equipe RBAC e Portal do Cliente)

| Perfil / Papel | E-mail | Senha | Módulos / Acesso |
| :--- | :--- | :--- | :--- |
| **Arquiteto Sócio / Admin (Banca)** | `professores@cotu.com.br` | `catolicasc123456` | Acesso completo aos **7 módulos operacionais** |
| **Portal do Cliente (`Família Nogueira`)** | `nogueira.cliente@cotustudio.exemplo.br` | `Cliente@2026` | `/portal` (etapas, arquivos e chat de *Residência Vale Verde*) |
| **Gerente de Projetos** *(Camila Ferreira)* | `camila.ferreira@cotustudio.exemplo.br` | `Equipe@2026` | Dashboard, Projetos, Clientes, Leads, Fornecedores e Financeiro |
| **Arquiteto Colaborador** *(Rafael Duarte)* | `rafael.duarte@cotustudio.exemplo.br` | `Equipe@2026` | Dashboard, Projetos, Clientes e Fornecedores |
| **Administrativo / Financeiro** *(Beatriz Mendes)* | `beatriz.mendes@cotustudio.exemplo.br` | `Equipe@2026` | Dashboard, Financeiro e Clientes |
| **Estagiário** *(Lucas Andrade)* | `lucas.andrade@cotustudio.exemplo.br` | `Equipe@2026` | Projetos e Fornecedores |

### Massa de Dados Já Populada no Ambiente (`cotu_tcc`)

- **Clientes (4):** `Família Nogueira`, `Helena & Marcos Silveira`, `Clínica OdontoPrime`, `Café Botânico Joinville`.
- **Projetos (4 · 735 m²):** `Residência Vale Verde — Família Nogueira` (*Desenvolvimento*, 285 m²), `Apartamento Jardins — Interiores` (*Aprovação*, 145 m²), `Clínica OdontoPrime — Sede América` (*Execução*, 210 m²) e `Café Botânico — Consultoria de Fachada` (*Briefing*, 95 m²).
- **Fornecedores (5 · 3 avaliados):** `Marcenaria Joinville Sob Medida` (5.0), `Lumina Arquitetura em Iluminação` (5.0), `Pedras do Vale Marmoraria` (4.0), `VetroSul Esquadrias & Vidros` e `VerdeVivo Paisagismo Contemporâneo`.
- **CRM / Leads (9) & Financeiro:** funil distribuído em *Novos*, *Em Contato*, *Proposta Enviada*, *Negociando*, *Convertidos* (4) e *Perdidos* (1); **3 contratos** (`R$ 82.000,00` previstos / `R$ 29.000,00` recebidos em PIX e transferência), **5 despesas** (`R$ 6.345,00`), **2 arquivos** visíveis no portal e **Chat SignalR** ativo.

---

## Onde Está Localizada Cada Documentação

### Neste Repositório (`ArchiFlow/docs/`)

| Documento | O que você encontra |
| :--- | :--- |
| **[`docs/README.md`](docs/README.md)** | Hub central da documentação com índice de ambos os repositórios e roteiro de leitura para a banca. |
| **[`docs/EVOLUCAO_RFC_VS_ENTREGUE.md`](docs/EVOLUCAO_RFC_VS_ENTREGUE.md)** | Comparativo completo entre o RFC v1.0 e o sistema entregue, justificativas de mudanças, matriz RF/RNF, validação com a Duna Arquitetura e **ADRs 01–09**. |
| **[`docs/ARQUITETURA_MULTITENANT_E_PROVISIONAMENTO.md`](docs/ARQUITETURA_MULTITENANT_E_PROVISIONAMENTO.md)** | Explicação ponta a ponta do ecossistema SaaS, contratação/pagamento (`Tenants_Assinaturas`), Caddy On-Demand TLS e criação automática da base PostgreSQL. |
| **[`docs/MODELO_DE_DADOS.md`](docs/MODELO_DE_DADOS.md)** | Diagrama ERD atualizado (**23 tabelas por tenant + `Tenants_Assinaturas` no master**) e explicação individual do porquê cada nova tabela foi criada. |
| **[`docs/GUIA_BANCA_DEMONSTRACAO.md`](docs/GUIA_BANCA_DEMONSTRACAO.md)** | Guia prático de navegação em `https://tcc.cotu.com.br/` módulo a módulo. |
| **[`docs/rfc.md`](docs/rfc.md)** · **[`docs/rfc_tcc.pdf`](docs/rfc_tcc.pdf)** | Proposta original v1.0 aprovada em Março/2026 (preservada como referência histórica). |
| **[`docs/Diagramas/`](docs/Diagramas/)** & **[`docs/Mockup/`](docs/Mockup/)** | Diagramas iniciais do RFC e mockups de alta fidelidade do Figma. |

### No Repositório Backend (`ArchiFlow.API`)

| Documento | O que você encontra |
| :--- | :--- |
| **[`ArchiFlow.API/README.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/README.md)** | Visão geral da API .NET 8, mapa de 17 Controllers + SignalR Hub, camadas Clean Architecture e instruções de execução. |
| **[`wiki/Arquitetura.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/wiki/Arquitetura.md)** | Clean Architecture, Facades, C4 atualizado (Níveis 1, 2 e 3), OWASP Top 10, RBAC e Health Checks. |
| **[`wiki/Multi-Tenancy-e-Provisionamento.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/wiki/Multi-Tenancy-e-Provisionamento.md)** | Detalhamento técnico de `TenantResolutionMiddleware`, `TenantContext`, `TenantDatabaseProvisioner` e `DbSeeder`. |
| **[`wiki/Modelo-de-Dados-e-Migracoes.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/wiki/Modelo-de-Dados-e-Migracoes.md)** | Catálogo técnico do `ArchiFlowDbContext`, conversor UTC e estratégia de migrations/seeds. |
| **[`wiki/Evolucao-Arquitetural-e-ADRs.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/wiki/Evolucao-Arquitetural-e-ADRs.md)** | Registro técnico das decisões arquiteturais e evolução pós-RFC no backend. |
| **[`wiki/Instrucoes-de-Deploy.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/wiki/Instrucoes-de-Deploy.md)** · **[`deploy/README.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/deploy/README.md)** | Deploy local, Docker Compose em produção (VPS Hostinger + Caddy 2) e AWS CDK (`infra/`). |

---

## Resumo das Evoluções Principais (RFC v1.0 → Sistema Final)

1. **Rebranding para COTU & Ecossistema SaaS Multi-Tenant:** o sistema passou a operar com **1 banco PostgreSQL isolado por escritório** (`cotu_duna`, `cotu_tcc`, `cotu_staging`), com criação automática sob demanda na primeira requisição e emissão automática de SSL via Caddy.
2. **Módulos Pós-TCC Antecipados:** **Financeiro** (Contratos, Parcelas, Despesas avulsas/por projeto, comprovantes S3) e **Fornecedores** (diretório, vínculo N:N, avaliações 1–5, WhatsApp) foram totalmente implementados e homologados.
3. **Novos Módulos Demandados em Campo:** **Chat em Tempo Real via SignalR**, **Templates de Workflow de Projeto**, **Portal Multi-Representantes com convite assinado**, **RBAC granular por módulo**, **White-Label (`Dados_Empresa`)** e **Dashboard personalizável**.
4. **Simulador de Honorários (Pós-TCC):** prototipado e posteriormente consolidado/removido (`ef07535`) para priorizar o núcleo operacional validado com a Duna Arquitetura.

---

## Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| Framework | Angular 17 · Standalone Components |
| Linguagem | TypeScript 5.4 |
| Estilos | SCSS · Design System próprio (`shared/`) |
| HTTP & Reatividade | Angular `HttpClient` · RxJS 7.8 |
| Tempo Real | `@microsoft/signalr` 10 |
| Testes | Karma · Jasmine (`103` arquivos `.spec.ts`) |
| Container & Proxy | Nginx (SPA) atrás de Caddy 2 (`*.cotu.com.br`) |
| CI/CD | GitHub Actions (build prod, testes headless, cobertura e deploy automatizado) |

---

## Estrutura do Código Frontend ("Onde está cada coisa")

```text
src/
├── index.html, main.ts, styles.scss
└── app/
    ├── app.config.ts               # Providers globais, interceptor HTTP e GlobalErrorHandler
    ├── app.routes.ts               # Mapa de rotas lazy-loaded com staffGuard, portalGuard e moduleGuard
    ├── commands/                   # Contratos de entrada tipados (POST/PUT/PATCH por módulo)
    ├── core/
    │   ├── api/                    # Services HTTP por domínio (arquivos, auth, chat, clientes, dashboard, empresa, financeiro, fornecedores, leads, projetos, usuarios)
    │   ├── guards/                 # role.guard.ts (staffGuard, portalGuard) e module.guard.ts (RBAC granular)
    │   ├── handlers/               # GlobalErrorHandler
    │   ├── interceptors/           # AuthInterceptor (injeção do Bearer JWT e tratamento de sessão)
    │   ├── models/                 # Interfaces TypeScript espelhando DTOs do backend
    │   ├── pipes/                  # Pipes standalone reutilizáveis (formatação, máscaras, datas)
    │   ├── services/               # Serviços transversais (AuthService, SignalR Chat, Notification, Theme/Empresa)
    │   └── utils/                  # Utilitários (sanitização, máscaras WhatsApp/CPF/CNPJ, datas UTC)
    ├── components/
    │   ├── autenticacao/           # Login, Recuperar Senha, Redefinir Senha, Ativar Conta (convite)
    │   ├── dashboard/              # Painel inicial com widgets personalizáveis
    │   ├── leads/                  # Quadro Kanban de leads e gestão de origens
    │   ├── clientes/               # Lista de clientes, ficha detalhada e representantes do portal
    │   ├── projetos/               # Lista, detalhes, etapas, tarefas, arquivos e chat do projeto
    │   ├── financeiro/             # Fluxo de caixa, gráficos, contratos, parcelas e despesas
    │   ├── fornecedores/           # Diretório, detalhes, avaliações e vínculo com projetos
    │   ├── portal/                 # Portal do Cliente (leitura de etapas, prazos, arquivos e chat)
    │   ├── configuracoes/          # Dados da Empresa (White-Label), Templates de Projeto, Origens e Equipe/RBAC
    │   ├── perfil/                 # Meu Perfil (dados pessoais, foto e alteração de senha)
    │   └── showcase/               # Showcase de componentes do Design System
    ├── dialogs/                    # Modais padronizados por módulo (clientes, configuracoes, dashboard, financeiro, fornecedores, leads, projetos)
    ├── layout/                     # auth-layout, main-layout (sidebar dinâmica por permissão), portal-layout
    └── shared/                     # Componentes reutilizáveis do Design System (app-input, app-button, cotu-logo, modais de confirmação, etc.)
```

---

## Mapa de Rotas e Módulos

| Módulo | Rota | Guards / Acesso | Status |
| :--- | :--- | :--- | :--- |
| **Autenticação & Convite** | `/login`, `/recuperar-senha`, `/redefinir-senha`, `/ativar-conta` | Público | Concluído |
| **Portal do Cliente** | `/portal`, `/portal/:id` | `portalGuard` (Cliente / Representante) | Concluído |
| **Dashboard** | `/dashboard` | `staffGuard` + `moduleGuard("dashboard")` | Concluído |
| **Leads (Kanban)** | `/leads`, `/leads/origens` | `staffGuard` + `moduleGuard("leads")` | Concluído |
| **Clientes (CRM)** | `/clientes`, `/clientes/:id` | `staffGuard` + `moduleGuard("clientes")` | Concluído |
| **Projetos** | `/projetos`, `/projetos/:id` | `staffGuard` + `moduleGuard("projetos")` | Concluído |
| **Financeiro** | `/financeiro` | `staffGuard` + `moduleGuard("financeiro")` | Concluído |
| **Fornecedores** | `/fornecedores`, `/fornecedores/:id` | `staffGuard` + `moduleGuard("fornecedores")` | Concluído |
| **Configurações** | `/configuracoes/empresa`, `templates-projeto`, `origens-lead`, `equipe` | `staffGuard` + `moduleGuard("configuracoes")` | Concluído |
| **Meu Perfil** | `/perfil` | `staffGuard` | Concluído |

---

## Pré-requisitos e Execução Local

### Pré-requisitos
- [Node.js 20+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
- Backend `ArchiFlow.API` rodando em `http://localhost:5000` (ou configurado no `proxy.conf.json`)

### Comandos

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento com proxy (/api/* -> http://localhost:5000/api/*)
npm start

# Build de produção
npm run build:prod
```

### Testes Automatizados

```bash
# Executar testes headless (ChromeHeadless)
npm test

# Executar com relatório de cobertura (usado no GitHub Actions)
npm run test:ci
```

---

## Qualidade, Cobertura de Testes e Conformidade (Normas)

| Indicador | Resultado Medido (CI) | Meta da Disciplina (Web Apps) |
| :--- | :--- | :--- |
| **Cobertura Frontend (Karma/Jasmine)** | **63,70% linhas** · 62,76% statements (`103` specs) | `>= 25%` (**Aprovado**) |
| **Cobertura Backend (xUnit / Cobertura)** | **97,69% linhas** · 80,56% branches (`84` suítes) | `>= 75%` (**Aprovado**) |
| **Análise Estática (SonarCloud)** | **Quality Gate Passed** (0 issues / 0 security hotspots) | Obrigatório |
| **Licença de Software** | **MIT License** ([`LICENSE`](LICENSE)) | Core (`normas.md`) |
| **Privacidade & Segurança** | **LGPD** (isolamento físico por tenant + BCrypt/JWT) · **OWASP Top 10** · **WCAG 2.1 AA** | Core (`normas.md`) |

---

## CI/CD

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) executa automaticamente em todo `push` e `pull_request` para `main`:
1. `npm ci` (Node.js 20)
2. `npm run build:prod`
3. `npm run test:ci` com upload do relatório de cobertura
4. Deploy automático em produção (VPS Hostinger) via GitHub Actions CI/CD quando há push na `main`, reconstruindo e reiniciando `cotu-web` e `cotu-web-staging`.
