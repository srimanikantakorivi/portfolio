-- Migration 001: Create Portfolio Tables, Row Level Security, and Admin Verification
-- Enables single-admin management, independent draft revisions, and public read-only access for published records

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Authorized Admin Users & Verification Function
-- PRESERVED: The public.admin_users table, its RLS policies, and the public.is_admin() function
-- already exist in the Supabase project. They are preserved without recreation or alteration.

-- 2. Profile Table (Single published record)
create table if not exists public.portfolio_profile (
    id text primary key default 'profile-primary',
    name text not null default 'Sri Manikanta Korivi',
    tagline text not null,
    subheadline text not null,
    education jsonb not null default '{}'::jsonb,
    bio text[] not null default '{}',
    location text,
    email text,
    github_url text not null,
    linkedin_url text,
    resume_url text,
    status_badge text,
    roles text[] not null default '{}',
    content_blocks jsonb not null default '[]'::jsonb,
    status text not null default 'published' check (status in ('draft', 'preview', 'published', 'archived')),
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_profile enable row level security;

drop policy if exists "Public read published profile" on public.portfolio_profile;
create policy "Public read published profile"
    on public.portfolio_profile for select
    to anon, authenticated
    using (status = 'published');

drop policy if exists "Admin manage profile" on public.portfolio_profile;
create policy "Admin manage profile"
    on public.portfolio_profile for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 3. Projects Table
create table if not exists public.portfolio_projects (
    id text primary key default ('proj-' || gen_random_uuid()::text),
    slug text unique not null,
    title text not null,
    subtitle text not null,
    summary text not null,
    description text not null,
    category text not null,
    featured boolean not null default false,
    project_stage text not null check (project_stage in ('live', 'hackathon_prototype', 'in_progress')),
    stage_label text not null,
    status text not null default 'published' check (status in ('draft', 'preview', 'published', 'archived')),
    is_verified boolean not null default false,
    tech_stack text[] not null default '{}',
    tags text[] not null default '{}',
    live_url text,
    github_url text,
    cover_image text,
    key_highlights text[] not null default '{}',
    challenges text[] not null default '{}',
    content_blocks jsonb not null default '[]'::jsonb,
    sort_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_projects enable row level security;

drop policy if exists "Public read published projects" on public.portfolio_projects;
create policy "Public read published projects"
    on public.portfolio_projects for select
    to anon, authenticated
    using (status = 'published');

drop policy if exists "Admin manage projects" on public.portfolio_projects;
create policy "Admin manage projects"
    on public.portfolio_projects for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 4. Skills Table
create table if not exists public.portfolio_skills (
    id text primary key default ('skill-' || gen_random_uuid()::text),
    category text not null,
    description text,
    items jsonb not null default '[]'::jsonb,
    status text not null default 'published' check (status in ('draft', 'preview', 'published', 'archived')),
    sort_order integer not null default 0,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_skills enable row level security;

drop policy if exists "Public read published skills" on public.portfolio_skills;
create policy "Public read published skills"
    on public.portfolio_skills for select
    to anon, authenticated
    using (status = 'published');

drop policy if exists "Admin manage skills" on public.portfolio_skills;
create policy "Admin manage skills"
    on public.portfolio_skills for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 5. Experience Table
create table if not exists public.portfolio_experience (
    id text primary key default ('exp-' || gen_random_uuid()::text),
    title text not null,
    organization text not null,
    period text not null,
    location text,
    focus text not null,
    is_verified boolean not null default false,
    status text not null default 'published' check (status in ('draft', 'preview', 'published', 'archived')),
    bullets text[] not null default '{}',
    skills text[] not null default '{}',
    content_blocks jsonb not null default '[]'::jsonb,
    sort_order integer not null default 0,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_experience enable row level security;

drop policy if exists "Public read published experience" on public.portfolio_experience;
create policy "Public read published experience"
    on public.portfolio_experience for select
    to anon, authenticated
    using (status = 'published');

drop policy if exists "Admin manage experience" on public.portfolio_experience;
create policy "Admin manage experience"
    on public.portfolio_experience for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 6. Certifications Table
create table if not exists public.portfolio_certifications (
    id text primary key default ('cert-' || gen_random_uuid()::text),
    title text not null,
    acronym text,
    issuer text not null,
    issue_date text not null,
    credential_id text,
    verification_url text,
    preview_document jsonb,
    allow_download boolean not null default false,
    is_verified boolean not null default false,
    status text not null default 'published' check (status in ('draft', 'preview', 'published', 'archived')),
    topics text[] not null default '{}',
    content_blocks jsonb not null default '[]'::jsonb,
    sort_order integer not null default 0,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_certifications enable row level security;

drop policy if exists "Public read published certifications" on public.portfolio_certifications;
create policy "Public read published certifications"
    on public.portfolio_certifications for select
    to anon, authenticated
    using (status = 'published');

drop policy if exists "Admin manage certifications" on public.portfolio_certifications;
create policy "Admin manage certifications"
    on public.portfolio_certifications for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 7. Contact Channels Table
create table if not exists public.portfolio_contact_channels (
    id text primary key,
    platform text not null,
    label text not null,
    value text not null,
    url text,
    is_verified boolean not null default false,
    is_visible boolean not null default true,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_contact_channels enable row level security;

drop policy if exists "Public read visible contact channels" on public.portfolio_contact_channels;
create policy "Public read visible contact channels"
    on public.portfolio_contact_channels for select
    to anon, authenticated
    using (is_visible = true);

drop policy if exists "Admin manage contact channels" on public.portfolio_contact_channels;
create policy "Admin manage contact channels"
    on public.portfolio_contact_channels for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 8. Independent Draft Revisions Table
-- Stores work-in-progress edits independently so saving drafts never removes or alters published records
create table if not exists public.portfolio_draft_revisions (
    id uuid primary key default gen_random_uuid(),
    entity_type text not null check (entity_type in ('profile', 'project', 'skill', 'experience', 'certification', 'site_settings')),
    entity_id text not null,
    draft_data jsonb not null,
    status text not null default 'draft' check (status in ('draft', 'preview', 'pending_review')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (entity_type, entity_id)
);

alter table public.portfolio_draft_revisions enable row level security;

-- Only authenticated admins can view and manage draft revisions
drop policy if exists "Admin manage draft revisions" on public.portfolio_draft_revisions;
create policy "Admin manage draft revisions"
    on public.portfolio_draft_revisions for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 9. Inquiries Table with Length Validation & Anti-Spam Rate Limiting
create table if not exists public.portfolio_inquiries (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) >= 2 and char_length(trim(name)) <= 100),
    email text not null check (
        char_length(trim(email)) >= 5 and char_length(trim(email)) <= 255 
        and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    subject text check (subject is null or char_length(trim(subject)) <= 150),
    message text not null check (char_length(trim(message)) >= 10 and char_length(trim(message)) <= 3000),
    is_read boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_inquiries enable row level security;

-- Rate limiting and sanitization trigger function
create or replace function public.check_inquiry_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recent_hourly_count int;
  last_submission_time timestamp with time zone;
begin
  new.name := trim(new.name);
  new.email := lower(trim(new.email));
  if new.subject is not null then
    new.subject := trim(new.subject);
  end if;
  new.message := trim(new.message);
  new.is_read := false;

  -- Anti-burst protection: at least 30 seconds between consecutive submissions from same email
  select created_at into last_submission_time
  from public.portfolio_inquiries
  where email = new.email
  order by created_at desc
  limit 1;

  if last_submission_time is not null and last_submission_time > (now() - interval '30 seconds') then
    raise exception 'Please wait a moment before sending another message.';
  end if;

  -- Hourly limit: maximum 3 inquiries per email per hour
  select count(*) into recent_hourly_count
  from public.portfolio_inquiries
  where email = new.email
    and created_at > (now() - interval '1 hour');

  if recent_hourly_count >= 3 then
    raise exception 'Inquiry rate limit exceeded. Please try again later.';
  end if;

  return new;
end;
$$;

revoke all on function public.check_inquiry_rate_limit() from public;
grant execute on function public.check_inquiry_rate_limit() to anon, authenticated;

drop trigger if exists tr_inquiry_rate_limit on public.portfolio_inquiries;
create trigger tr_inquiry_rate_limit
    before insert on public.portfolio_inquiries
    for each row
    execute function public.check_inquiry_rate_limit();

drop policy if exists "Public insert inquiry" on public.portfolio_inquiries;
create policy "Public insert inquiry"
    on public.portfolio_inquiries for insert
    to anon, authenticated
    with check (
        char_length(trim(name)) between 2 and 100
        and char_length(trim(email)) between 5 and 255
        and char_length(trim(message)) between 10 and 3000
        and is_read = false
    );

drop policy if exists "Admin read and manage inquiries" on public.portfolio_inquiries;
create policy "Admin read and manage inquiries"
    on public.portfolio_inquiries for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 10. Site Settings Table (SEO, metadata, resume settings)
create table if not exists public.portfolio_site_settings (
    id text primary key default 'primary',
    site_title text not null default 'Sri Manikanta Korivi — Software Development & Modern Web Experiences',
    meta_description text not null default 'B.Tech Computer Science & Engineering student at KITS Akshar Institute of Technology. Building modern web experiences and exploring practical AI-assisted workflows.',
    admin_email text,
    resume_storage_path text,
    allow_resume_download boolean not null default false,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.portfolio_site_settings enable row level security;

drop policy if exists "Public read site settings" on public.portfolio_site_settings;
create policy "Public read site settings"
    on public.portfolio_site_settings for select
    to anon, authenticated
    using (true);

drop policy if exists "Admin manage site settings" on public.portfolio_site_settings;
create policy "Admin manage site settings"
    on public.portfolio_site_settings for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());
