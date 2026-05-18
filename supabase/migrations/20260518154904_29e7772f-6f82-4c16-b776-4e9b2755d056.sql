
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users view own roles" on public.user_roles for select
  to authenticated using (auth.uid() = user_id);

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles viewable by owner" on public.profiles for select
  to authenticated using (auth.uid() = id);
create policy "Profiles insertable by owner" on public.profiles for insert
  to authenticated with check (auth.uid() = id);
create policy "Profiles updatable by owner" on public.profiles for update
  to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trips
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  start_date date,
  end_date date,
  budget numeric,
  status text not null default 'draft',
  notes text,
  cover_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trips enable row level security;

create policy "Trips select own" on public.trips for select to authenticated using (auth.uid() = user_id);
create policy "Trips insert own" on public.trips for insert to authenticated with check (auth.uid() = user_id);
create policy "Trips update own" on public.trips for update to authenticated using (auth.uid() = user_id);
create policy "Trips delete own" on public.trips for delete to authenticated using (auth.uid() = user_id);

-- Saved destinations
create table public.saved_destinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, destination_slug)
);
alter table public.saved_destinations enable row level security;

create policy "Saved select own" on public.saved_destinations for select to authenticated using (auth.uid() = user_id);
create policy "Saved insert own" on public.saved_destinations for insert to authenticated with check (auth.uid() = user_id);
create policy "Saved delete own" on public.saved_destinations for delete to authenticated using (auth.uid() = user_id);

-- Chat messages
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;

create policy "Chat select own" on public.chat_messages for select to authenticated using (auth.uid() = user_id);
create policy "Chat insert own" on public.chat_messages for insert to authenticated with check (auth.uid() = user_id);
create policy "Chat delete own" on public.chat_messages for delete to authenticated using (auth.uid() = user_id);

-- Update trigger for profiles/trips
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trips_updated_at before update on public.trips
  for each row execute function public.set_updated_at();
