# 📋 Fluxos de Teste - Barber Nest API

Este arquivo contém fluxos recomendados de teste cobrindo diferentes cenários.

---

## 1️⃣ FLUXO BÁSICO (Verificação Rápida)

**Objetivo:** Validar que a API está funcionando  
**Tempo:** ~2 minutos  
**Endpoints:** 4

```
GET /clients/stats
        ↓ ✅ Retorna estatísticas
        
GET /products/active
        ↓ ✅ Retorna produtos ativos
        
GET /appointments/today
        ↓ ✅ Retorna agendamentos de hoje
        
GET /schedule/working-hours?date=2026-06-17
        ↓ ✅ Retorna horários de trabalho
```

**Espera por:** Respostas 200 OK

---

## 2️⃣ FLUXO DE SETUP INICIAL (Primeira Vez)

**Objetivo:** Preparar ambiente para testes  
**Tempo:** ~5 minutos  
**Endpoints:** 8

```
┌─────────────────────────────────────────────────┐
│ 1. AUTENTICAÇÃO                                 │
└─────────────────────────────────────────────────┘

  POST /auth/register
  {
    "name": "João Barbeiro",
    "email": "joao@barbearia.com",
    "password": "Senha123!",
    "phone": "+5511987654321"
  }
        ↓ 📝 Salva barberId

  POST /auth/login
  {
    "email": "joao@barbearia.com",
    "password": "Senha123!"
  }
        ↓ 🔐 Salva accessToken


┌─────────────────────────────────────────────────┐
│ 2. PRODUTOS                                     │
└─────────────────────────────────────────────────┘

  POST /products/bulk
  [
    { "name": "Corte", "price": 50, "duration_minutes": 30 },
    { "name": "Barba", "price": 35, "duration_minutes": 30 },
    { "name": "Corte + Barba", "price": 80, "duration_minutes": 60 }
  ]
        ↓ 📝 Salva productId


┌─────────────────────────────────────────────────┐
│ 3. SCHEDULE                                     │
└─────────────────────────────────────────────────┘

  POST /schedule/setup-default
  (sem body)
        ↓ ✅ Configura seg-sex 09:00-19:00, sab 09:00-14:00
```

**Resultado:**
- ✅ 1 barbeiro registrado
- ✅ 3 serviços criados
- ✅ Horários de funcionamento configurados

---

## 3️⃣ FLUXO COMPLETO DE AGENDAMENTO

**Objetivo:** Testar todo fluxo do agendamento  
**Tempo:** ~10 minutos  
**Endpoints:** 14

```
┌─────────────────────────────────────────────────┐
│ 1. VERIFICAR DISPONIBILIDADE                    │
└─────────────────────────────────────────────────┘

  GET /schedule/working-hours?date=2026-06-20
        ↓ Horários de funcionamento

  GET /schedule/available-slots?date=2026-06-20&duration=30
        ↓ 📍 Slots livres


┌─────────────────────────────────────────────────┐
│ 2. PREPARAR CLIENTE                             │
└─────────────────────────────────────────────────┘

  POST /clients/find-or-create
  {
    "name": "João Silva",
    "phone": "+5511999999999"
  }
        ↓ 📝 Retorna/cria clientId


┌─────────────────────────────────────────────────┐
│ 3. CRIAR AGENDAMENTO                            │
└─────────────────────────────────────────────────┘

  POST /appointments
  {
    "client_name": "João Silva",
    "client_phone": "+5511999999999",
    "service_id": 1,
    "appointment_date": "2026-06-20",
    "appointment_time": "10:00",
    "notes": "Teste de agendamento"
  }
        ↓ 📝 Status: pending
        ↓ 📝 Salva appointmentId


┌─────────────────────────────────────────────────┐
│ 4. FLUXO DO AGENDAMENTO                         │
└─────────────────────────────────────────────────┘

  PATCH /appointments/{id}/confirm
        ↓ Status: pending → confirmed

  PATCH /appointments/{id}/complete
        ↓ Status: confirmed → completed

  ✅ Agendamento finalizado!


┌─────────────────────────────────────────────────┐
│ 5. VERIFICAR HISTORICO                          │
└─────────────────────────────────────────────────┘

  GET /clients/{id}/history
        ↓ Mostra agendamento completo

  GET /appointments/stats
        ↓ Estatísticas de agendamentos
```

---

## 4️⃣ FLUXO DE GESTÃO DE CLIENTES

