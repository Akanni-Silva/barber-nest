# 🧔 Coleção Postman - Barber Nest API

## ⚡ Quick Start

### Arquivos Inclusos
```
postman/
├── barber-app-backend-complete.postman_collection.json  ← COLEÇÃO PRINCIPAL
├── barber-nest-dev-environment.postman_environment.json ← AMBIENTE PRÉ-CONFIGURADO
├── GUIA_POSTMAN.md                                       ← DOCUMENTAÇÃO COMPLETA
└── barber-app-backend.postman_collection.json           ← Coleção anterior (backup)
```

---

## 🚀 Como Usar (3 Passos)

### 1. Abra o Postman

```bash
# Se não tiver Postman instalado:
# Faça download em: https://www.postman.com/downloads/
```

### 2. Importe os Arquivos

**Coleção:**
- Clique em **Import** → **Upload Files**
- Selecione: `barber-app-backend-complete.postman_collection.json`

**Ambiente (Opcional mas Recomendado):**
- Clique em **Import** → **Upload Files**  
- Selecione: `barber-nest-dev-environment.postman_environment.json`
- Clique em **Environments** (canto direito) → selecione "Barber Nest - Development"

### 3. Comece os Testes! 

**Fluxo Recomendado:**

```
1. 🔐 Register Barber (Autenticação)
   └─ Preencha email, password, phone
   
2. 📝 Create Product (Crie alguns serviços)
   └─ Exemplo: Corte Masculino, Barba, etc
   
3. 👤 Create Client (Crie alguns clientes)
   └─ Nome, telefone, preferências
   
4. 📅 Setup Default Schedule
   └─ Configura horários padrão
   
5. 📌 Create Appointment
   └─ Agora sim, faça um agendamento!
   
6. 📊 Explore os outros endpoints
   └─ Stats, filtros, análises, etc
```

---

## 📋 O Que Está Incluído

### ✅ 5 Módulos Completos

| Módulo | Endpoints | Descrição |
|--------|-----------|-----------|
| 🔐 **Auth** | 4 | Register, Login, Profile, Change Password |
| 👥 **Clients** | 18 | CRUD + Analytics (Top, Inactive, Recent) |
| 🛒 **Products** | 15 | CRUD + Filtros (Preço, Duração, Popular) |
| 📅 **Appointments** | 13 | CRUD + Status Management + Reschedule |
| ⏰ **Schedule** | 18 | Horários, Bloqueios, Pausas, Slots Disponíveis |

**Total: 68 endpoints mapeados e testáveis**

---

## 🔑 Variáveis Automáticas

A coleção já vem com variáveis que são **preenchidas automaticamente**:

| Variável | Preenchida por... | Exemplo |
|----------|-------------------|---------|
| `{{baseUrl}}` | Manual | http://localhost:3000 |
| `{{accessToken}}` | Login Barber | eyJhbGc... |
| `{{barberId}}` | Register/Login | 1 |
| `{{clientId}}` | Create Client | 1 |
| `{{productId}}` | Create Product | 1 |
| `{{appointmentId}}` | Create Appointment | 1 |
| `{{testDate}}` | Manual | 2026-06-20 |

---

## 💡 Dicas Importantes

### ✅ Formatos de Entrada

**Telefone (sempre com código de país):**
```json
"phone": "+5511999999999"  // ✅ Correto
"phone": "11999999999"     // ❌ Errado
```

**Data (sempre ISO 8601):**
```json
"appointment_date": "2026-06-20"  // ✅ Correto
"appointment_date": "20/06/2026"  // ❌ Errado
```

**Hora (formato HH:mm):**
```json
"appointment_time": "14:30"  // ✅ Correto
"appointment_time": "2:30 PM" // ❌ Errado
```

### 🔐 Autenticação

Apenas **2 endpoints** precisam de JWT:
- `GET /auth/profile`
- `PATCH /auth/change-password`

O token é automaticamente incluído quando você fazer login via **Login Barber**.

### 🔄 Scripts Automáticos

Cada requisição que cria recursos possui scripts que:
- Verificam se a requisição foi bem-sucedida
- Extraem e salvam IDs em variáveis automaticamente
- Você pode ver clicando na aba **Tests**

---

## 🛠️ Personalizações

### Mudar Base URL

Se a API está em outro servidor/porta:

**Opção 1 (Rápida):**
- Abra qualquer requisição
- Mude `http://localhost:3000` para seu URL
- Use `Ctrl+H` para encontrar e substituir em todas as requisições

**Opção 2 (Recomendado):**
- Clique em **Variables** (aba superior)
- Altere o valor de `baseUrl`
- Aplicará a todas as requisições automaticamente

### Criar Novo Ambiente

Para testar em diferentes ambientes (dev, staging, prod):

1. Clique em **Environments** (canto direito)
2. Clique em **+** para criar novo
3. Nomeie (ex: "Production")
4. Copie os valores do ambiente "Barber Nest - Development"
5. Selecione o novo ambiente antes de testar

---

## 📊 Estrutura de Resposta

### Sucesso (2xx - 3xx)

```json
{
  "id": 1,
  "name": "João",
  "created_at": "2026-06-17T10:30:00Z"
}
```

### Erro (4xx - 5xx)

```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "error": "Bad Request"
}
```

---

## ⚠️ Possíveis Erros

| Erro | Causa | Solução |
|------|-------|---------|
| **404 Not Found** | Rota/ID inválido | Verifique URL e baseUrl |
| **400 Bad Request** | Validação falhou | Verifique formatos (data, telefone, etc) |
| **401 Unauthorized** | Token expirado/ausente | Faça login novamente |
| **422 Unprocessable** | Email duplicado, senha fraca | Verifique valores |
| **500 Internal Error** | Erro no servidor | Reinicie `npm run start:dev` |

---

## 📚 Para Saber Mais

Veja o arquivo **GUIA_POSTMAN.md** para:

- ✅ Documentação detalhada de cada endpoint
- ✅ Fluxo de teste recomendado
- ✅ Explicações de campos e parâmetros
- ✅ Resolução de problemas avançada
- ✅ Exemplos de requisições/respostas

---

## 🎯 Próximas Etapas

Depois de testar tudo:

1. **Integrar com Front-end:** Use os endpoints como referência
2. **CI/CD:** Exporte coleção Postman para testes automatizados
3. **Documentação OpenAPI:** Gere Swagger a partir dos endpoints
4. **Testes de Performance:** Use Postman para load testing

---

## 📞 Precisa de Ajuda?

1. Leia **GUIA_POSTMAN.md** (documentação completa)
2. Verifique as **Descrições** em cada endpoint (abra a requisição)
3. Confirme que o servidor está rodando: `npm run start:dev`
4. Verifique o banco de dados: `mysql -u root -p`

---

**Versão:** 1.0  
**Data:** 17 de junho de 2026  
**API:** NestJS + TypeORM + MySQL  
**Total de Endpoints:** 68 (todos testáveis)

Bom teste! 🚀
