# 📄 RFC – Plataforma de Gestão para Arquitetos

**Autor:** Gabriel Felipe Alves Bandoch
**Data:** Março de 2026
**Versão:** 1.0

---

# Linha de Projeto

Web Applications

---

# Visão do Produto e Impacto

Este projeto propõe o desenvolvimento de uma plataforma web voltada à gestão de projetos de arquitetura e relacionamento com clientes. O objetivo é oferecer maior transparência no andamento dos projetos, organização do fluxo comercial e apoio na definição de honorários profissionais.

Arquitetos e pequenos escritórios frequentemente utilizam ferramentas genéricas como planilhas, aplicativos de mensagens e sistemas de armazenamento de arquivos para gerenciar seus projetos. Essa fragmentação dificulta o acompanhamento estruturado das etapas do projeto, a comunicação com clientes e a organização de propostas comerciais.

A proposta deste projeto é criar uma solução integrada que permita:

* acompanhamento visual do progresso de projetos
* gestão de leads e propostas comerciais
* simulação estruturada de honorários
* centralização de arquivos e decisões do projeto

Dessa forma, o sistema busca melhorar a organização do trabalho do arquiteto e oferecer maior transparência para os clientes envolvidos.

---

# Contexto e Problema

No desenvolvimento de projetos de arquitetura, é comum que a comunicação entre arquiteto e cliente ocorra de forma descentralizada, utilizando múltiplas ferramentas como aplicativos de mensagens, e-mail, serviços de armazenamento em nuvem e planilhas.

Esse modelo gera alguns problemas recorrentes.

## Falta de transparência no andamento do projeto

Clientes frequentemente não possuem visibilidade clara sobre:

* em qual etapa o projeto se encontra
* quais entregas já foram realizadas
* quais são os próximos passos

Essa falta de visibilidade pode gerar dúvidas frequentes e a necessidade constante de atualizações por parte do arquiteto.

## Falta de organização comercial

Arquitetos também enfrentam dificuldades no gerenciamento do fluxo de novos clientes, como:

* registro de leads
* acompanhamento de propostas enviadas
* negociação com clientes
* controle de oportunidades de projeto

Em muitos casos, essas informações são mantidas em planilhas ou ferramentas genéricas que não refletem o fluxo específico do trabalho de arquitetura.

## Precificação inconsistente de projetos

Outro desafio recorrente está na definição do valor de projetos arquitetônicos. Arquitetos frequentemente precisam considerar fatores como metragem do projeto, tipo de construção, padrão do imóvel e nível de detalhamento.

Sem uma ferramenta estruturada, esse processo pode gerar precificações inconsistentes ou baseadas apenas em experiência pessoal.

---

# Origem da Demanda e Evidências

A demanda para o desenvolvimento deste projeto surgiu a partir da observação direta do fluxo de trabalho da empresa Duna Arquitetura, um pequeno escritório que atua na elaboração de projetos residenciais, comerciais e de interiores. Durante interações com a arquiteta responsável, foram identificadas dificuldades recorrentes relacionadas à organização das informações, comunicação com clientes e controle do processo comercial.

Além das conversas informais, foi realizada uma análise qualitativa do fluxo atual de trabalho, observando como as informações eram registradas, compartilhadas e atualizadas ao longo do ciclo de vida dos projetos. Essa análise evidenciou que o uso combinado de ferramentas como planilhas, aplicativos de mensagens e serviços de armazenamento em nuvem resulta em fragmentação das informações, ausência de padronização e dificuldade de rastreabilidade das decisões tomadas ao longo dos projetos.

Adicionalmente, foi possível identificar que a falta de integração entre essas ferramentas gera retrabalho, inconsistência de dados e dependência excessiva de comunicação manual, impactando diretamente a produtividade e a qualidade do serviço prestado.

Dessa forma, as evidências coletadas indicam a existência de uma demanda concreta por uma solução que centralize as informações, padronize processos e proporcione maior controle operacional, contribuindo para a melhoria da eficiência e da experiência do cliente.

## Pesquisa com Usuários

Como forma de validar as hipóteses levantadas, foi conduzida uma entrevista exploratória com uma profissional da área, com o objetivo de compreender padrões de comportamento, necessidades e dificuldades enfrentadas no cotidiano da atuação em arquitetura.

Embora a amostra seja reduzida, as dores identificadas apresentam forte aderência a problemas recorrentes observados em profissionais autônomos e pequenos escritórios, o que reforça a relevância e a generalização do problema em contextos semelhantes.

Além disso, problemas semelhantes são frequentemente relatados em comunidades profissionais e fóruns online voltados à arquitetura e design, indicando que essa não é uma situação isolada, mas sim uma dor recorrente no setor.

### Principais dificuldades identificadas

