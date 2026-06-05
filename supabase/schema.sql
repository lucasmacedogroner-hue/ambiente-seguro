-- =====================================================
-- Ambiente Seguro — Schema do Supabase (MVP v0.1)
-- =====================================================
-- Execute este script no SQL Editor do Supabase para
-- criar todas as tabelas, índices e políticas RLS.
-- O script é idempotente — pode ser reexecutado.
-- =====================================================

-- Habilita extensão para gen_random_uuid()
create extension if not exists "pgcrypto";

-- =====================================================
-- Tabela: chat_rooms
-- =====================================================
-- Regras de duração por plano:
--   free    → duration_hours = 6 (fixo, sem escolha)
--   premium → duration_hours = 1 a 24 (escolha do criador)
-- A coluna expires_at é calculada pelo Next.js na criação
-- com base em duration_hours. O pg_cron limpa registros expirados.
-- =====================================================
create table if not exists public.chat_rooms (
  id                    uuid        primary key default gen_random_uuid(),
  is_private            boolean     not null default false,
  access_code           text,
  created_by_session_id text        not null,
  plan                  text        not null default 'free'
                          check (plan in ('free', 'premium')),
  duration_hours        integer     not null default 6
                          check (duration_hours >= 1 and duration_hours <= 24),
  created_at            timestamptz not null default now(),
  expires_at            timestamptz not null default (now() + interval '6 hours')
);

create index if not exists idx_chat_rooms_expires_at
  on public.chat_rooms (expires_at);
create index if not exists idx_chat_rooms_session
  on public.chat_rooms (created_by_session_id);
create index if not exists idx_chat_rooms_plan
  on public.chat_rooms (plan);

-- =====================================================
-- Tabela: messages
-- =====================================================
create table if not exists public.messages (
  id          uuid        primary key default gen_random_uuid(),
  room_id     uuid        not null references public.chat_rooms(id) on delete cascade,
  sender_name text        not null,
  content     text,
  image_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_messages_room_id
  on public.messages (room_id, created_at);

-- =====================================================
-- Tabela: access_requests
-- =====================================================
create table if not exists public.access_requests (
  id         uuid        primary key default gen_random_uuid(),
  room_id    uuid        not null references public.chat_rooms(id) on delete cascade,
  session_id text        not null,
  user_name  text        not null,
  status     text        not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (room_id, session_id)
);

create index if not exists idx_access_requests_room_status
  on public.access_requests (room_id, status);

-- =====================================================
-- Row Level Security
-- =====================================================
alter table public.chat_rooms     enable row level security;
alter table public.messages       enable row level security;
alter table public.access_requests enable row level security;

-- Policies permissivas para o MVP.
-- Toda lógica de negócio é validada no Next.js:
--   - session_id identifica o criador
--   - expires_at bloqueia salas vencidas (retorna 410)
--   - access_code valida entrada em salas privadas
--   - plan/duration_hours são validados na API de criação
-- Antes de produção pública: refine essas policies para
-- validar via JWT do Supabase ou usar service_role no servidor.

drop policy if exists "allow_all_chat_rooms"      on public.chat_rooms;
drop policy if exists "allow_all_messages"         on public.messages;
drop policy if exists "allow_all_access_requests"  on public.access_requests;

create policy "allow_all_chat_rooms" on public.chat_rooms
  for all using (true) with check (true);

create policy "allow_all_messages" on public.messages
  for all using (true) with check (true);

create policy "allow_all_access_requests" on public.access_requests
  for all using (true) with check (true);

-- =====================================================
-- Limpeza automática de salas expiradas (pg_cron)
-- =====================================================
-- PASSO 1: No Supabase → Database → Extensions → habilitar pg_cron
-- PASSO 2: Execute o bloco abaixo no SQL Editor:
--
-- create extension if not exists pg_cron;
--
-- select cron.schedule(
--   'limpar_salas_expiradas',
--   '*/30 * * * *',
--   $$ delete from public.chat_rooms where expires_at < now(); $$
-- );
--
-- O delete em chat_rooms apaga em cascata:
--   → messages (on delete cascade)
--   → access_requests (on delete cascade)
--
-- Verificar jobs ativos:
--   select * from cron.job;
--
-- Remover job:
--   select cron.unschedule('limpar_salas_expiradas');
-- =====================================================
