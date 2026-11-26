# Documentação Central — COTU (ArchiFlow)

> **Trabalho de Conclusão de Curso (TCC) — Engenharia de Software**  
> **Instituição:** Centro Universitário Católica de Santa Catarina (Joinville/SC)  
> **Linha de Projeto:** Web Applications  
> **Autor:** Gabriel Felipe Alves Bandoch  
> **Escritório Parceiro (Extensão & Validação):** Duna Arquitetura (Joinville/SC) — Sarah Bandoch  
> **Identidade do Produto:** **COTU** *(evolução comercial do nome original **ArchiFlow**)*

---

## Onde Encontrar Cada Documento e Artefato

Esta tabela consolida todos os documentos técnicos, acadêmicos e operacionais espalhados entre os repositórios do projeto para facilitar a avaliação da banca:

| O que você procura | Onde está localizado | Descrição resumida |
| :--- | :--- | :--- |
| **Visão Geral do Frontend & Estrutura de Código** | [`README.md`](../README.md) | Stack Angular 17, mapa completo de diretórios `src/app/`, rotas, guards, testes e CI/CD. |
| **Visão Geral do Backend, Endpoints & Camadas** | [`ArchiFlow.API/README.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/README.md) | Clean Architecture (.NET 8), 17 Controllers REST, SignalR Hub, execução e testes xUnit. |
| **Guia de Acesso & Roteiro para a Banca** | [`docs/GUIA_BANCA_DEMONSTRACAO.md`](GUIA_BANCA_DEMONSTRACAO.md) | URL (`https://tcc.cotu.com.br/`), credenciais de avaliação e roteiro passo a passo por módulo. |
| **O que mudou do RFC para o Sistema Final (+ ADRs)** | [`docs/EVOLUCAO_RFC_VS_ENTREGUE.md`](EVOLUCAO_RFC_VS_ENTREGUE.md) | Comparativo completo RFC v1.0 vs. Entregue, matriz RF/RNF, validação Duna Arquitetura e ADRs 01–09. |
| **Multi-Tenancy, Pagamento e Criação da Base** | [`docs/ARQUITETURA_MULTITENANT_E_PROVISIONAMENTO.md`](ARQUITETURA_MULTITENANT_E_PROVISIONAMENTO.md) | Como funciona a assinatura, DNS/SSL Caddy, criação automática de banco PostgreSQL e seeds. |
| **Modelo de Dados Atual (23 + 1 Tabelas)** | [`docs/MODELO_DE_DADOS.md`](MODELO_DE_DADOS.md) | ERD completo atualizado em Mermaid e justificativa individual de cada nova tabela e alteração. |
| **RFC Original Aprovado (Versão 1.0 — Mar/2026)** | [`docs/rfc.md`](rfc.md) · [`docs/rfc_tcc.pdf`](rfc_tcc.pdf) | Proposta inicial assinada pela banca examinadora (referência histórica preservada). |
| **Diagramas Originais do RFC** | [`docs/Diagramas/`](Diagramas/) | Diagramas C4 v1, ERD v1, Casos de Uso e Fluxos produzidos na fase de proposta. |
| **Mockups Originais do Figma** | [`docs/Mockup/`](Mockup/) | Telas de alta fidelidade validadas inicialmente com a Duna Arquitetura. |
| **Wiki Técnica do Backend** | [`ArchiFlow.API/wiki/`](https://github.com/GabrielBandoch/ArchiFlow.API/tree/main/wiki) | Arquitetura limpa, C4 atualizado, Multi-Tenancy, DER técnico, ADRs de backend e evolução Cloud. |
| **Infraestrutura Docker, Caddy & Deploy VPS** | [`ArchiFlow.API/deploy/README.md`](https://github.com/GabrielBandoch/ArchiFlow.API/blob/main/deploy/README.md) | Docker Compose de produção, `Caddyfile` e script de deploy. |
| **Infraestrutura AWS CDK (IaC)** | [`ArchiFlow.API/infra/`](https://github.com/GabrielBandoch/ArchiFlow.API/tree/main/infra) | Stack IaC em C# para evolução Enterprise na AWS (App Runner / ECS / RDS / S3 / CloudFront). |

---

## Roteiro Sugerido de Leitura Rápida para a Banca (5 Passos)

1. **Entender o salto do projeto (RFC → Produto Real):** leia [`EVOLUCAO_RFC_VS_ENTREGUE.md`](EVOLUCAO_RFC_VS_ENTREGUE.md). Ele mostra em poucos minutos quais módulos previstos para Pós-TCC foram antecipados, o que foi adicionado por feedback real da Duna Arquitetura, por que o Simulador de Honorários foi consolidado para foco operacional e as **9 Decisões Arquiteturais (ADRs)**.
2. **Entender como um novo escritório ganha sua própria base de dados:** leia [`ARQUITETURA_MULTITENANT_E_PROVISIONAMENTO.md`](ARQUITETURA_MULTITENANT_E_PROVISIONAMENTO.md). Explica o fluxo desde o plano/pagamento até o Caddy TLS e o provisionamento automático `cotu_<subdominio>` no PostgreSQL.
3. **Ver todas as novas tabelas e por que foram criadas:** leia [`MODELO_DE_DADOS.md`](MODELO_DE_DADOS.md). Compara as **9 tabelas do RFC** com as **23 tabelas por tenant + `Tenants_Assinaturas` no banco master** atuais.
4. **Conferir a engenharia do backend e deploy:** acesse a [Wiki do Backend](https://github.com/GabrielBandoch/ArchiFlow.API/tree/main/wiki).
5. **Testar a aplicação ao vivo:** siga [`GUIA_BANCA_DEMONSTRACAO.md`](GUIA_BANCA_DEMONSTRACAO.md) em **`https://tcc.cotu.com.br/`**.

---

## Visão Geral do Ecossistema de Aplicações

O produto evoluiu de dois repositórios acadêmicos (`ArchiFlow` e `ArchiFlow.API`) para um **ecossistema SaaS multi-tenant** composto por:

| Aplicação | Repositório | Domínio em Produção | Papel no Ecossistema |
| :--- | :--- | :--- | :--- |
| **Workspace Web (SPA)** | `GabrielBandoch/ArchiFlow` *(público)* | `https://<tenant>.cotu.com.br/` | Interface do escritório de arquitetura + Portal do Cliente. |
| **API REST & SignalR** | `GabrielBandoch/ArchiFlow.API` *(público)* | `https://api.cotu.com.br/` | Backend .NET 8 multi-tenant (1 banco PostgreSQL por cliente). |
| **Landing Page Comercial** | `GabrielBandoch/ArchiFlow.Landing` *(privado)* | `https://cotu.com.br/` | Apresentação institucional, comparativo, planos (`Starter`/`Professional`/`Enterprise`) e captação de novos escritórios. |
