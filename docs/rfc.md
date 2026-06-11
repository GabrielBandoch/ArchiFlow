# RFC — Proposta de Projeto: Plataforma Web de Gestão para Arquitetos

**Engenharia de Software — Centro Universitário Católica de Santa Catarina (Joinville)**

---

## Identificação

- **Título do Projeto:** Plataforma Web de Gestão de Projetos e Relacionamento com Clientes para Arquitetos
- **Linha de Projeto:** Web Applications
- **Autor:** Gabriel Felipe Alves Bandoch
- **Data da Proposta:** Março de 2026
- **Versão:** 1.0
- **Parceiro:** Duna Arquitetura — Joinville, SC

---

## 1. Visão do Produto e Impacto

Este projeto propõe o desenvolvimento de uma plataforma web voltada à gestão de projetos de arquitetura e ao relacionamento com clientes. O objetivo é oferecer maior transparência no andamento dos projetos, organização do fluxo comercial e apoio na definição de honorários profissionais.

Arquitetos e pequenos escritórios frequentemente utilizam ferramentas genéricas — planilhas, aplicativos de mensagens e serviços de armazenamento de arquivos — para gerenciar seus projetos. Essa fragmentação dificulta o acompanhamento estruturado das etapas, a comunicação com clientes e a organização de propostas comerciais.

A proposta é criar uma solução integrada que permita:
- acompanhamento visual do progresso de projetos por etapas
- gestão de leads e propostas comerciais (CRM)
- simulação estruturada de honorários por parâmetros do projeto
- centralização de arquivos, tarefas e decisões por projeto
- portal exclusivo de acompanhamento para clientes finais
- controle financeiro de honorários, parcelas e vencimentos
- cadastro e avaliação de fornecedores por projeto

Dessa forma, o sistema busca melhorar a organização do trabalho do arquiteto e oferecer maior transparência para os clientes envolvidos.

---

## 2. Contexto e Problema

No desenvolvimento de projetos de arquitetura, é comum que a comunicação entre arquiteto e cliente ocorra de forma descentralizada, utilizando múltiplas ferramentas como aplicativos de mensagens, e-mail, serviços de armazenamento em nuvem e planilhas. Esse modelo gera problemas recorrentes em quatro áreas:

### 2.1 Falta de Transparência no Andamento do Projeto
Clientes frequentemente não possuem visibilidade clara sobre:
- em qual etapa o projeto se encontra
- quais entregas já foram realizadas
- quais são os próximos passos previstos

Essa falta de visibilidade gera dúvidas frequentes e a necessidade constante de atualizações por parte do arquiteto. A ausência de um canal estruturado de acompanhamento é percebida como falta de profissionalismo, mesmo quando o trabalho técnico é de alta qualidade.

### 2.2 Falta de Organização Comercial
Arquitetos enfrentam dificuldades no gerenciamento do fluxo de novos clientes:
- registro e rastreamento de leads por origem
- acompanhamento de propostas enviadas e status de negociação
- histórico de interações com cada potencial cliente
- controle de oportunidades de projeto em aberto

Sem rastreamento estruturado, oportunidades se perdem no meio de conversas de mensageiro. Em muitos casos, essas informações são mantidas em planilhas ou ferramentas genéricas que não refletem o fluxo específico do trabalho de arquitetura.

### 2.3 Precificação Inconsistente de Projetos
Outro desafio recorrente está na definição do valor de projetos arquitetônicos. Arquitetos frequentemente precisam considerar: metragem do projeto, tipo de construção, padrão do imóvel, nível de detalhamento e etapas inclusas no escopo. Sem uma ferramenta estruturada, esse processo pode gerar precificações inconsistentes entre projetos similares ou baseadas apenas em experiência pessoal, dificultando a justificativa de valores ao cliente.

