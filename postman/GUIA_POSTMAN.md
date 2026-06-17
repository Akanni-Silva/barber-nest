# 📚 Barber Nest API - Documentação Postman

> **Coleção Completa de Requisições para Teste da API NestJS**

---

## 📖 Índice

1. [Como Começar](#como-começar)
2. [Estrutura da Coleção](#estrutura-da-coleção)
3. [Autenticação](#autenticação)
4. [Fluxo de Teste Recomendado](#fluxo-de-teste-recomendado)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Endpoints por Módulo](#endpoints-por-módulo)
7. [Dicas de Teste](#dicas-de-teste)

---

## Como Começar

### 1. Importar Coleção no Postman

1. Abra **Postman**
2. Clique em **Import** → **Upload Files**
3. Selecione o arquivo: `barber-app-backend-complete.postman_collection.json`
4. Clique em **Import**

### 2. Configurar Base URL

A coleção vem pré-configurada com `http://localhost:3000`, mas você pode ajustar:

1. Clique no nome da coleção
2. Vá para a aba **Variables**
3. Altere `baseUrl` conforme necessário (ex: `http://localhost:4000`)

### 3. Iniciar Testes

**Sequência recomendada:**

```
1. Register Barber (ou fazer login se já registrado)
2. Create Product
3. Create Client
4. Create Appointment
5. Setup Schedule
6. Test remaining endpoints
```

---

## Estrutura da Coleção

A coleção está organizada em **5 módulos principais**:

```
📦 Barber Nest - Complete API Collection
│
├── 🔐 AUTHENTICATION
│   ├── Register Barber
│   ├── Login Barber
│   ├── Get Profile (Autenticado)
│   └── Change Password
│
├── 👥 CLIENTS
│   ├── Create Client
│   ├── List/Search/Filter Clients
│   ├── Client Analytics (Top, Inactive, Recent)
│   └── Manage Client Data
│
├── 🛒 PRODUCTS/SERVICES
│   ├── Create/Update Products
│   ├── List/Search/Filter Products
│   ├── Product Analytics
│   └── Manage Product Lifecycle
│
├── 📅 APPOINTMENTS
│   ├── Create/Update Appointments
│   ├── Appointment Status Management
│   ├── Appointment Filtering
│   └── Appointment Analytics
│
└── ⏰ SCHEDULE & AVAILABILITY
    ├── Work Schedule Management
    ├── Blocked Dates
    ├── Special Hours
    ├── Break Times
    └── Availability Queries
```

---

## Autenticação

### JWT (JSON Web Token)

A API usa **JWT** com validade de **7 dias**.

### Endpoints Protegidos

Apenas **2 endpoints** requerem autenticação:

- `GET /auth/profile` - Requer JWT + BarberGuard
- `PATCH /auth/change-password` - Requer JWT + BarberGuard

### Como Fazer Login

```bash
# 1. Registrar novo barbeiro
POST /auth/register
Body: {
  "name": "João",
  "email": "joao@barbearia.com",
  "password": "Senha123!",
  "phone": "+5511987654321"
}

# 2. Fazer login
POST /auth/login
Body: {
  "email": "joao@barbearia.com",
  "password": "Senha123!"
}

# ✅ Resposta:
{
  "access_token": "eyJhbGc..."
}
```

### Usando o Token

O token é automaticamente salvo na variável `accessToken`. Para endpoints protegidos, ele é incluído no header:

```
Authorization: Bearer {{accessToken}}
```

---

## Fluxo de Teste Recomendado

### ✅ Teste Completo (Ordem Recomendada)

```
1️⃣ AUTENTICAÇÃO
   └─ Register Barber → Login Barber → Get Profile

2️⃣ SETUP INICIAL
   └─ Create Products (criar 3-4 serviços)
   └─ Setup Default Schedule (horários padrão)

3️⃣ GESTÃO DE CLIENTES
   └─ Create Client (criar 3 clientes)
   └─ Search/Filter Clients
   └─ Update Client Preferences

4️⃣ AGENDAMENTOS
   └─ Create Appointment
   └─ Confirm Appointment
   └─ Get Available Slots
   └─ Reschedule Appointment
   └─ Complete Appointment

5️⃣ RELATÓRIOS
   └─ Client Stats
   └─ Product Stats
   └─ Appointment Stats
   └─ Top Clients / Top Spenders
```

### Teste Mínimo (Verificação Rápida)

Se você quer apenas verificar se a API está funcionando:

```
1. GET /clients/stats
2. GET /products/active
3. GET /appointments/today
4. GET /schedule/working-hours?date=2026-06-17
```

---

## Variáveis de Ambiente

A coleção usa as seguintes variáveis automáticas:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `{{baseUrl}}` | URL base da API | `http://localhost:3000` |
| `{{accessToken}}` | JWT do barbeiro logado | Preenchido automaticamente ao fazer login |
| `{{barberId}}` | ID do barbeiro autenticado | Preenchido ao registrar |
| `{{clientId}}` | ID do último cliente criado | Preenchido ao criar cliente |
| `{{productId}}` | ID do último produto criado | Preenchido ao criar produto |
| `{{appointmentId}}` | ID do último agendamento | Preenchido ao criar agendamento |
| `{{testDate}}` | Data para testes | `2026-06-20` |
| `{{todayDate}}` | Data de hoje | `2026-06-17` |

**Como atualizar variáveis manualmente:**

1. Clique em **Environments** (canto direito)
2. Clique em **Edit** perto de "No Environment"
3. Ajuste os valores conforme necessário

---

## Endpoints por Módulo

### 🔐 AUTHENTICATION (4 endpoints)

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | `/auth/register` | ❌ | Registrar barbeiro |
| POST | `/auth/login` | ❌ | Fazer login → Retorna JWT |
| GET | `/auth/profile` | ✅ | Perfil do barbeiro logado |
| PATCH | `/auth/change-password` | ✅ | Alterar senha |

### 👥 CLIENTS (18 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/clients` | Criar cliente |
| POST | `/clients/find-or-create` | Buscar ou criar |
| GET | `/clients` | Listar paginado |
| GET | `/clients/search` | Buscar por nome |
| GET | `/clients/top` | Clientes mais frequentes |
| GET | `/clients/top-spenders` | Clientes que mais gastaram |
| GET | `/clients/inactive` | Clientes inativos |
| GET | `/clients/recent` | Clientes recentes |
| GET | `/clients/stats` | Estatísticas |
| GET | `/clients/:id` | Buscar por ID |
| GET | `/clients/phone/:phone` | Buscar por telefone |
| GET | `/clients/:id/history` | Histórico completo |
| GET | `/clients/:id/upcoming` | Próximos agendamentos |
| GET | `/clients/:id/past` | Agendamentos passados |
| GET | `/clients/:id/preferences` | Preferências |
| PUT | `/clients/:id` | Atualizar |
| PUT | `/clients/:id/preferences` | Salvar preferências |
| POST | `/clients/:id/notes` | Adicionar nota |
| DELETE | `/clients/:id` | Deletar |

### 🛒 PRODUCTS (15 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/products` | Criar produto |
| POST | `/products/bulk` | Criar múltiplos |
| GET | `/products` | Listar ativos |
| GET | `/products/all` | Listar todos |
| GET | `/products/active` | Apenas ativos |
| GET | `/products/stats` | Estatísticas |
| GET | `/products/popular` | Mais populares |
| GET | `/products/search` | Buscar por nome |
| GET | `/products/price-range` | Por faixa de preço |
| GET | `/products/duration` | Por duração máxima |
| GET | `/products/:id` | Buscar por ID |
| PUT | `/products/:id` | Atualizar |
| PUT | `/products/:id/activate` | Ativar |
| PUT | `/products/:id/deactivate` | Desativar |
| DELETE | `/products/:id` | Deletar |

### 📅 APPOINTMENTS (12 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/appointments` | Criar |
| GET | `/appointments` | Listar com filtros |
| GET | `/appointments/today` | De hoje |
| GET | `/appointments/upcoming` | Próximos |
| GET | `/appointments/stats` | Estatísticas |
| GET | `/appointments/:id` | Buscar por ID |
| GET | `/appointments/client/:id` | Do cliente |
| PATCH | `/appointments/:id/confirm` | Confirmar |
| PATCH | `/appointments/:id/complete` | Completar |
| PATCH | `/appointments/:id/cancel` | Cancelar |
| PUT | `/appointments/:id/reschedule` | Reagendar |
| PUT | `/appointments/:id` | Atualizar |
| DELETE | `/appointments/:id` | Deletar |

### ⏰ SCHEDULE (18 endpoints)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/schedule/setup-default` | Configurar padrão |
| POST | `/schedule/work-schedule` | Criar/atualizar |
| GET | `/schedule/work-schedule` | Listar |
| GET | `/schedule/work-schedule/:day` | Por dia |
| PUT | `/schedule/work-schedule/:id` | Atualizar |
| DELETE | `/schedule/work-schedule/:id` | Deletar |
| POST | `/schedule/blocked-dates` | Bloquear data |
| GET | `/schedule/blocked-dates` | Listar bloqueios |
| DELETE | `/schedule/blocked-dates/:id` | Remover bloqueio |
| POST | `/schedule/special-hours` | Horário especial |
| GET | `/schedule/special-hours` | Listar especiais |
| PUT | `/schedule/special-hours/:id` | Atualizar |
| DELETE | `/schedule/special-hours/:id` | Deletar |
| POST | `/schedule/breaks` | Criar pausa |
| GET | `/schedule/breaks/:date` | Pausas por data |
| DELETE | `/schedule/breaks/:id` | Deletar pausa |
| GET | `/schedule/working-hours` | Horários para data |
| GET | `/schedule/available-slots` | Slots disponíveis |

---

## Dicas de Teste

### 1. **Scripts de Teste Automáticos**

Cada requisição que cria um recurso (Create/Register) possui um **script de teste** que:
- Verifica status HTTP esperado
- Extrai e salva IDs em variáveis automáticamente

Você pode ver os scripts na aba **Tests** de cada requisição.

### 2. **Formato de Data**

Use sempre formato ISO 8601:

```
✅ CORRETO:   2026-06-20
❌ INCORRETO: 20/06/2026 ou 06-20-2026
```

### 3. **Formato de Telefone**

Use formato brasileiro com código país:

```
✅ CORRETO:   +5511999999999
❌ INCORRETO: 11999999999 ou (11) 99999-9999
```

### 4. **Status de Agendamentos**

Valores válidos para `status`:
- `pending` - Pendente (padrão ao criar)
- `confirmed` - Confirmado (após confirmar)
- `completed` - Completo (após finalizar)
- `cancelled` - Cancelado (após cancelar)

### 5. **Dias da Semana**

Use números para dias:

```
0 = Domingo
1 = Segunda-feira
2 = Terça-feira
3 = Quarta-feira
4 = Quinta-feira
5 = Sexta-feira
6 = Sábado
```

### 6. **Testando Rotas Protegidas**

Se receber erro **401 Unauthorized**:

1. Execute **Login Barber** primeiro
2. Verifique se a variável `{{accessToken}}` foi preenchida
3. Confirme que o token não expirou (válido por 7 dias)

### 7. **Salvando Respostas**

Clique em **Save Response** para guardar exemplos:

```
Request → Send → Save Response → Save as Example
```

### 8. **Rodando Coleção Inteira**

Para testar todos os endpoints:

1. Clique em **Run** (canto superior esquerdo)
2. Selecione a coleção
3. Configure delays entre requisições
4. Clique em **Start Test Run**

---

## Resolução de Problemas

### Erro 500 - Internal Server Error

**Causas comuns:**
- Banco de dados não está rodando
- TypeORM sincronização falhou
- Relacionamento entre entidades quebrado

**Solução:**
```bash
# Reinicie o servidor
npm run start:dev
```

### Erro 400 - Bad Request

**Verificar:**
- Formato de data (use ISO: YYYY-MM-DD)
- Formato de telefone (use +55...)
- Campos obrigatórios foram preenchidos?
- Tipos de dados corretos (number vs string)?

### Erro 404 - Not Found

**Verificar:**
- Rota está correta?
- Baseurl está configurado corretamente?
- ID do recurso existe?

### Erro 422 - Validation Error

**Significa:**
- Validações do DTO falharam
- Exemplo: email duplicado, telefone inválido, senha muito curta

---

## Estrutura de Respostas

### Sucesso (2xx)

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@barbearia.com",
  "phone": "+5511999999999",
  "created_at": "2026-06-17T10:30:00Z",
  "updated_at": "2026-06-17T10:30:00Z"
}
```

### Erro (4xx)

```json
{
  "statusCode": 400,
  "message": "Email já cadastrado",
  "error": "Bad Request"
}
```

---

## Próximos Passos

1. ✅ Importe a coleção
2. ✅ Configure baseUrl
3. ✅ Execute "Register Barber"
4. ✅ Teste alguns endpoints
5. ✅ Explore a documentação de cada endpoint (descrição na requisição)

---

## Suporte

Para dúvidas ou problemas:

1. Verifique os erros no terminal
2. Confirme que banco de dados está rodando
3. Verifique formatos de entrada (data, telefone, etc)
4. Leia a descrição de cada endpoint (clique para abrir)

---

**Última atualização:** 17 de junho de 2026  
**Versão da API:** NestJS + TypeORM + MySQL
