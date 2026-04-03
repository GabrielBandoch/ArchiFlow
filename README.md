# ArchiFlow — Frontend

Interface web em **Angular 17** para a plataforma de gestão de projetos de arquitetura.  
Projeto de Portfólio — Católica SC · Linha: Web Applications  
Autor: Gabriel Felipe Alves Bandoch

![CI](https://github.com/GabrielBandoch/ArchiFlow/actions/workflows/ci.yml/badge.svg)

---

## Stack

| Camada       | Tecnologia                              |
|--------------|-----------------------------------------|
| Framework    | Angular 17 · Standalone Components      |
| Linguagem    | TypeScript 5.4                          |
| Estilos      | SCSS · Design System próprio            |
| HTTP         | Angular HttpClient · RxJS               |
| Testes       | Karma · Jasmine                         |
| CI           | GitHub Actions                          |

---

## Estrutura do Projeto

```
src/
└── app/
    ├── core/
    │   ├── api/          # Services HTTP por módulo (um arquivo por módulo)
    │   └── pipes/        # Pipes standalone reutilizáveis
    ├── models/           # Interfaces TypeScript espelhando o backend
    ├── commands/         # Interfaces de entrada (POST/PUT/PATCH)
    └── components/
        ├── dashboard/
        ├── projetos/
        ├── leads/
        ├── clientes/
        ├── honorarios/
        └── shared/
            └── modals/
```

### Padrão dos services (`core/api/`)

```typescript
@Injectable({ providedIn: 'root' })
export class ProjetoService extends BaseApiService {

  obterTodos(): Observable<Projeto[]> {
    return this.get<Projeto[]>('projetos');
  }

  criar(command: CriarProjetoCommand): Observable<Projeto> {
    return this.post<Projeto>('projetos', command);
  }
}
```

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
- Backend rodando em `http://localhost:5000`

---

## Como Executar

```bash
npm install
npm start        # dev com proxy → http://localhost:4200
npm run build:prod  # build de produção
```

O proxy redireciona `/api/*` → `http://localhost:5000/api/*` automaticamente.

---

## Testes

```bash
npm test              # modo watch
npm run test:ci       # headless + cobertura (usado no CI)
```

---

## Roadmap de Módulos

| Módulo      | Status     |
|-------------|------------|
| Shell + Sidebar + Routing | 🔜 PR-03 |
| Projetos    | 🔜 PR-03   |
| Leads       | 🔜 PR-06   |
| Clientes    | 🔜 PR-09   |
| Honorários  | 🔜 PR-12   |
| Dashboard   | 🔜 PR-13   |
