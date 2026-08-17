/*
# Create quote_requests table

1. Purpose
   Stores shorter quote requests submitted through the website's "Get a Quote"
   modal form. Each row captures the visitor's contact info, service need, and
   a generated reference number.

2. New Tables
   - `quote_requests`
     - `id` (uuid, primary key) — unique row identifier
     - `created_at` (timestamptz, default now()) — when the quote was requested
     - `full_name` (text, not null) — customer's name
     - `phone` (text, not null) — customer's phone
     - `email` (text, not null) — customer's email
     - `postal_code` (text, not null) — customer's postal code
     - `service_type` (text, not null) — selected service category
     - `description` (text, not null) — short problem description
     - `contact_permission` (boolean, not null, default false) — consent to contact
     - `photo_url` (text, nullable) — storage path for uploaded photo
     - `status` (text, not null, default 'pending') — quote status
     - `reference_number` (text, unique, not null) — human-readable reference number

3. Security
   - Enable RLS on `quote_requests`.
   - INSERT-only for anon/authenticated (visitors can submit but cannot read, update, or delete).
   - No SELECT/UPDATE/DELETE policies — submissions are private.

4. Notes
   - Reference numbers generated automatically by trigger (format: QR-YYYYMMDD-XXXX).
   - Status defaults to 'pending'.
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  postal_code text NOT NULL,
  service_type text NOT NULL,
  description text NOT NULL,
  contact_permission boolean NOT NULL DEFAULT false,
  photo_url text,
  status text NOT NULL DEFAULT 'pending',
  reference_number text UNIQUE NOT NULL
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_quote_requests" ON quote_requests;
CREATE POLICY "anon_insert_quote_requests"
ON quote_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE OR REPLACE FUNCTION generate_quote_request_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference_number := 'QR-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((floor(random() * 9000) + 1000)::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_quote_request_reference ON quote_requests;
CREATE TRIGGER trg_quote_request_reference
BEFORE INSERT ON quote_requests
FOR EACH ROW
WHEN (NEW.reference_number IS NULL)
EXECUTE FUNCTION generate_quote_request_reference();

CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests (created_at DESC);
