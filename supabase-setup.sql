-- Danu public website: Supabase SQL setup
-- Run this in Supabase Dashboard > SQL Editor. Uses Row Level Security (RLS).
create extension if not exists pgcrypto;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (char_length(trim(sender_name)) between 1 and 100),
  sender_email text not null check (char_length(trim(sender_email)) between 3 and 254),
  message text not null check (char_length(trim(message)) between 1 and 5000),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
revoke all on public.messages from anon, authenticated;
grant insert on public.messages to anon, authenticated;
grant select on public.messages to authenticated;

drop policy if exists "Public can submit messages" on public.messages;
create policy "Public can submit messages" on public.messages
  for insert to anon, authenticated
  with check (
    char_length(trim(sender_name)) between 1 and 100
    and char_length(trim(sender_email)) between 3 and 254
    and char_length(trim(message)) between 1 and 5000
    and (user_id is null or user_id = auth.uid())
  );

drop policy if exists "Users can read their own messages" on public.messages;
create policy "Users can read their own messages" on public.messages
  for select to authenticated
  using (user_id = auth.uid());

-- Replace your-email@example.com with the exact owner/admin login email.
-- This policy is the security boundary for the private inbox; do not remove it.
drop policy if exists "Owner can read all messages" on public.messages;
create policy "Owner can read all messages" on public.messages
  for select to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = lower('your-email@example.com'));

-- Optional: limit auth password minimum and enable email confirmation in
-- Supabase Dashboard > Authentication > Settings. Never expose service_role keys.