### 2.4 Dispersão de Informações e Arquivos
Cada projeto gera um volume expressivo de arquivos: plantas em diferentes versões, memoriais descritivos, contratos, comprovantes e referências visuais. Sem repositório centralizado, esses arquivos ficam dispersos em pastas sem padronização, perdidos em e-mails ou armazenados em dispositivos pessoais — dificultando o acesso rápido e a rastreabilidade de versões.

---

## 3. Origem da Demanda e Evidências

A demanda para o desenvolvimento deste projeto surgiu a partir da observação direta do fluxo de trabalho da **Duna Arquitetura**, pequeno escritório que atua na elaboração de projetos residenciais, comerciais e de interiores em Joinville, SC. Durante interações com a arquiteta responsável, foram identificadas dificuldades recorrentes relacionadas à organização das informações, comunicação com clientes e controle do processo comercial.

### 3.1 Pesquisa com Usuários

Como forma de validar as hipóteses levantadas, foi conduzida uma entrevista exploratória com a profissional responsável pelo escritório. 

| Usuário | Perfil | Principal Dor Identificada |
|---------|--------|----------------------------|
| Arquiteta | Sócia da Duna Arquitetura | Falta de visibilidade do andamento dos projetos |
| Arquiteta | Sócia da Duna Arquitetura | Comunicação descentralizada com clientes |
| Arquiteta | Sócia da Duna Arquitetura | Dificuldade na organização de leads e propostas |
| Arquiteta | Sócia da Duna Arquitetura | Ausência de padronização na precificação |
| Arquiteta | Sócia da Duna Arquitetura | Controle financeiro desconectado dos projetos |

---

## 4. Análise de Soluções Existentes

Atualmente existem diversas ferramentas voltadas à gestão de tarefas e projetos, porém a maioria é de uso genérico e não considera as particularidades do domínio da arquitetura.

### Comparação

| Solução | Especialização | CRM | Portal Cliente | Financeiro | Aderência |
|---------|----------------|-----|----------------|------------|-----------|
| Trello | Genérica | Não | Não | Não | Baixa |
| Notion | Genérica | Não | Não | Não | Baixa |
| Monday.com | Genérica | Sim | Não | Parcial | Média |
| ArchiSnapper | Arquitetura | Não | Não | Não | Parcial |
| **Este projeto** | **Arquitetura** | **Sim** | **Sim** | **Sim** | **Alta** |

### Diferencial do Projeto
O sistema proposto se diferencia ao oferecer uma solução integrada e especializada, contemplando:
- gestão completa do ciclo de vida dos projetos arquitetônicos
- organização do processo comercial (funil de leads e CRM)
- simulador de honorários baseado em parâmetros reais do projeto
- portal exclusivo para o cliente acompanhar o andamento
- controle financeiro e gestão de fornecedores integrados

---

## 5. Público-Alvo

O público-alvo principal do sistema são **arquitetos autônomos e pequenos escritórios de arquitetura** (até 10 profissionais). Esses profissionais atuam simultaneamente em múltiplos projetos e necessitam organizar a comunicação com clientes, arquivos de projeto, cronogramas e propostas comerciais de forma eficiente.

Além dos arquitetos, os **clientes finais** também interagem com o sistema por meio de um portal exclusivo de acompanhamento, com acesso somente leitura restrito ao próprio projeto.

---

## 6. Objetivos do Projeto

### 6.1 Objetivo Geral
Desenvolver uma plataforma web que permita arquitetos gerenciar o ciclo completo de projetos — do primeiro contato com o potencial cliente até o encerramento financeiro —, de forma organizada e transparente, especializada para o domínio da arquitetura.

