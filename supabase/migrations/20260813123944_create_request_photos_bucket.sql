/*
# Create storage bucket for request photos

1. Purpose
   Creates a private storage bucket called `request-photos` where visitors can
   upload photos attached to service requests and quote requests. The bucket is
   private — only business staff (service role) can read the uploaded photos.

2. Storage Object
   - Bucket: `request-photos` (private)
   - Paths: `service-requests/<filename>` and `quote-requests/<filename>`

3. Security (Storage Policies)
   - INSERT: anon/authenticated can upload photos (needed for form submission).
   - SELECT: No public read — photos are private to the business.
   - UPDATE/DELETE: No public access — only service role can manage.

4. Notes
   - The frontend uploads photos directly to this bucket before inserting the
     database row, storing the resulting path in `photo_url`.
   - File validation (type and size) is enforced client-side and should also be
     enforced server-side if an edge function is used for submission.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('request-photos', 'request-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Allow visitors to upload photos
DROP POLICY IF EXISTS "anon_upload_request_photos" ON storage.objects;
CREATE POLICY "anon_upload_request_photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'request-photos');

-- No SELECT, UPDATE, or DELETE policies: photos are private to the business.
-- Business staff access photos via the Supabase dashboard (service role bypasses RLS).
