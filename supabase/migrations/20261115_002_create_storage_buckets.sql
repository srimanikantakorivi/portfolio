-- Migration 002: Storage Buckets and Access Policies
-- Sets up portfolio-media and portfolio-documents buckets with RLS and publication-linked access controls

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-documents', 'portfolio-documents', false)
on conflict (id) do nothing;

-- 1. Storage policies for portfolio-media (Public read, admin write)
drop policy if exists "Public read portfolio-media" on storage.objects;
create policy "Public read portfolio-media"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'portfolio-media');

drop policy if exists "Admin upload portfolio-media" on storage.objects;
create policy "Admin upload portfolio-media"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admin update portfolio-media" on storage.objects;
create policy "Admin update portfolio-media"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admin delete portfolio-media" on storage.objects;
create policy "Admin delete portfolio-media"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'portfolio-media' and public.is_admin());

-- 2. Storage policies for portfolio-documents (Admin full access, publication-restricted public access)
drop policy if exists "Admin manage portfolio-documents" on storage.objects;
create policy "Admin manage portfolio-documents"
    on storage.objects for all
    to authenticated
    using (bucket_id = 'portfolio-documents' and public.is_admin())
    with check (bucket_id = 'portfolio-documents' and public.is_admin());

-- Public can read resume ONLY if publication settings explicitly allow resume download and the file matches the published path
drop policy if exists "Public read published resumes" on storage.objects;
create policy "Public read published resumes"
    on storage.objects for select
    to anon, authenticated
    using (
        bucket_id = 'portfolio-documents'
        and name like 'resumes/%'
        and exists (
            select 1 from public.portfolio_site_settings
            where id = 'primary'
              and allow_resume_download = true
              and resume_storage_path is not null
              and (name = resume_storage_path or name = ('resumes/' || resume_storage_path))
        )
    );

-- Certificate files in 'certificates/' remain strictly private with no public read policy.
-- Viewing certificate metadata is handled in-app via verified specimen views or authenticated admin previews.
