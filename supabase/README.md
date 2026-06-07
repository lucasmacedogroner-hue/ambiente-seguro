# Supabase — Ambiente Seguro (MVP)

Banco de dados Postgres para o Ambiente Seguro. Três tabelas: `chat_rooms`, `messages`, `access_requests`.

---

## Arquivos SQL (ordem de execução)

| Ordem | Arquivo | Obrigatório | O que faz |
|-------|---------|-------------|-----------|
| 1 | **`00-reset.sql`** | Só se já existe banco antigo | Apaga tabelas, policies e job pg_cron do app — **zera tudo** |
| 2 | **`schema.sql`** | ✅ Sim | Cria tabelas, índices e RLS do MVP |
| 3 | **`pg-cron.sql`** | Recomendado em produção | Agenda limpeza de salas expiradas a cada 30 min |
| 4 | **`storage.sql`** | Para upload de imagens | Cria bucket público `chat-images` (máx. 4MB) |

### Primeira vez (banco vazio)
1. SQL Editor → executar **`schema.sql`**
2. Habilitar extensão **pg_cron** → executar **`pg-cron.sql`**
3. Executar **`storage.sql`** se quiser envio de imagens no chat

### Já rodou SQL antigo no Supabase (recomendado para evitar risco)
1. **`00-reset.sql`** — limpa estrutura e dados antigos
2. **`schema.sql`** — recria tudo com `plan` e `duration_hours`
3. **`pg-cron.sql`** — reativa limpeza automática

> O `schema.sql` sozinho **não** adiciona colunas em tabela já existente sem `plan`/`duration_hours`. Por isso use `00-reset.sql` antes se o projeto já tinha schema antigo (ex.: só 12h fixas).

## Aplicar no painel

1. Acesse [supabase.com](https://supabase.com) → seu projeto → **SQL Editor**
2. Execute os arquivos na ordem da tabela acima (um por vez)
3. O `schema.sql` é idempotente para **criação**; o reset é destrutivo nos dados do app

---

## Tabelas

### `chat_rooms`
Cada sala de chat criada no sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | PK gerado automaticamente |
| `is_private` | boolean | `true` = exige código + aprovação |
| `access_code` | text | Código de 6 chars (salas privadas) |
| `created_by_session_id` | text | UUID do navegador criador |
| `plan` | text | `'free'` ou `'premium'` |
| `duration_hours` | integer | Duração escolhida: 6 (free) ou 1–24 (premium) |
| `created_at` | timestamptz | Criação |
| `expires_at` | timestamptz | Expiração — calculada pelo Next.js na criação |

### `messages`
Mensagens enviadas em cada sala.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | PK |
| `room_id` | uuid | FK → `chat_rooms.id` (cascade delete) |
| `sender_name` | text | Nome digitado pelo participante |
| `content` | text | Texto da mensagem (null se só imagem) |
| `image_url` | text | URL Vercel Blob (null se só texto) |
| `created_at` | timestamptz | Envio |

### `access_requests`
Fila de aprovação para salas privadas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | PK |
| `room_id` | uuid | FK → `chat_rooms.id` (cascade delete) |
| `session_id` | text | UUID do navegador solicitante |
| `user_name` | text | Nome digitado |
| `status` | text | `pending`, `approved` ou `rejected` |
| `created_at` | timestamptz | Solicitação |

---

## Regras de negócio por plano

| Regra | Free | Premium (US$ 5,99/mês) |
|-------|------|------------------------|
| Duração da sala | **6h fixas** | **1h a 24h** (escolha do criador) |
| Número de salas | 1 sala ativa | Múltiplas salas simultâneas |
| Skin visual | Apenas WhatsApp | Qualquer skin |
| Sala privada | Sim | Sim |

> **Skins são por pessoa, não por sala.** Cada participante escolhe sua própria skin ao entrar. A preferência fica no `localStorage` do navegador — não há coluna de skin no banco.

---

## Row Level Security (RLS)

RLS está habilitado nas três tabelas. No MVP as policies são **permissivas** (`using (true)`) — toda validação de negócio (sessão, expiração, código de acesso) é feita no Next.js.

**Antes de escalar para produção pública:** trocar as policies para usar JWT do Supabase ou mover para `service_role` key exclusivamente no servidor.

---

## Limpeza automática de salas expiradas (pg_cron)

O campo `expires_at` marca quando a sala vence. A API Next.js retorna `410 Gone` para salas expiradas, mas os registros continuam no banco até serem deletados.

Para ativar a limpeza automática:

### Passo 1 — Habilitar extensão
No Supabase: **Database → Extensions** → buscar `pg_cron` → **Enable**

### Passo 2 — Criar o job
Execute no **SQL Editor**:
```sql
select cron.schedule(
  'limpar_salas_expiradas',
  '*/30 * * * *',
  $$ delete from public.chat_rooms where expires_at < now(); $$
);
```

Isso apaga salas expiradas a cada 30 minutos. As mensagens e pedidos de acesso são apagados automaticamente em cascata (`on delete cascade`).

### Verificar jobs ativos
```sql
select * from cron.job;
```

### Remover job (se necessário)
```sql
select cron.unschedule('limpar_salas_expiradas');
```

---

## Variáveis necessárias no app

Copie `.env.local.example` para `.env.local` na raiz e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

Para obter: **Supabase → Project Settings → API → Project URL / anon public key**

---

## Testar conexão

Com `.env.local` configurado:
```bash
npm run dev
```
Acesse: [http://localhost:3000/setup](http://localhost:3000/setup) → clicar em **Testar conexão**.

---

## Não há migrations nem seeds

O projeto usa um único arquivo `schema.sql`. Não há sistema de migrations automatizado no MVP.
