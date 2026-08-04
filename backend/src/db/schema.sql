-- Invest Care CMS — schema
-- Idempotent: safe to run on every deploy.

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'admin',
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- ---------------------------------------------------------------------------
-- Singletons — one JSON document per key (company profile, capital, quote…).
-- Editing a whole document at once beats twenty columns that always change
-- together, and new fields need no migration.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB       NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Generic ordered lists. Around a dozen sections on the site are "a heading,
-- a paragraph, in this order" — values, why-invest, commitments, stats,
-- governance pillars. One table serves them all, keyed by `group_key`, so the
-- CMS renders a single list editor per group instead of a dozen bespoke ones.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS content_blocks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key    TEXT        NOT NULL,
  title        TEXT,
  body         TEXT,
  label        TEXT,
  value        TEXT,
  icon         TEXT,
  position     INTEGER     NOT NULL DEFAULT 0,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_blocks_group_idx
  ON content_blocks (group_key, position);

-- ---------------------------------------------------------------------------
-- Leadership
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS board_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT        NOT NULL UNIQUE,
  name         TEXT        NOT NULL,
  role         TEXT,
  credentials  TEXT,
  bio          TEXT,
  image        TEXT,
  position     INTEGER     NOT NULL DEFAULT 0,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Sectors — `share` values are percentages the allocation donut expects to
-- total 100. The API warns when they do not; it does not block saving, because
-- an editor mid-edit will legitimately be at 97 or 103.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sectors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT        NOT NULL UNIQUE,
  name         TEXT        NOT NULL,
  share        NUMERIC(5,2) NOT NULL DEFAULT 0,
  icon         TEXT,
  color        TEXT,
  body         TEXT,
  position     INTEGER     NOT NULL DEFAULT 0,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Portfolio
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS portfolio_companies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT        NOT NULL UNIQUE,
  name         TEXT        NOT NULL,
  brand        TEXT,
  location     TEXT,
  sector       TEXT,
  icon         TEXT,
  status       TEXT        NOT NULL DEFAULT 'Active',
  summary      TEXT,
  profile      TEXT,
  metrics      JSONB       NOT NULL DEFAULT '[]'::jsonb,
  image        TEXT,
  image_hint   TEXT,
  logo         TEXT,
  position     INTEGER     NOT NULL DEFAULT 0,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Path to listing
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_label   TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  detail       TEXT,
  position     INTEGER     NOT NULL DEFAULT 0,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Global comparables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS benchmarks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  country      TEXT,
  figure       TEXT,
  caption      TEXT,
  featured     BOOLEAN     NOT NULL DEFAULT FALSE,
  points       JSONB       NOT NULL DEFAULT '[]'::jsonb,
  position     INTEGER     NOT NULL DEFAULT 0,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Careers
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS job_openings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        NOT NULL UNIQUE,
  title           TEXT        NOT NULL,
  department      TEXT,
  location        TEXT,
  employment_type TEXT,
  summary         TEXT,
  description     TEXT,
  requirements    JSONB       NOT NULL DEFAULT '[]'::jsonb,
  apply_email     TEXT,
  closes_on       DATE,
  position        INTEGER     NOT NULL DEFAULT 0,
  is_published    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Contact form submissions. Written by the public, read by the CMS.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS enquiries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT        NOT NULL,
  source     TEXT        NOT NULL DEFAULT 'website',
  status     TEXT        NOT NULL DEFAULT 'new',
  notes      TEXT,
  handled_by UUID REFERENCES users (id) ON DELETE SET NULL,
  handled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT enquiries_status_check CHECK (status IN ('new', 'read', 'replied', 'archived'))
);

CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- Uploaded images
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      TEXT        NOT NULL UNIQUE,
  original_name TEXT        NOT NULL,
  mime_type     TEXT        NOT NULL,
  size_bytes    INTEGER     NOT NULL,
  url           TEXT        NOT NULL,
  alt_text      TEXT,
  uploaded_by   UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users', 'content_blocks', 'board_members', 'sectors', 'portfolio_companies',
    'roadmap_milestones', 'benchmarks', 'job_openings', 'enquiries', 'media'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', t || '_set_updated_at', t);
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t || '_set_updated_at', t
    );
  END LOOP;
END;
$$;
