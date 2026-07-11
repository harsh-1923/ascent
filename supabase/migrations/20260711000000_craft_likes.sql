-- craft_likes table
create table if not exists public.craft_likes (
  id uuid primary key default gen_random_uuid(),
  craft_id text not null unique,
  like_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep updated_at current on every row update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_craft_likes_updated_at on public.craft_likes;
create trigger trg_craft_likes_updated_at
  before update on public.craft_likes
  for each row execute function public.set_updated_at();

-- RLS: the app talks to this table straight from the browser with the
-- publishable/anon key, so allow public read/insert/update. It's just a
-- like counter, no sensitive data.
alter table public.craft_likes enable row level security;

drop policy if exists "public read" on public.craft_likes;
create policy "public read" on public.craft_likes
  for select using (true);

drop policy if exists "public insert" on public.craft_likes;
create policy "public insert" on public.craft_likes
  for insert with check (true);

drop policy if exists "public update" on public.craft_likes;
create policy "public update" on public.craft_likes
  for update using (true) with check (true);

-- enable realtime UPDATE events (CraftCard subscribes to postgres_changes)
alter publication supabase_realtime add table public.craft_likes;

-- Atomic like increment. Ensures the increment happens inside the database
-- (like_count = like_count + n) so concurrent / rapid double-tap likes
-- can't overwrite each other.
create or replace function public.increment_craft_like(
  p_craft_id text,
  p_increment int default 1
)
returns int
language plpgsql
as $$
declare
  new_count int;
begin
  insert into public.craft_likes (craft_id, like_count)
  values (p_craft_id, p_increment)
  on conflict (craft_id)
  do update set
    like_count = public.craft_likes.like_count + p_increment,
    updated_at = now()
  returning like_count into new_count;

  return new_count;
end;
$$;

-- seed rows for the crafts that already exist so first-load isn't racing an insert
insert into public.craft_likes (craft_id, like_count) values
  ('glyph-inspector', 0),
  ('heat-map', 0),
  ('focus-accordion', 0),
  ('through-tabs', 0),
  ('chat-input-gpt', 0)
on conflict (craft_id) do nothing;