**Objetivo:** CRUD completo de clientes  
**Tempo:** ~8 minutos  
**Endpoints:** 10

```
┌─────────────────────────────────────────────────┐
│ CREATE - Criar cliente                          │
└─────────────────────────────────────────────────┘

  POST /clients
  {
    "name": "Pedro Santos",
    "phone": "+5511988888888",
    "notes": "Cliente VIP",
    "preferences": { "haircut": "degrade" }
  }
        ↓ 📝 Retorna clientId


┌─────────────────────────────────────────────────┐
│ READ - Buscar clientes                          │
└─────────────────────────────────────────────────┘

  GET /clients/{id}
        ↓ Informações completas

  GET /clients/phone/{phone}
        ↓ Busca por telefone

  GET /clients/search?name=pedro
        ↓ Busca por nome


┌─────────────────────────────────────────────────┐
│ ANALYTICS - Dados do cliente                    │
└─────────────────────────────────────────────────┘

  GET /clients/{id}/history
        ↓ Todos os agendamentos

  GET /clients/{id}/upcoming
        ↓ Próximos agendamentos

  GET /clients/{id}/preferences
        ↓ Preferências salvas


┌─────────────────────────────────────────────────┐
│ UPDATE - Atualizar cliente                      │
└─────────────────────────────────────────────────┘

  PUT /clients/{id}
  {
    "name": "Pedro Santos Silva",
    "notes": "Atualizado"
  }
        ↓ ✅ Atualizado

  PUT /clients/{id}/preferences
  { "haircut": "low fade", "beard": "navalha" }
        ↓ ✅ Preferências salvas


┌─────────────────────────────────────────────────┐
│ SPECIAL - Operações especiais                   │
└─────────────────────────────────────────────────┘

  POST /clients/{id}/notes
  { "note": "Cliente chegou cedo hoje" }
        ↓ ✅ Nota adicionada

  GET /clients/top?limit=10
        ↓ Top clientes mais frequentes

  GET /clients/top-spenders?limit=10
        ↓ Clientes que mais gastaram
```

---

## 5️⃣ FLUXO DE GESTÃO DE HORÁRIOS

**Objetivo:** Configurar disponibilidade  
**Tempo:** ~7 minutos  
**Endpoints:** 10

```
┌─────────────────────────────────────────────────┐
│ HORÁRIO PADRÃO                                  │
└─────────────────────────────────────────────────┘

  POST /schedule/setup-default
  (ou)
  POST /schedule/work-schedule
  {
    "day_of_week": 1,  // Segunda
    "is_working": true,
    "start_time": "09:00",
    "end_time": "19:00",
    "slot_duration": 30,
    "lunch_start": "12:00",
    "lunch_end": "13:00"
  }
        ↓ ✅ Horários do dia configurados


┌─────────────────────────────────────────────────┐
│ DATAS BLOQUEADAS (Feriados, Folgas)             │
└─────────────────────────────────────────────────┘

  POST /schedule/blocked-dates
  {
    "blocked_date": "2026-07-07",
    "reason": "Feriado",
    "is_full_day": true
  }
        ↓ 📝 Data inteira bloqueada

  GET /schedule/blocked-dates?startDate=2026-06-01&endDate=2026-06-30
        ↓ Lista de bloqueios


┌─────────────────────────────────────────────────┐
│ HORÁRIO ESPECIAL (Promoções, Eventos)           │
└─────────────────────────────────────────────────┘

  POST /schedule/special-hours
  {
    "special_date": "2026-06-24",
    "description": "Atendimento estendido - Aniversário",
    "start_time": "08:00",
    "end_time": "22:00",
    "slot_duration": 30
  }
        ↓ ✅ Horário especial criado


┌─────────────────────────────────────────────────┐
│ PAUSAS (Almoço, Café)                           │
└─────────────────────────────────────────────────┘

  POST /schedule/breaks
  {
    "break_date": "2026-06-20",
    "start_time": "15:00",
    "end_time": "15:30",
    "reason": "Pausa para café"
  }
        ↓ ✅ Pausa criada

  GET /schedule/breaks/2026-06-20
        ↓ Pausas do dia


┌─────────────────────────────────────────────────┐
│ DISPONIBILIDADE FINAL                           │
└─────────────────────────────────────────────────┘

  GET /schedule/working-hours?date=2026-06-20
        ↓ Horários (após bloqueios e pausas)

  GET /schedule/available-slots?date=2026-06-20&duration=30
        ↓ Slots livres para agendamento (30 min)
```

