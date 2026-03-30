
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
  metadata jsonb default '{}',
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
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for Safeguarding Logs
create table safeguarding_logs (
    id uuid default gen_random_uuid() primary key,
    student_id uuid references auth.users not null,
    content text not null,
    reason text not null,
    severity text not null check (severity in ('Low', 'Medium', 'High')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for safeguarding logs
alter table safeguarding_logs enable row level security;
create policy "Only backend can insert logs, teachers can view." on safeguarding_logs
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- SOVEREIGN LIBRARY GAMIFICATION TABLES
-- ============================================================

-- Book Mastery Sessions: records when a student completes a Mastery Session
create table book_mastery (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users not null,
  book_id text not null,
  book_title text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  lumens_awarded integer default 50
);

alter table book_mastery enable row level security;

create policy "Students can view own mastery." on book_mastery
  for select using (auth.uid() = student_id);
create policy "Students can insert own mastery." on book_mastery
  for insert with check (auth.uid() = student_id);
create policy "Teachers can view all mastery." on book_mastery
  for select using (auth.role() = 'authenticated');

-- Student Lumens: total Lumen balance per student
create table student_lumens (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users not null unique,
  lumens integer default 0,
  streak_days integer default 0,
  last_active_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table student_lumens enable row level security;

create policy "Students can view own lumens." on student_lumens
  for select using (auth.uid() = student_id);
create policy "Students can insert own lumens." on student_lumens
  for insert with check (auth.uid() = student_id);
create policy "Students can update own lumens." on student_lumens
  for update using (auth.uid() = student_id);
create policy "Teachers can view all lumens." on student_lumens
  for select using (auth.role() = 'authenticated');

-- Student Badges: earned book badges
create table student_badges (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users not null,
  badge_id text not null,
  badge_name text not null,
  badge_image_url text,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, badge_id)
);

alter table student_badges enable row level security;

create policy "Students can view own badges." on student_badges
  for select using (auth.uid() = student_id);
create policy "Students can insert own badges." on student_badges
  for insert with check (auth.uid() = student_id);
create policy "Teachers can view all badges." on student_badges
  for select using (auth.role() = 'authenticated');