### 6.2 Objetivos Específicos
1. Implementar um módulo de gestão de leads com funil visual, registro de origem e histórico de contatos.
2. Implementar um CRM básico com conversão de lead em cliente e histórico de projetos vinculados.
3. Desenvolver um sistema de gestão de projetos com etapas customizáveis, tarefas, cronograma e upload de arquivos.
4. Criar um portal exclusivo por cliente com acesso autenticado ao status do projeto, cronograma e documentos compartilhados.
5. Implementar um simulador de honorários baseado em parâmetros concretos do projeto.
6. Desenvolver um módulo financeiro para controle de honorários, parcelas e visão consolidada.
7. Criar um cadastro de fornecedores com histórico de uso por projeto e avaliação de qualidade.

---

## 7. Métricas de Sucesso

| Indicador | Meta | Como medir |
|-----------|------|------------|
| Tempo médio de resposta (p95) | < 300 ms | Testes de carga (k6) |
| Usuários simultâneos suportados | >= 100 | Teste de carga automatizado |
| Disponibilidade em produção | >= 99% | Monitoramento de uptime |
| Cobertura de testes automatizados | >= 60% | Relatório xUnit + CI |
| Tamanho máximo de arquivo por upload | até 20 MB | Validação no backend |
| Tempo de onboarding do arquiteto | < 30 min | Teste com usuário real |
| Substituição das planilhas (Duna Arq.) | 100% | Validação com a parceira |
| Redução de mensagens repetitivas | Queda perceptível | Relato pós-implantação |

---

## 8. Engenharia de Requisitos

### 8.1 Personas

**Persona 1 — Marina Sievert, Arquiteta e Sócia**
- **Perfil:** 34 anos, sócia de um pequeno escritório em Joinville, gerencia 6 a 12 projetos simultâneos. Usa WhatsApp, Google Drive e planilha para controle financeiro.
- **Objetivos:** ter controle visual claro dos projetos; reduzir mensagens repetitivas de clientes; profissionalizar o processo comercial.

**Persona 2 — Carlos Mendonça, Cliente Final**
- **Perfil:** 48 anos, empresário, contratou reforma de escritório comercial. Viaja com frequência e tem pouco tempo.
- **Objetivos:** saber em que etapa está o projeto sem precisar perguntar; acessar documentos de qualquer dispositivo.

### 8.2 Casos de Uso Principais

| Caso de Uso | Ator | Módulo |
|-------------|------|--------|
| Cadastrar e gerenciar lead com origem, status e histórico | Arquiteto | Gestão de Leads |
| Converter lead em cliente e criar projeto associado | Arquiteto | CRM |
| Simular honorários por parâmetros do projeto | Arquiteto | Simulador |
| Criar projeto com etapas, tarefas e cronograma | Arquiteto | Projetos |
| Registrar honorários e controlar pagamentos | Arquiteto | Financeiro |
| Acessar portal exclusivo e visualizar status do projeto | Cliente Final | Portal |
| Baixar documentos disponibilizados pelo arquiteto | Cliente Final | Portal |

![Diagrama de Casos de Uso](docs/diagramas/use_case.png)

### 8.3 Requisitos Funcionais

