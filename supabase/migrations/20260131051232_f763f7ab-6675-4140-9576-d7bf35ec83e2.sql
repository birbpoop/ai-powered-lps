-- Remove public policies from storage bucket
DROP POLICY IF EXISTS "Public can upload to user-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public can read user-uploads" ON storage.objects;

-- Make bucket private (or delete if not needed - keeping for potential future use)
UPDATE storage.buckets SET public = false WHERE id = 'user-uploads';

-- Add authenticated-only policies for future use
CREATE POLICY "Authenticated users can upload to user-uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');

CREATE POLICY "Authenticated users can read from user-uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-uploads');

CREATE POLICY "Authenticated users can delete their uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-uploads');