/*
# Create service_requests table

1. Purpose
   Stores plumbing service appointment requests submitted by visitors through
   the website's "Request Service" form. Each row represents one request with
   all the details the visitor entered, plus a generated reference number and
   a status that tracks the request lifecycle.

2. New Tables
   - `service_requests`
     - `id` (uuid, primary key) — unique row identifier
     - `created_at` (timestamptz, default now()) — when the request was submitted
     - `full_name` (text, not null) — customer's full name
     - `phone` (text, not null) — customer's phone number
     - `email` (text, not null) — customer's email address
     - `service_address` (text, not null) — address where service is needed
     - `city` (text, not null) — city of the service address
     - `postal_code` (text, not null) — postal code of the service address
     - `service_type` (text, not null) — selected service category
     - `description` (text, not null) — problem description
     - `preferred_date` (date, not null) — customer's preferred date
     - `preferred_time` (text, not null) — customer's preferred time window
     - `urgency` (text, not null) — urgency level (emergency, asap, few_days, flexible)
     - `contact_permission` (boolean, not null, default false) — consent to contact
     - `photo_url` (text, nullable) — storage path for uploaded photo
     - `status` (text, not null, default 'pending') — request status
     - `reference_number` (text, unique, not null) — human-readable reference number

3. Security
   - Enable RLS on `service_requests`.
   - INSERT-only for anon/authenticated (visitors can submit requests but cannot read, update, or delete any rows).
   - No SELECT, UPDATE, or DELETE policies — submissions are private and can only be read by business staff via the Supabase dashboard (service role bypasses RLS).

4. Notes
   - Reference numbers are generated automatically by a trigger before insert.
   - The status defaults to 'pending' for every new request.
*/

CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  service_address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  service_type text NOT NULL,
  description text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  urgency text NOT NULL,
  contact_permission boolean NOT NULL DEFAULT false,
  photo_url text,
  status text NOT NULL DEFAULT 'pending',
  reference_number text UNIQUE NOT NULL
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Allow visitors to INSERT new requests (no SELECT/UPDATE/DELETE = private)
DROP POLICY IF EXISTS "anon_insert_service_requests" ON service_requests;
CREATE POLICY "anon_insert_service_requests"
ON service_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Generate a unique reference number before insert (format: SR-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION generate_service_request_reference()
RETURNS TRIGGER AS $$
DECLARE
  date_part text;
  seq_val integer;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  seq_val := nextval(pg_get_serial_sequence('service_requests', 'id')::regclass);
  -- Use a random 4-digit suffix to avoid exposing sequential counts
  NEW.reference_number := 'SR-' || date_part || '-' || lpad((floor(random() * 9000) + 1000)::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_service_request_reference ON service_requests;
CREATE TRIGGER trg_service_request_reference
BEFORE INSERT ON service_requests
FOR EACH ROW
WHEN (NEW.reference_number IS NULL)
EXECUTE FUNCTION generate_service_request_reference();

-- Index for sorting by most recent
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests (created_at DESC);
