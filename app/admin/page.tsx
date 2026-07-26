-- ==========================================
-- TABELA: depoimentos
-- ==========================================
create table if not exists public.depoimentos (
  id uuid primary key default gen_random_uuid(),
  nome_cliente text not null,
  empresa text,
  foto_url text,
  avaliacao smallint not null default 5 check (avaliacao between 1 and 5),
  texto text not null,
  data_depoimento date,
  publicado boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table public.depoimentos enable row level security;

-- Qualquer visitante do site (mesmo sem login) pode VER os depoimentos publicados
create policy "qualquer pessoa ve depoimentos publicados"
  on public.depoimentos
  for select
  using (publicado = true);
