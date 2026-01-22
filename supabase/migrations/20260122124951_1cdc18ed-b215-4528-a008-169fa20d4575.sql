-- Create bucket for user uploads (public)
insert into storage.buckets (id, name, public)
values ('user-uploads', 'user-uploads', true)
on conflict (id) do update set public = excluded.public;

-- RLS policies for public/anonymous usage
-- Note: Policies are on storage.objects

-- Allow anyone to upload into user-uploads bucket
create policy "Public can upload to user-uploads"
on storage.objects
for insert
to public
with check (bucket_id = 'user-uploads');

-- Allow anyone to read/download files from user-uploads bucket
create policy "Public can read user-uploads"
on storage.objects
for select
to public
using (bucket_id = 'user-uploads');
