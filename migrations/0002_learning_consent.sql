create table if not exists packwatch_learning_consent (
  user_id text primary key,
  status text not null check (status in ('granted', 'denied')),
  policy_version text not null,
  source text not null check (source in ('prompt', 'settings')),
  updated_at timestamptz not null default now()
);

create table if not exists packwatch_consent_events (
  id bigserial primary key,
  user_id text not null,
  status text not null check (status in ('granted', 'denied')),
  policy_version text not null,
  source text not null check (source in ('prompt', 'settings')),
  created_at timestamptz not null default now()
);

create table if not exists packwatch_learning_contributions (
  id bigserial primary key,
  user_id text not null,
  signal jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists packwatch_learning_contributions_user_created_idx
  on packwatch_learning_contributions (user_id, created_at desc);
