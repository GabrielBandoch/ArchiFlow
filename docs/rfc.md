# RFC – Proposta de Projeto  
## Plataforma Web de Gestão de Projetos e Relacionamento com Clientes para Arquitetos

**Autor:** Gabriel Felipe Alves Bandoch  
**Data:** Março de 2026  
**Versão do Documento:** 1.0  

---

## Sumário

1. Linha de Projeto  
2. Visão do Produto e Impacto  
3. Contexto e Problema  
4. Origem da Demanda e Evidências  
5. Pesquisa com Usuários  
6. Análise de Soluções Existentes  
7. Público-Alvo  
8. Objetivos do Projeto  
9. Métricas de Sucesso  

---

## 1. Linha de Projeto

**Web Applications**

---

## 2. Visão do Produto e Impacto

Este projeto propõe o desenvolvimento de uma plataforma web voltada à gestão de projetos de arquitetura e relacionamento com clientes. O objetivo é oferecer maior transparência no andamento dos projetos, organização do fluxo comercial e apoio na definição de honorários profissionais.

Arquitetos e pequenos escritórios frequentemente utilizam ferramentas genéricas como planilhas, aplicativos de mensagens e sistemas de armazenamento de arquivos para gerenciar seus projetos. Essa fragmentação dificulta o acompanhamento estruturado das etapas do projeto, a comunicação com clientes e a organização de propostas comerciais.

A proposta deste projeto é criar uma solução integrada que permita:

- acompanhamento visual do progresso de projetos  
- gestão de leads e propostas comerciais  
- simulação estruturada de honorários  
- centralização de arquivos e decisões do projeto  

Dessa forma, o sistema busca melhorar a organização do trabalho do arquiteto e oferecer maior transparência para os clientes envolvidos.

---

## 3. Contexto e Problema

No desenvolvimento de projetos de arquitetura, é comum que a comunicação entre arquiteto e cliente ocorra de forma descentralizada, utilizando múltiplas ferramentas como aplicativos de mensagens, e-mail, serviços de armazenamento em nuvem e planilhas.

Esse modelo gera alguns problemas recorrentes.

### 3.1 Falta de transparência no andamento do projeto

Clientes frequentemente não possuem visibilidade clara sobre:

- em qual etapa o projeto se encontra  
- quais entregas já foram realizadas  
- quais são os próximos passos  

Essa falta de visibilidade pode gerar dúvidas frequentes e a necessidade constante de atualizações por parte do arquiteto.

---

### 3.2 Falta de organização comercial

Arquitetos também enfrentam dificuldades no gerenciamento do fluxo de novos clientes, como:

- registro de leads  
- acompanhamento de propostas enviadas  
- negociação com clientes  
- controle de oportunidades de projeto  

Em muitos casos, essas informações são mantidas em planilhas ou ferramentas genéricas que não refletem o fluxo específico do trabalho de arquitetura.

---

### 3.3 Precificação inconsistente de projetos

Outro desafio recorrente está na definição do valor de projetos arquitetônicos. Arquitetos frequentemente precisam considerar fatores como metragem do projeto, tipo de construção, padrão do imóvel e nível de detalhamento.

Sem uma ferramenta estruturada, esse processo pode gerar precificações inconsistentes ou baseadas apenas em experiência pessoal.

---

## 4. Origem da Demanda e Evidências

A ideia deste projeto surgiu a partir da observação do fluxo de trabalho da empresa Duna Arquitetura, um pequeno escritório que realiza projetos arquitetônicos e de interiores residenciais, comerciais e corporativos.

Durante conversas informais com a arquiteta responsável pelo escritório, foram identificadas dificuldades relacionadas à organização do andamento dos projetos, comunicação com clientes e controle de propostas comerciais.

Além das conversas, foi realizada uma observação do processo atual utilizado para organização de projetos e troca de informações com clientes.

---

## 5. Pesquisa com Usuários

Para compreender melhor os desafios enfrentados no dia a dia da profissão, foi realizada uma entrevista informal com uma arquiteta responsável pela empresa Duna Arquitetura.

Durante essa análise foram identificados alguns pontos de dificuldade recorrentes relacionados à gestão dos projetos.

### Principais dificuldades identificadas

| Usuário   | Profissão                     | Principais Dores                                 |
|----------|------------------------------|--------------------------------------------------|
| Arquiteta | Sócia da Duna Arquitetura   | Acompanhamento do andamento dos projetos         |
| Arquiteta | Sócia da Duna Arquitetura   | Comunicação fragmentada com clientes             |
| Arquiteta | Sócia da Duna Arquitetura   | Organização de propostas comerciais              |

---

## 6. Análise de Soluções Existentes

Atualmente existem diversas ferramentas que podem ser utilizadas na gestão de projetos ou relacionamento com clientes, porém poucas são desenvolvidas especificamente para o contexto da arquitetura.

### 6.1 Trello

Ferramenta de gestão de tarefas baseada em quadros Kanban.

**Funcionalidades:**

- organização de tarefas  
- criação de listas  
- colaboração em equipe  

**Limitações:**

- não possui estrutura específica para projetos de arquitetura  
- não oferece funcionalidades para simulação de honorários  
- não possui área dedicada ao cliente final  

---

### 6.2 Notion

Plataforma flexível para organização de documentos e tarefas.

---

### 6.3 Monday

Ferramenta de gestão de projetos voltada para equipes.

---

## 7. Público-Alvo

O público-alvo principal do sistema são arquitetos autônomos e pequenos escritórios de arquitetura.

Esses profissionais normalmente trabalham com múltiplos projetos simultaneamente e precisam organizar comunicação com clientes, arquivos de projeto, cronogramas e propostas comerciais.

Além dos arquitetos, os clientes finais também poderão interagir com o sistema ao acessar um portal de acompanhamento do projeto.

---

## 8. Objetivos do Projeto

### 8.1 Objetivo Geral

Desenvolver uma plataforma web que permita arquitetos gerenciar projetos, acompanhar clientes e estruturar a definição de honorários de forma organizada e transparente.

---

### 8.2 Objetivos Específicos

- criar um sistema de acompanhamento de projetos acessível ao cliente  
- implementar um pipeline simples de gestão de leads e propostas  
- desenvolver um simulador de honorários baseado em parâmetros do projeto  
- centralizar arquivos e informações relevantes de cada projeto  
- melhorar a comunicação entre arquiteto e cliente  

---

## 9. Métricas de Sucesso

O sucesso do sistema será avaliado por meio de indicadores técnicos e funcionais.

- tempo médio de resposta inferior a 500ms  
- suporte a pelo menos 50 usuários simultâneos  
- centralização das informações de projeto em um único ambiente  
- melhoria na organização do fluxo de trabalho  