| ID | Descrição |
|----|-----------|
| **Módulo 1 — Gestão de Leads** | |
| RF01 | O sistema deve permitir que o arquiteto cadastre um lead com nome, e-mail, telefone, origem do contato e observações. |
| RF02 | O sistema deve permitir que o arquiteto altere o status do lead (Novo, Em Contato, Proposta Enviada, Negociando, Convertido e Perdido). |
| RF03 | O sistema deve exibir um painel Kanban dos leads organizados por status com totalizadores por coluna. |
| RF04 | O sistema deve permitir registrar o histórico de contatos de cada lead (data, canal e resumo). |
| RF05 | O sistema deve registrar automaticamente a data de criação e data de última atualização de cada lead. |
| **Módulo 2 — CRM / Gestão de Clientes** | |
| RF06 | O sistema deve permitir que o arquiteto converta um lead em cliente com um clique. |
| RF07 | O sistema deve permitir o cadastro completo do cliente: nome, CPF/CNPJ, e-mail, telefone e endereço. |
| RF08 | O sistema deve exibir, na ficha do cliente, o histórico de interações e todos os projetos vinculados. |
| RF09 | O sistema deve gerar automaticamente as credenciais de acesso ao portal do cliente no momento da conversão. |
| RF10 | O sistema deve permitir ativar e desativar o acesso do cliente ao portal sem excluir seus dados. |
| **Módulo 3 — Gestão de Projetos** | |
| RF11 | O sistema deve permitir que o arquiteto crie um projeto vinculado a um cliente, com título, tipo, data de início e prazo previsto. |
| RF12 | O sistema deve permitir a definição de etapas customizáveis por projeto. |
| RF13 | O sistema deve permitir a criação de tarefas dentro de cada etapa, com título, responsável, prazo e status. |
| RF14 | O sistema deve permitir o upload de arquivos por projeto com controle de visibilidade ao cliente no portal. |
| RF15 | O sistema deve exibir um cronograma visual com as etapas e prazos do projeto. |
| RF16 | O sistema deve manter um histórico de alterações de status e de etapas concluídas. |
| **Módulo 4 — Portal do Cliente** | |
| RF17 | O sistema deve fornecer ao cliente acesso exclusivo ao portal do projeto, autenticado por e-mail e senha. |
| RF18 | O portal deve exibir a etapa atual, o histórico de etapas concluídas e os próximos passos previstos. |
| RF19 | O portal deve exibir o cronograma do projeto com prazos previstos por etapa. |
| RF20 | O portal deve permitir que o cliente visualize e faça download apenas dos arquivos visíveis. |
| RF21 | O portal deve ter acesso somente leitura. |
| **Módulo 5 — Simulador de Honorários** | |
| RF22 | O sistema deve calcular uma estimativa de honorários com base em: metragem, tipo de projeto, padrão do imóvel e etapas inclusas. |
| RF23 | O sistema deve exibir o resultado detalhado com a memória de cálculo. |
| RF24 | O sistema deve permitir salvar a simulação como proposta e associá-la a um lead ou cliente. |
| **Módulo 6 — Gestão Financeira** | |
| RF25 | O sistema deve permitir o registro de honorários por projeto com valor total e divisão em parcelas. |
| RF26 | O sistema deve controlar o status de cada parcela: Aguardando, Pago e Atrasado. |
| RF27 | O sistema deve exibir um painel financeiro consolidado: total previsto, recebido e pendente. |
| RF28 | O sistema deve emitir alertas visuais para parcelas vencendo nos próximos 7 dias e em atraso. |
| RF29 | O sistema deve permitir o registro de saídas financeiras associadas a projetos. |
| **Módulo 7 — Gestão de Fornecedores** | |
| RF30 | O sistema deve permitir o cadastro de fornecedores com nome, especialidade, telefone e e-mail. |
| RF31 | O sistema deve permitir a vinculação de fornecedores a projetos e o registro de avaliação de 1 a 5. |
| RF32 | O sistema deve exibir na ficha do fornecedor o histórico de projetos em que foi utilizado. |

### 8.4 Requisitos Não Funcionais

| ID | Descrição |
|----|-----------|
| RNF01 | O sistema deve ter tempo de resposta das páginas principais inferior a 500 ms em condições normais de uso. |
| RNF02 | O sistema deve suportar ao menos 50 usuários simultâneos sem degradação de performance. |
| RNF03 | O sistema deve utilizar autenticação segura via JWT. |
| RNF04 | O sistema deve garantir isolamento completo entre perfis: o cliente acessa apenas dados do seu próprio projeto. |
| RNF05 | O sistema deve ser responsivo e funcionar em navegadores desktop e mobile modernos. |
| RNF06 | O sistema deve ter uptime mínimo de 99% durante o período de avaliação. |
| RNF07 | O código deve seguir arquitetura em camadas (controller / service / repository) com cobertura mínima de 60% de testes nos módulos críticos. |
| RNF08 | Os dados pessoais coletados devem estar em conformidade com a LGPD, com exclusão de dados disponível a qualquer momento. |

