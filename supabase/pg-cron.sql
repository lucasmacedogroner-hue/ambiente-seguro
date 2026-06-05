-- =====================================================
-- Ambiente Seguro — Limpeza automática (pg_cron)
-- =====================================================
-- Execute SOMENTE depois de:
--   1) 00-reset.sql (se estiver recomeçando)
--   2) schema.sql (tabelas criadas)
--
-- Pré-requisito no painel Supabase:
--   Database → Extensions → pg_cron → Enable
-- =====================================================

create extension if not exists pg_cron;

-- Remove job antigo com o mesmo nome (evita duplicar agendamento)
do $$
declare
  r record;
begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    for r in
      select jobid from cron.job where jobname = 'limpar_salas_expiradas'
    loop
      perform cron.unschedule(r.jobid);
    end loop;
  end if;
end $$;

-- Agenda: a cada 30 minutos apaga salas com expires_at no passado
-- CASCADE nas FKs apaga messages e access_requests junto
select cron.schedule(
  'limpar_salas_expiradas',
  '*/30 * * * *',
  $$ delete from public.chat_rooms where expires_at < now(); $$
);

-- Conferir se o job foi criado:
-- select jobid, jobname, schedule, command from cron.job where jobname = 'limpar_salas_expiradas';

-- Para remover no futuro:
-- select cron.unschedule(jobid) from cron.job where jobname = 'limpar_salas_expiradas';
