# Integração do Frontend com a API Agendei

Este documento é a referência completa para a integração entre o frontend ([`agendei-frontend`](file:///home/vitor/Projetos/agendei-frontend)) e o backend ([`agendei-backend`](file:///home/vitor/Projetos/agendei-backend)). Ele consolida os contratos da API, especificações de endpoints, formatos de dados, regras de negócio e o plano arquitetural de implementação de cada componente e tela do cliente web.

---

## 1. Arquitetura e Transporte

```mermaid
flowchart TD
    subgraph Frontend ["agendei-frontend (React 19 + Vite)"]
        AuthClient["Better Auth React Client\n(src/lib/auth.ts)"]
        ApiClient["Cliente HTTP Centralizado\n(src/lib/api.ts)"]
        DateUtils["Utilitários de Data/Fuso\n(src/lib/date-utils.ts)"]
        ProtectedRoute["Guarda de Rotas\n(src/components/ProtectedRoute.tsx)"]
        
        subgraph Modulos ["Telas e Módulos"]
            LoginReg["Login & Cadastro (Zod min 8)"]
            ScheduleView["Agendas & Nova Agenda (/agenda, /nova-agenda)"]
            ServicesView["Gestão de Serviços (/servicos)"]
            ClientsView["Gestão de Clientes & Reservas (/clientes)"]
            BookingView["Fluxo de Agendamento (/agendar)"]
            ProfileView["Perfil & Integração OpenCNPJ (/profile)"]
        end
    end

    subgraph Backend ["agendei-backend (Porta 3333)"]
        AuthRoutes["/api/auth/* (Better Auth)"]
        ScheduleRoutes["/schedules (CRUD)"]
        ServiceRoutes["/services (CRUD + Paginação)"]
        AppointmentRoutes["/appointments (CRUD + Status + Filtros)"]
    end

    AuthClient <-->|Cookies de Sessão| AuthRoutes
    ApiClient <-->|Fetch (credentials: include)| ScheduleRoutes
    ApiClient <-->|Fetch (credentials: include)| ServiceRoutes
    ApiClient <-->|Fetch (credentials: include)| AppointmentRoutes
    ApiClient --> Modulos
    DateUtils --> Modulos
    ProtectedRoute --> Modulos
```

### Configurações de Rede e Segurança
- **Variável de Ambiente:** Configure `VITE_BACKEND_URL` no `.env` do frontend apontando para a base da API (exemplo: `http://localhost:3333`), sem adicionar sufixos de rota.
- **Sessão e Cookies:** Todas as rotas de negócio exigem sessão ativa do Better Auth. O transporte de cookies de sessão ocorre via `credentials: "include"` em requisições `fetch` e no cliente oficial do Better Auth (`better-auth/react`).
- **CORS:** O backend aceita requisições exclusivamente da origem configurada em `FRONTEND_URL`, com cabeçalho `Access-Control-Allow-Credentials: true`.
- **Headers:** Requisições com corpo JSON devem enviar `Content-Type: application/json`.
- **Identificadores:** IDs de recursos são **UUID versão 7** gerados no servidor. O cliente nunca deve gerar IDs nem enviar `userId` no payload das rotas de negócio (o proprietário é inferido da sessão).
- **Envelopes:** Sucessos retornam envelopados (`{ schedule }`, `{ service }`, `{ appointment }`, `{ schedules }`, `{ services, pagination }`, `{ appointments, pagination }`). Exclusões retornam status `204 No Content` sem corpo.

---

## 2. Tipos de Dados e Modelos TypeScript

### Agenda de Funcionamento (`Schedule`)
```ts
export interface Schedule {
  id: string                 // UUID v7
  userId: string             // UUID v7
  weekDay: number            // 0 = Domingo, 1 = Segunda ... 6 = Sábado
  startTime: string          // Formato "HH:mm" (ex: "09:00")
  endTime: string            // Formato "HH:mm" (ex: "18:00")
  createdAt: string          // ISO 8601
  updatedAt: string          // ISO 8601
}

export type CreateScheduleInput = {
  weekDay: number
  startTime: string
  endTime: string
}

export type UpdateScheduleInput = Partial<CreateScheduleInput>
```
*Regras:* No máximo uma agenda por dia da semana (`0` a `6`). `endTime > startTime` no mesmo dia. Não aceita expediente atravessando a meia-noite. Horários são avaliados no fuso configurado da API (`America/Sao_Paulo`).

### Serviço (`Service`)
```ts
export interface Service {
  id: string                 // UUID v7
  userId: string             // UUID v7
  name: string               // 1 a 100 caracteres
  description: string | null // Opcional ou null
  durationInMinutes: number  // Inteiro entre 5 e 1440
  price: number | null       // >= 0 com até 2 casas decimais ou null
  createdAt: string
  updatedAt: string
}

export type CreateServiceInput = {
  name: string
  description?: string | null
  durationInMinutes: number
  price?: number | null
}

export type UpdateServiceInput = Partial<CreateServiceInput>
```
*Regras:* Na criação, `description` e `price` podem ser omitidos (ficam `null`). Na edição (`PUT`), omitir preserva o valor atual; enviar `null` remove a descrição/preço. Serviços com agendamentos vinculados não podem ser excluídos (`409`).

### Agendamento (`Appointment`)
```ts
export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"

export interface Appointment {
  id: string                 // UUID v7
  userId: string             // UUID v7
  serviceId: string          // UUID v7
  customerName: string       // 1 a 150 caracteres
  customerPhone: string      // Telefone brasileiro normalizado
  startAt: string            // ISO 8601 com offset e minutos zerados
  endAt: string              // ISO 8601 calculado pelo backend
  status: AppointmentStatus
  notes: string | null       // Máximo 2000 caracteres
  createdAt: string
  updatedAt: string
}

export interface AppointmentWithService extends Appointment {
  service: Pick<Service, "id" | "name" | "description" | "durationInMinutes" | "price">
}

export type CreateAppointmentInput = {
  serviceId: string
  customerName: string
  customerPhone: string
  startAt: string            // Ex: "2026-10-06T14:30:00-03:00"
  notes?: string | null
}

export type UpdateAppointmentInput = Partial<CreateAppointmentInput>
```
*Regras:* `startAt` deve ser um instante futuro com precisão de minutos (segundos/frações zerados). O intervalo precisa caber inteiramente no expediente do dia da semana configurado para a empresa. Não pode haver sobreposição com reservas existentes ativas (`409`).

### Paginação e Envelope de Erro
```ts
export interface Pagination {
  page: number
  pageSize: number
  hasNext: boolean
}

export interface PaginatedServicesResponse {
  services: Service[]
  pagination: Pagination
}

export interface PaginatedAppointmentsResponse {
  appointments: AppointmentWithService[]
  pagination: Pagination
}

export interface ApiErrorResponse {
  message: string
}
```

---

## 3. Matriz de Endpoints da API

### Autenticação (`/api/auth/*`)
- Utiliza a biblioteca **Better Auth**.
- Cadastro: `auth.signUp.email({ name, email, password, cnpj })`. O backend exige senha com no mínimo 8 caracteres e valida o CNPJ.
- Login: `auth.signIn.email({ email, password, rememberMe })`.
- Sessão: `auth.useSession()` em React.
- Logout: `auth.signOut()`.

### Agendas (`/schedules`)
| Método e Rota | Descrição | Corpo / Parâmetros | Resposta de Sucesso |
|---|---|---|---|
| `GET /schedules` | Listar todas as agendas da conta | — | `200 { schedules: Schedule[] }` |
| `POST /schedules` | Cadastrar agenda de um dia | `{ weekDay, startTime, endTime }` | `201 { schedule: Schedule }` |
| `GET /schedules/:scheduleId` | Buscar agenda específica | `scheduleId` (UUID v7) | `200 { schedule: Schedule }` |
| `PUT /schedules/:scheduleId` | Atualizar agenda | Objeto parcial `{ weekDay?, startTime?, endTime? }` | `200 { schedule: Schedule }` |
| `DELETE /schedules/:scheduleId` | Remover agenda | `scheduleId` (UUID v7) | `204 No Content` |

### Serviços (`/services`)
| Método e Rota | Descrição | Query / Corpo | Resposta de Sucesso |
|---|---|---|---|
| `GET /services` | Listar serviços paginados | `?page=1&pageSize=20` | `200 { services, pagination }` |
| `POST /services` | Criar novo serviço | `{ name, description?, durationInMinutes, price? }` | `201 { service: Service }` |
| `GET /services/:serviceId` | Buscar serviço específico | `serviceId` (UUID v7) | `200 { service: Service }` |
| `PUT /services/:serviceId` | Editar serviço | Objeto parcial dos campos | `200 { service: Service }` |
| `DELETE /services/:serviceId` | Excluir serviço | `serviceId` (UUID v7) | `204 No Content` |

### Agendamentos (`/appointments`)
| Método e Rota | Descrição | Query / Corpo | Resposta de Sucesso |
|---|---|---|---|
| `GET /appointments` | Listar reservas com filtros | `?page=1&pageSize=20&from=...&to=...` | `200 { appointments, pagination }` |
| `POST /appointments` | Criar agendamento | `{ serviceId, customerName, customerPhone, startAt, notes? }` | `201 { appointment: Appointment }` |
| `PUT /appointments/:appointmentId` | Editar agendamento | Objeto parcial dos campos | `200 { appointment: Appointment }` |
| `PATCH /appointments/:appointmentId/status` | Atualizar status da reserva | `{ status: AppointmentStatus }` | `200 { appointment: Appointment }` |
| `DELETE /appointments/:appointmentId` | Excluir reserva | `appointmentId` (UUID v7) | `204 No Content` |

*Transições Válidas de Status:*
- `scheduled` ➔ `confirmed`, `cancelled`, `no_show`
- `confirmed` ➔ `completed`, `cancelled`, `no_show`
- `completed`, `cancelled`, `no_show` são estados finais (não permitem reabertura ou reagendamento).

---

## 4. Plano de Implementação no Frontend

### 4.1. Camada de Comunicação HTTP e Tipagem
1. **`src/types/api.ts`**:
   - Definição estrita das interfaces de dados e payloads.
2. **`src/lib/api.ts`**:
   - Criação de wrapper `apiFetch<T>(path, init)` que injeta credenciais, serializa JSON, analisa envelopes e padroniza o tratamento de erros HTTP (401, 404, 409, 422, 500) convertendo-os em exceções com mensagem legível.
   - Exportação dos módulos `schedulesApi`, `servicesApi` e `appointmentsApi`.
3. **`src/lib/date-utils.ts`**:
   - Formatadores de data e hora para o padrão do backend (ISO com offset `America/Sao_Paulo`).
   - Geradores de slots de atendimento baseados na duração do serviço e expediente.

### 4.2. Autenticação e Guarda de Rotas
1. **`src/pages/Login.tsx` & `src/pages/Register.tsx`**:
   - Atualizar schemas Zod para exigir `password.min(8)` e `confirm_password.min(8)`.
   - Limpeza e máscara do CNPJ antes do envio no cadastro.
   - Mensagens de feedback inline com tratamento de conflito (CNPJ duplicado).
2. **`src/components/ProtectedRoute.tsx`**:
   - Guarda de rota protegida que valida `auth.useSession()`, exibe estado de loading e redireciona não autenticados para `/login`.
3. **`src/routes/Routes.tsx`**:
   - Proteger rotas privadas (`/home`, `/agenda`, `/nova-agenda`, `/servicos`, `/clientes`, `/profile`).
   - Adicionar rota `/servicos`.

### 4.3. Telas de Agendas (`/agenda` e `/nova-agenda`)
1. **`src/pages/Schedule.tsx`**:
   - Carregar expedientes cadastrados via `schedulesApi.list()`.
   - Carregar agendamentos do dia selecionado via `appointmentsApi.list({ from, to })`.
   - Exibir lista interativa com horários, cliente, serviço e badge de status.
2. **`src/pages/NewSchedule.tsx`**:
   - **Passo 2:** Configuração dos horários `startTime` e `endTime` (`HH:mm`) para cada dia da semana selecionado com envio via `schedulesApi.create()`.
   - **Passo 3:** Listagem e seleção de serviços cadastrados dinamicamente.
   - **Passo 4:** Resumo da configuração e salvamento com validação de conflitos.

### 4.4. Gestão de Serviços (`/servicos`)
1. **`src/pages/Services.tsx`**:
   - Listagem paginada dos serviços da conta com tabela e cartões informativos.
   - Formulário/Modal para criar (`POST /services`) e editar (`PUT /services/:id`).
   - Ação de exclusão (`DELETE /services/:id`) com confirmação e tratamento do erro 409 caso haja agendamentos associados.
2. **`src/components/Sidebar.tsx`**:
   - Adicionar item de menu "Serviços" com navegação ativa.

### 4.5. Gestão de Clientes e Reservas (`/clientes`)
1. **`src/pages/Clients.tsx`**:
   - Carregar listagem paginada de agendamentos (`appointmentsApi.list()`).
   - Filtro de busca por nome/telefone e filtro por status (`Todos`, `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`).
   - Filtro por período de datas (`from` e `to`).
   - Ações diretas na tabela para alterar status via `appointmentsApi.updateStatus()`.
   - Cálculo dinâmico dos cartões de estatísticas (total de clientes únicos, agendamentos hoje, confirmados e pendentes).

### 4.6. Fluxo de Agendamento (`/agendar` - Booking)
1. **`src/pages/Booking.tsx`**:
   - Obter serviços disponíveis da empresa (`servicesApi.list()`).
   - Obter expediente de funcionamento (`schedulesApi.list()`) e bloquear dias indisponíveis no calendário.
   - Calcular horários vagos descontando agendamentos já existentes no dia.
   - Submeter o formulário de reserva via `appointmentsApi.create()`.
   - Exibir tela de confirmação com dados reais gerados.

### 4.7. Perfil (`/profile`)
1. **`src/pages/Profile.tsx`**:
   - Exibir dados do usuário autenticado via `auth.useSession()`.
   - Consulta aos dados cadastrais da empresa na API OpenCNPJ via CNPJ da sessão com tratamento de erros.

---

## 5. Roteiro de Verificação e Validação

### Testes Automatizados e Build
```bash
# Executar a partir do diretório agendei-frontend
pnpm lint
pnpm format
pnpm build
```

### Roteiro de Teste Manual
1. **Cadastro e Login:** Cadastrar conta informando senha >= 8 caracteres e CNPJ válido; efetuar login e conferir sessão persistida.
2. **Configuração de Expediente:** Criar expediente de segunda a sexta (08:00 às 18:00) na tela `/nova-agenda` e verificar sincronização em `/agenda`.
3. **Serviços:** Criar serviços na tela `/servicos`, editar duração/preço e testar exclusão.
4. **Agendamento:** Realizar agendamento na tela `/agendar` e verificar se a reserva aparece em `/agenda` e `/clientes`.
5. **Transições de Status:** Alterar status de uma reserva para `confirmed` e `completed` em `/clientes` e verificar atualização visual.