### 8.5 Regras de Negócio
- Somente o arquiteto autenticado pode criar, editar e excluir dados do próprio escritório.
- O cliente acessa apenas o portal do seu projeto, com permissão somente leitura.
- Um lead só pode ser convertido em cliente após ter nome, e-mail e origem preenchidos.
- Arquivos só ficam visíveis no portal do cliente se o arquiteto marcar explicitamente "visível ao cliente".
- Registros financeiros devem ser obrigatoriamente vinculados a um projeto existente.
- O simulador gera apenas estimativa orientativa; o valor final pode ser ajustado manualmente antes de salvar.
- A exclusão de um projeto requer confirmação explícita e mantém log de auditoria.

### 8.6 Fora do Escopo
O sistema **não contemplará**, na versão atual:
- integração com sistemas de nota fiscal, ERP contábil ou campanhas de marketing
- aplicativo mobile nativo (iOS/Android) — o sistema é acessível via browser responsivo
- relatórios avançados com Business Intelligence ou dashboards analíticos
- chat interno entre arquiteto e cliente dentro da plataforma
- assinatura digital de contratos
- módulo de gestão de obras (RDO, vistorias, medições, controle de materiais)

---

## 9. Fluxos e Comportamento do Sistema

### 9.1 Fluxo Principal do Usuário
O diagrama abaixo representa o fluxo completo desde a captura de um lead até o encerramento financeiro do projeto, incluindo a camada de interação do cliente via portal.

![Fluxo principal: ciclo de vida do projeto](docs/diagramas/user_flow.png)

---

## 10. Mockups e Experiência do Usuário (UX)

Esta seção apresenta a visualização do produto baseada no Design System criado no Figma, garantindo a padronização visual das interfaces.

### 10.1 Fluxo de Navegação
![Fluxo de navegação — mapa de telas](docs/diagramas/nav_flow.png)

### 10.2 Telas Principais (Alta Fidelidade)

**Dashboard do Arquiteto**
Visão consolidada com cards de projetos em andamento, leads pendentes e parcelas vencendo. Menu lateral fixo para navegação ágil.
![Dashboard Geral do Arquiteto](docs/mockup/dash_figma.png)

**Gestão de Leads (Kanban)**
Interface organizada em colunas por status. Permite ao arquiteto visualizar rapidamente o funil comercial e as propostas em negociação.
![Painel de Gestão de Leads](docs/mockup/lead_figma.png)

**Diretório de Clientes (CRM)**
Lista centralizada de clientes convertidos, com controle direto do acesso e revogação de credenciais ao Portal do Cliente.
![Gestão de Clientes e Acessos](docs/mockup/clientes_figma.png)

**Simulador de Honorários**
Ferramenta para cálculo base de precificação utilizando parâmetros como metragem, tipo de projeto e etapas inclusas no escopo.
![Simulador de Honorários Parametrizado](docs/mockup/simulador_figma.png)

**Detalhes do Projeto**
Centraliza as etapas em andamento, resumo financeiro do contrato, tarefas ativas e acesso rápido aos arquivos recentes.
![Detalhe Interno do Projeto](docs/mockup/proj_figma.png)

**Módulo Financeiro**
Painel focado no fluxo de caixa do escritório, agrupando recebimentos previstos, pendentes e parcelas em atraso de todos os projetos.
![Visão Financeira Consolidada](docs/mockup/financeiro_figma.png)

**Gestão de Fornecedores**
Diretório de parceiros e fornecedores de materiais, permitindo filtragem por especialidade e visualização de avaliações.
![Diretório de Fornecedores](docs/mockup/fornecedor_figma.png)

**Portal do Cliente (Interface Externa)**
Visão limpa e exclusiva para o cliente final. Focada no status do projeto (progresso da etapa) e download de arquivos aprovados.
![Portal de Acompanhamento do Cliente](docs/mockup/portal_cliente_figma.png)