---

## 6️⃣ FLUXO DE RELATÓRIOS

**Objetivo:** Analisar dados do negócio  
**Tempo:** ~5 minutos  
**Endpoints:** 4

```
┌─────────────────────────────────────────────────┐
│ ESTATÍSTICAS GERAIS                             │
└─────────────────────────────────────────────────┘

  GET /clients/stats
  → Retorna: {
      "total": 45,
      "active": 42,
      "inactive": 3
    }

  GET /products/stats
  → Retorna: {
      "total": 8,
      "active": 8,
      "popular": [...]
    }

  GET /appointments/stats
  → Retorna: {
      "total": 156,
      "pending": 12,
      "confirmed": 8,
      "completed": 135,
      "cancelled": 1
    }


┌─────────────────────────────────────────────────┐
│ TOP CLIENTES                                    │
└─────────────────────────────────────────────────┘

  GET /clients/top?limit=10
  → Clientes com mais agendamentos

  GET /clients/top-spenders?limit=10
  → Clientes que mais gastaram

  GET /clients/recent?days=30
  → Visitaram nos últimos 30 dias

  GET /clients/inactive?days=90
  → Não visitam há 90+ dias


┌─────────────────────────────────────────────────┐
│ PRODUTOS POPULARES                              │
└─────────────────────────────────────────────────┘

  GET /products/popular?limit=5
  → Serviços mais agendados

  GET /products/search?name=corte
  → Busca por nome
```

---

## 7️⃣ FLUXO DE ERRO (Testes de Validação)

**Objetivo:** Verificar tratamento de erros  
**Tempo:** ~5 minutos  
**Endpoints:** Variados

```
┌─────────────────────────────────────────────────┐
│ 400 - BAD REQUEST (Validação falhou)            │
└─────────────────────────────────────────────────┘

  ❌ POST /appointments
  {
    "client_name": "João",
    "client_phone": "11999999999",  // ❌ Sem +55
    "service_id": 1,
    "appointment_date": "20/06/2026",  // ❌ Formato errado
    "appointment_time": "10:00"
  }
  → Espera: 400 Bad Request


┌─────────────────────────────────────────────────┐
│ 404 - NOT FOUND (Recurso não existe)            │
└─────────────────────────────────────────────────┘

  ❌ GET /clients/99999
  → Espera: 404 Not Found


┌─────────────────────────────────────────────────┐
│ 422 - VALIDATION ERROR (Campo inválido)         │
└─────────────────────────────────────────────────┘

  ❌ POST /auth/register
  {
    "name": "João",
    "email": "joao@barbearia.com",
    "password": "123",  // ❌ Muito curta
    "phone": "+5511987654321"
  }
  → Espera: 422 Validation Error


┌─────────────────────────────────────────────────┐
│ 401 - UNAUTHORIZED (Sem autenticação)           │
└─────────────────────────────────────────────────┘

  ❌ GET /auth/profile
  (sem header Authorization)
  → Espera: 401 Unauthorized
```

---

## 🎯 Checklist de Testes

```
□ Setup Inicial
  □ Register Barber
  □ Login Barber
  □ Create 3 Products
  □ Setup Default Schedule

□ Clientes
  □ Create Client
  □ List Clients
  □ Search Client
  □ Update Client
  □ Get Client History

□ Agendamentos
  □ Check Available Slots
  □ Create Appointment
  □ Confirm Appointment
  □ Complete Appointment
  □ Get Appointment Stats

□ Horários
  □ List Work Schedules
  □ Create Special Hours
  □ Block Date
  □ Create Break

□ Relatórios
  □ Client Stats
  □ Product Stats
  □ Appointment Stats
  □ Top Clients

□ Validações de Erro
  □ 400 - Bad Request
  □ 404 - Not Found
  □ 422 - Validation Error
  □ 401 - Unauthorized
```

---

## 💡 Dicas de Teste

1. **Execute em sequência:** Cada fluxo depende do anterior
2. **Tome nota dos IDs:** Você vai precisar depois
3. **Use as variáveis:** Elas são preenchidas automaticamente
4. **Verifique respostas:** Confirme que status e dados estão corretos
5. **Teste erros:** Não esqueça dos casos de erro!

---

**Última atualização:** 17 de junho de 2026