| Usuário   | Profissão                 | Principais Dores                                |
| --------- | ------------------------- | ----------------------------------------------- |
| Arquiteta | Sócia da Duna Arquitetura | Falta de visibilidade do andamento dos projetos |
| Arquiteta | Sócia da Duna Arquitetura | Comunicação descentralizada com clientes        |
| Arquiteta | Sócia da Duna Arquitetura | Dificuldade na organização de propostas         |
| Arquiteta | Sócia da Duna Arquitetura | Ausência de padronização na precificação        |

---

# Análise de Soluções Existentes

Atualmente existem diversas ferramentas voltadas à gestão de tarefas e projetos, porém a maioria delas é de uso genérico e não considera as particularidades do domínio da arquitetura. Como consequência, profissionais da área precisam adaptar essas ferramentas, o que gera perda de eficiência e aumento da complexidade operacional.

## Trello

**Link:** [https://trello.com](https://trello.com)

O Trello é uma ferramenta baseada em quadros Kanban, amplamente utilizada para organização de tarefas e colaboração.

**Pontos fortes:**

* interface simples e intuitiva
* organização visual eficiente
* facilidade de uso

**Limitações:**

* não possui estrutura específica para projetos arquitetônicos
* ausência de funcionalidades comerciais (leads e propostas)
* não contempla precificação de serviços

---

## Notion

**Link:** [https://www.notion.so](https://www.notion.so)

O Notion é uma plataforma altamente flexível que permite a criação de sistemas personalizados.

**Pontos fortes:**

* alta capacidade de customização
* centralização de diferentes tipos de conteúdo
* versatilidade de uso

**Limitações:**

* elevado esforço de configuração inicial
* dependência de modelagem manual por parte do usuário
* ausência de fluxos específicos para arquitetura

---

## Monday

**Link:** [https://monday.com](https://monday.com)

O Monday é uma plataforma robusta de gestão de projetos com foco corporativo.

**Pontos fortes:**

* suporte a automações
* dashboards e relatórios avançados
* gestão estruturada de workflows

**Limitações:**

* custo elevado para pequenos escritórios
* complexidade excessiva para uso individual
* não especializado no domínio da arquitetura

---

## Comparação

| Solução | Especialização | Facilidade de Uso | Aderência ao Problema |
| ------- | -------------- | ----------------- | --------------------- |
| Trello  | Baixa          | Alta              | Baixa                 |
| Notion  | Média          | Média             | Média                 |
| Monday  | Baixa          | Baixa             | Baixa                 |

---

## Análise Crítica

A análise das ferramentas evidencia que, embora sejam eficazes em contextos gerais, nenhuma delas atende de forma completa às necessidades específicas do fluxo de trabalho em arquitetura. A ausência de integração entre gestão de projetos, controle comercial e precificação representa uma lacuna significativa no mercado.

## Diferencial do Projeto

O sistema proposto se diferencia ao oferecer uma solução integrada e especializada, contemplando:

* gestão completa do ciclo de vida dos projetos
* organização do processo comercial
* suporte à precificação estruturada
* centralização de informações e comunicação

Diferentemente das soluções genéricas analisadas, o sistema é concebido desde sua origem considerando o fluxo específico do trabalho em arquitetura. Isso reduz a necessidade de adaptação por parte do usuário, diminui a complexidade operacional e aumenta a eficiência na gestão dos projetos e no relacionamento com clientes.

---

# Público-Alvo

O público-alvo principal do sistema são arquitetos autônomos e pequenos escritórios de arquitetura.

Esses profissionais atuam simultaneamente em múltiplos projetos e necessitam organizar a comunicação com clientes, arquivos de projeto, cronogramas e propostas comerciais de forma eficiente.

De modo geral, possuem conhecimento técnico limitado em ferramentas avançadas de gestão, priorizando soluções simples, intuitivas e de rápida adoção.

Além dos arquitetos, os clientes finais também poderão interagir com o sistema por meio de um portal de acompanhamento, permitindo maior transparência no andamento dos projetos.

---

# Objetivos do Projeto

## Objetivo Geral

Desenvolver uma plataforma web que permita arquitetos gerenciar projetos, acompanhar clientes e estruturar a definição de honorários de forma organizada e transparente.

## Objetivos Específicos

* criar um sistema de acompanhamento de projetos acessível ao cliente
* implementar um pipeline simples de gestão de leads e propostas
* desenvolver um simulador de honorários baseado em parâmetros do projeto
* centralizar arquivos e informações relevantes de cada projeto
* melhorar a comunicação entre arquiteto e cliente

---

# Métricas de Sucesso

O sucesso do sistema será avaliado por meio de indicadores técnicos e funcionais.

* tempo médio de resposta inferior a 500ms
* suporte a pelo menos 50 usuários simultâneos
* centralização das informações de projeto em um único ambiente
* melhoria na organização do fluxo de trabalho