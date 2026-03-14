-- QuizForge cloud state table
create table if not exists public.app_state (
  id bigint primary key,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint app_state_singleton check (id = 1)
);

-- Keep the first row ready (id=1)
insert into public.app_state (id, state)
values (
  1,
  '{"users":{},"customQuestions":[],"challenges":[],"questionStats":{}}'::jsonb
)
on conflict (id) do nothing;

alter table public.app_state enable row level security;

-- Demo policy: anon users can read/write singleton state row.
-- For production, replace with authenticated-only policies.
drop policy if exists "anon read app_state" on public.app_state;
create policy "anon read app_state"
  on public.app_state
  for select
  to anon
  using (id = 1);

drop policy if exists "anon write app_state" on public.app_state;
create policy "anon write app_state"
  on public.app_state
  for insert
  to anon
  with check (id = 1);

drop policy if exists "anon update app_state" on public.app_state;
create policy "anon update app_state"
  on public.app_state
  for update
  to anon
  using (id = 1)
  with check (id = 1);
