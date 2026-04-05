-- Create a table for Leads from the Cognitive Diagnostic tool
create table leads (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  year_group text,
  thinking_profile text,
  source text default 'diagnostic_tofu',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure unique email per lead to prevent duplicates
  constraint unique_diagnostic_email unique(email)
);

-- Set up Row Level Security (RLS)
alter table leads enable row level security;

-- Admin-only access for viewing leads, but public allowed for insertion
create policy "Anyone can insert leads from the diagnostic." on leads
  for insert with check (true);

create policy "Admins can view diagnostic leads." on leads
  for select using (auth.role() = 'authenticated');
