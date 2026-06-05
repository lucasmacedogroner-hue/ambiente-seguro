-- =====================================================
-- Ambiente Seguro — RESET do banco (MVP)
-- =====================================================
-- ATENÇÃO: apaga TODOS os dados das tabelas do app:
--   chat_rooms, messages, access_requests
-- Também remove policies RLS e o job pg_cron (se existir).
--
-- Use quando:
--   - Quiser recomeçar do zero sem lixo do schema antigo
--   - Tiver rodado um schema.sql antigo (ex.: 12h fixas, sem plan)
--   - Quiser evitar conflito de colunas ou estrutura diferente
--
-- ORDEM RECOMENDADA no SQL Editor:
--   1) Este arquivo (00-reset.sql)
--   2) schema.sql
--   3) pg-cron.sql (opcional, após habilitar extensão pg_cron)
-- =====================================================

-- -----------------------------------------------------
-- 1) Remover job de limpeza automática (se pg_cron ativo)
-- -----------------------------------------------------
do $$
declare
  r record;
begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    for r in
      select jobid, jobname
      from cron.job
      where jobname = 'limpar_salas_expiradas'
    loop
      perform cron.unschedule(r.jobid);
      raise notice 'Job removido: % (id %)', r.jobname, r.jobid;
    end loop;
  end if;
exception
  when others then
    raise notice 'pg_cron: nada a remover ou extensão indisponível (ok).';
end $$;

-- -----------------------------------------------------
-- 2) Remover policies RLS (antes de dropar tabelas)
-- -----------------------------------------------------
drop policy if exists "allow_all_chat_rooms"     on public.chat_rooms;
drop policy if exists "allow_all_messages"        on public.messages;
drop policy if exists "allow_all_access_requests" on public.access_requests;

-- Nomes alternativos (caso tenha criado policies com outros nomes no passado)
drop policy if exists "allow_all" on public.chat_rooms;
drop policy if exists "allow_all" on public.messages;
drop policy if exists "allow_all" on public.access_requests;

-- -----------------------------------------------------
-- 3) Apagar tabelas do app (CASCADE = filhos e FKs)
-- -----------------------------------------------------
-- Ordem: filhas primeiro, depois chat_rooms (seguro em qualquer PG)
drop table if exists public.access_requests cascade;
drop table if exists public.messages cascade;
drop table if exists public.chat_rooms cascade;

-- -----------------------------------------------------
-- 4) Conferência — deve retornar 0 linhas para cada
-- -----------------------------------------------------
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('chat_rooms', 'messages', 'access_requests');

-- Se a query acima não retornar nenhuma linha, o reset foi concluído.
-- Próximo passo: executar schema.sql
