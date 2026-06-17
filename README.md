# Barber Nest API

API backend para uma barbearia construída com NestJS, TypeORM e MySQL.

## Visão Geral

Este projeto fornece endpoints para gerenciamento de:

- Autenticação de barbeiros
- Clientes
- Produtos e serviços
- Agendamentos
- Agenda de trabalho e horários especiais

A aplicação roda por padrão na porta `4000` e utiliza `TypeORM` com MySQL.

## Tecnologias

- NestJS
- TypeScript
- TypeORM
- MySQL
- Passport JWT
- bcrypt
- class-validator / class-transformer

## Requisitos

- Node.js 20+ recomendado
- npm
- MySQL rodando localmente

## Configuração do Banco de Dados

A configuração atual do TypeORM está em `src/app.module.ts`:

- host: `localhost`
- port: `3306`
- username: `root`
- password: `root`
- database: `db_barber`
- synchronize: `true`

> Atualize essas credenciais conforme necessário para o seu ambiente.

## Instalação

```bash
npm install
```

## Execução

```bash
npm run start:dev
```

A API será iniciada em `http://localhost:4000` por padrão.

## Scripts úteis

- `npm run build` - compila o projeto
- `npm run start` - inicia a aplicação em modo padrão
- `npm run start:dev` - inicia em modo de desenvolvimento com watch
- `npm run lint` - executa ESLint e corrige problemas
- `npm run test` - executa testes unitários
- `npm run test:e2e` - executa testes de integração
- `npm run test:cov` - executa cobertura de testes

## Módulos e recursos

### Auth

Endpoints principais:

- `POST /auth/register` - criar barbeiro
- `POST /auth/login` - login e geração de JWT
- `GET /auth/profile` - perfil do barbeiro (autenticado)
- `PATCH /auth/change-password` - alterar senha (autenticado)

### Clients

Rotas para criação, busca, atualização e estatísticas de clientes:

- `POST /clients`
- `POST /clients/find-or-create`
- `GET /clients`
- `GET /clients/search`
- `GET /clients/top`
- `GET /clients/top-spenders`
- `GET /clients/inactive`
- `GET /clients/recent`
- `GET /clients/stats`
- `GET /clients/:id`
- `GET /clients/phone/:phone`
- `GET /clients/:id/history`
- `GET /clients/:id/upcoming`
- `GET /clients/:id/past`
- `GET /clients/:id/preferences`
- `PUT /clients/:id`
- `PUT /clients/:id/preferences`
- `POST /clients/:id/notes`
- `DELETE /clients/:id/deactivate`
- `POST /clients/:id/activate`
- `DELETE /clients/:id`

### Products

Gerencia serviços/produtos da barbearia:

- `POST /products`
- `GET /products`
- `GET /products/active`
- `GET /products/stats`
- `GET /products/popular`
- `GET /products/search`
- `GET /products/price-range`
- `GET /products/:id`
- `PUT /products/:id`
- `PUT /products/:id/activate`
- `PUT /products/:id/deactivate`
- `DELETE /products/:id`

### Appointments

Endpoints para agendamentos e status:

- `POST /appointments`
- `GET /appointments`
- `GET /appointments/today`
- `GET /appointments/upcoming`
- `GET /appointments/stats`
- `GET /appointments/:id`
- `GET /appointments/client/:clientId`
- `PATCH /appointments/:id/confirm`
- `PATCH /appointments/:id/complete`
- `PATCH /appointments/:id/cancel`
- `PUT /appointments/:id/reschedule`
- `PUT /appointments/:id`
- `DELETE /appointments/:id`

### Schedule

Gestão de horários de trabalho, bloqueios e horários especiais:

- `GET /schedule/available-slots`
- `GET /schedule/working-hours`
- `POST /schedule/setup-default`
- `POST /schedule/work-schedule`
- `GET /schedule/work-schedule`
- `GET /schedule/work-schedule/:dayOfWeek`
- `PUT /schedule/work-schedule/:id`
- `DELETE /schedule/work-schedule/:id`
- `POST /schedule/blocked-dates`
- `GET /schedule/blocked-dates`
- `DELETE /schedule/blocked-dates/:id`
- `POST /schedule/special-hours`
- `GET /schedule/special-hours`
- `PUT /schedule/special-hours/:id`
- `DELETE /schedule/special-hours/:id`
- `POST /schedule/breaks`
- `GET /schedule/breaks/:date`
- `DELETE /schedule/breaks/:id`

## Postman

A coleção Postman está disponível em:

- `postman/barber-nest.postman_collection.json`
- `postman/barber-nest-dev-environment.postman_environment.json`

Use esses arquivos para testar a API com os endpoints e variáveis configuradas para `http://localhost:4000`.

## Observações

- A API utiliza `ValidationPipe` global em `src/main.ts`.
- CORS está habilitado por padrão.
- A aplicação inclui entidades para `Appointment`, `Client`, `Product`, `WorkSchedule`, `BlockedDate`, `SpecialHours`, `BreakTime` e `Barber`.

## Ajustes recomendados

- Extraia o `TypeORM` config para variáveis de ambiente para uso em diferentes ambientes.
- Remova `synchronize: true` em produção para evitar alterações automatizadas no esquema do banco.
- Adicione testes automatizados e documentação de contratos se desejar suportar mais clientes.
