# 🔒 Ambiente Seguro — MVP

> **Versão:** MVP v0.1 · **Status:** Em desenvolvimento · **Lançamento alvo:** Q3 2026

Chat efêmero baseado em salas temporárias. Sem cadastro, sem histórico permanente. Crie uma sala, converse, ela desaparece sozinha.

---

## O que é

Plataforma de comunicação anônima e temporária. O usuário cria uma sala de chat que expira automaticamente. Toda mensagem, imagem e participante some junto com a sala.

**Casos de uso:** conversa pontual, combinações rápidas, situações que exigem privacidade sem rastro.

---

## Planos — MVP

### Gratuito (Free)
- 1 sala ativa por vez
- Duração fixa de **6 horas** (não pode ser menos nem mais)
- Skin visual: **apenas WhatsApp**
- Sala aberta ou privada (com código + aprovação)

### Premium — **US$ 5,99 / mês**
- **Múltiplas salas** simultâneas
- Duração escolhida pelo criador: **1 hora a 24 horas**
- **Qualquer skin** disponível (WhatsApp, Slack, Telegram, Discord, Padrão)
- Sala aberta ou privada (com código + aprovação)

### Sistema de Skins
- A skin é **por pessoa**, não por sala
- Cada participante escolhe a própria skin ao entrar
- A escolha fica salva no navegador (localStorage)
- Free só vê a opção WhatsApp; Premium vê todas as opções
- No futuro: novas skins podem ser adicionadas sem mudar a arquitetura

---

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend / API | Next.js 16 + React 19 + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| Banco | Supabase (Postgres) |
| Upload de imagens | Vercel Blob |
| Deploy | Vercel (Edge CDN global) |
| Sessão | UUID anônimo em localStorage |

---

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuito)
- Conta na [Vercel](https://vercel.com) (para deploy)
- [Opcional] Vercel Blob habilitado (para upload de imagens)

---

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com sua URL e anon key do Supabase

# 3. Executar schema no Supabase
# Abra o SQL Editor no Supabase e cole o conteúdo de:
# supabase/schema.sql

# 4. Rodar em dev
npm run dev
# Acesse http://localhost:3000/setup para verificar conexão
```

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sim | Chave anônima do Supabase |
| `BLOB_READ_WRITE_TOKEN` | Opcional | Habilita upload de imagens (Vercel Blob) |

---

## Deploy na Vercel

### 1. Inicializar Git (obrigatório)
```bash
git init
git add .
git commit -m "feat: initial MVP"
```

### 2. Subir para GitHub/GitLab
```bash
git remote add origin https://github.com/seu-usuario/ambiente-seguro.git
git push -u origin main
```

### 3. Conectar na Vercel
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `BLOB_READ_WRITE_TOKEN` (opcional)
4. Clique em **Deploy**

### 4. Ativar limpeza automática de salas (pg_cron)
1. No Supabase → **Database → Extensions** → habilitar `pg_cron`
2. No SQL Editor, execute:
```sql
select cron.schedule(
  'limpar_salas_expiradas',
  '*/30 * * * *',
  $$ delete from public.chat_rooms where expires_at < now(); $$
);
```
> Isso apaga salas expiradas a cada 30 minutos. Mensagens e pedidos de acesso são apagados em cascata.

---

## Banco de dados

Três tabelas simples:

```
chat_rooms       — salas (id, is_private, access_code, expires_at, plan, duration_hours)
messages         — mensagens (room_id FK, sender_name, content, image_url)
access_requests  — fila de aprovação (room_id FK, session_id, user_name, status)
```

Toda sala tem `expires_at`. Ao expirar, a API retorna `410 Gone`. O pg_cron limpa o banco a cada 30 min.

---

## Rotas da aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Home — criar sala ou entrar por link/ID |
| `/room/[id]` | Entrada na sala (nome, código, fila) |
| `/room/[id]/chat` | Chat — mensagens, imagens, timer, skin |
| `/setup` | Diagnóstico de conexão com Supabase |
| `/como-usar.html` | Documentação do produto |
| `/mapa-pendencias.html` | Mapa técnico de pendências |

### API Routes

| Método | Rota | Ação |
|--------|------|------|
| POST | `/api/rooms` | Criar sala |
| GET | `/api/rooms/[id]` | Ler sala / checar expiração |
| POST | `/api/rooms/[id]/join` | Entrar / validar código |
| GET | `/api/messages/[id]` | Listar mensagens |
| POST | `/api/messages/[id]` | Enviar mensagem |
| GET | `/api/access-requests/room/[id]` | Pedidos pendentes |
| GET | `/api/access-requests/[reqId]` | Status do pedido |
| PATCH | `/api/access-requests/[reqId]` | Aprovar / rejeitar |
| POST | `/api/upload` | Upload de imagem (Vercel Blob) |

---

## Segurança — status MVP

| Item | Status | Observação |
|------|--------|-----------|
| Sessão anônima (localStorage UUID) | ✅ Pronto | Identifica criador sem login |
| Código de acesso (sala privada) | ✅ Pronto | 6 caracteres gerado na criação |
| Aprovação manual de participantes | ✅ Pronto | Criador aprova/rejeita |
| Expiração automática das salas | ✅ Pronto | `expires_at`, API retorna 410 |
| RLS Supabase | ⚠️ Permissiva | MVP: `allow_all` — validação no Next.js |
| Rate limiting | ❌ Pendente | Sem limite de criação por IP/sessão |
| Criptografia E2E | ❌ Pós-MVP | Não planejado para o MVP |
| HTTPS | ✅ Vercel | TLS automático no deploy |

> **Nota MVP:** As policies RLS do Supabase estão permissivas (`using (true)`). Toda validação de negócio (sessão, código, expiração) é feita no Next.js. Antes de escalar para produção pública, endurecer as policies para usar JWT do Supabase.

---

## O que falta para o lançamento

Veja o mapa completo em [`/mapa-pendencias.html`](./public/mapa-pendencias.html).

**Bloqueadores imediatos:**
1. [ ] Inicializar repositório Git
2. [ ] Criar projeto no Supabase e executar `schema.sql`
3. [ ] Configurar `.env.local` com credenciais
4. [ ] Ativar `pg_cron` para limpeza automática
5. [ ] Conectar repositório na Vercel e fazer deploy
6. [ ] Implementar verificação de plano (free vs premium) nas APIs
7. [ ] Enforçar skin por plano no `SkinPicker`

**Pós-MVP:**
- Supabase Realtime (substituir polling 3s)
- Rate limiting por IP
- Criptografia E2E
- Mais skins e opções de personalização
- Integração com gateway de pagamento (US$ 5,99/mês)

---

## Arquivos importantes

```
README.md                    ← este arquivo
.env.local.example           ← template de variáveis
supabase/schema.sql          ← schema completo do banco
supabase/README.md           ← instruções do banco
public/como-usar.html        ← documentação do produto
public/mapa-pendencias.html  ← mapa técnico de status
```

---

*Ambiente Seguro é um MVP. A prioridade é lançar rápido, validar uso real e iterar.*
