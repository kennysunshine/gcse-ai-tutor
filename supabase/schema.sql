
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student',
  year_group text,
  exam_board text,
  target_grade text,
  enemy_question text,
  study_context jsonb,
  subject_priorities jsonb,
  passions jsonb,
  student_profile_summary text,
  onboarding_completed boolean default false,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Users can view own profile." on profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for chats
create table chats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  messages jsonb not null default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for chats
alter table chats enable row level security;

create policy "Users can view own chats." on chats
  for select using (auth.uid() = user_id);

create policy "Users can insert own chats." on chats
  for insert with check (auth.uid() = user_id);

create policy "Users can update own chats." on chats
  for update using (auth.uid() = user_id);

-- Create a table for Elite Discovery Exit Tickets
create table exit_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  aha_moment text not null,
  brilliance_briefing text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for exit_tickets
alter table exit_tickets enable row level security;

create policy "Users can view own exit tickets." on exit_tickets
  for select using (auth.uid() = user_id);

create policy "Users can insert own exit tickets." on exit_tickets
  for insert with check (auth.uid() = user_id);

-- Create a table for progress tracking
create table progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  streak_count integer default 0,
  last_study_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for progress
alter table progress enable row level security;

create policy "Users can view own progress." on progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress." on progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own progress." on progress
  for update using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