---

## 11. Arquitetura do Sistema

### 11.1 Diagramas C4

**Nível 1 — Diagrama de Contexto**
O diagrama de contexto posiciona o sistema no seu ecossistema externo, mostrando os atores principais.
![Diagrama C4 Nível 1](docs/diagramas/c4_context.png)

**Nível 2 — Diagrama de Containers**
O diagrama de containers decompõe o sistema em suas unidades de execução (SPA, API Backend e Banco de Dados).
![Diagrama C4 Nível 2](docs/diagramas/c4_containers.png)

**Nível 3 — Diagrama de Componentes**
Foco na organização interna da API Backend (ASP.NET Core), detalhando as camadas de Controllers, Services e Persistência.
![Diagrama C4 Nível 3](docs/diagramas/c4_application.png)

### 11.2 Modelo de Dados
O diagrama abaixo apresenta as entidades principais do sistema, seus atributos e os relacionamentos relacional do banco PostgreSQL.

![Diagrama Entidade-Relacionamento](docs/diagramas/erd.png)

### 11.3 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | Angular 17 + TypeScript | Framework opinado, ideal para SPA complexas; tipagem forte garante contrato. |
| Backend | ASP.NET Core 8 (C#) | Alta performance, injeção de dependência nativa e ecossistema robusto. |
| Banco | PostgreSQL 15+ | Robusto, open-source, suporte a relacionamentos complexos. |
| ORM | EF Core 8 | ORM oficial do .NET; migrations e LINQ. |

---

## 12. Segurança e Planejamento

| Risco (OWASP Top 10) | Medida Adotada |
|----------------------|----------------|
| Injeção (SQL Injection) | Entity Framework Core 8 com queries parametrizadas; sem SQL dinâmico. |
| Autenticação fraca | JWT com expiração de 8h; bcrypt para senhas. |
| Dados sensíveis expostos | HTTPS obrigatório; credenciais em variáveis de ambiente. |
| Controle de acesso | Middleware de autorização em todas as rotas. |
| Configurações inseguras | Headers HTTP seguros (CSP, HSTS); CORS com allowlist. |
| Upload malicioso | Validação de tipo MIME e limite de tamanho no backend. |
| Força bruta | Rate limiting por IP nas rotas de autenticação. |

### Planejamento de Marcos (Roadmap)
O projeto segue um roadmap de 12 semanas, divididos em Marcos (M1 a M5):
- **M1 (Semanas 1-2):** Setup do ambiente, modelagem do banco e autenticação JWT.
- **M2 (Semanas 3-5):** Gestão de Leads, CRM, Projetos.
- **M3 (Semanas 6-8):** Portal do Cliente, Simulador de Honorários e Upload de Arquivos.
- **M4 (Semanas 9-10):** Módulo financeiro e Fornecedores.
- **M5 (Semanas 11-12):** Testes automatizados (>=60%), correção de bugs e entrega final.

---

## 13. Referências
- Angular 17 — https://angular.dev
- ASP.NET Core 8 — https://learn.microsoft.com/aspnet/core
- Entity Framework Core 8 — https://learn.microsoft.com/ef/core
- PostgreSQL — https://www.postgresql.org/docs
- C4 Model (Simon Brown) — https://c4model.com
- OWASP Top 10 (2021) — https://owasp.org/www-project-top-ten

---

## 14. Apêndices

### Acesso ao Protótipo Completo (Figma)
O protótipo navegável de alta fidelidade e todo o ecossistema de componentes do Design System estão hospedados na nuvem.

🔗 **Link do Protótipo:** [Acessar Figma](https://www.figma.com/design/XH7apZJkyDgdDlX48EAOE1/ArchiFlow?node-id=0-1&t=Bk1S9XY2fzjgK4fm-1)

---
*Fim do Documento*
