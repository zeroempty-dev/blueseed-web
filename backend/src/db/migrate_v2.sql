-- =============================================================================
-- ZeroEmpty — Database Migration v2
-- =============================================================================
-- Adds: roles, user_roles, vehicle_types, invite_tokens, notifications tables.
-- Alters: users, orders, vehicles, bookings with new columns.
-- Seeds:  roles (Admin, Supplier, Driver, Manager) and vehicle_types.
--
-- Safe to re-run: all DDL uses IF NOT EXISTS / DO $$ guards.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. NEW TABLES
-- ---------------------------------------------------------------------------

-- roles: named permission bundles (Admin, Supplier, Driver, Manager, etc.)
CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- user_roles: many-to-many relationship between users and roles
CREATE TABLE IF NOT EXISTS user_roles (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- vehicle_types: canonical vehicle categories with capacity bounds
CREATE TABLE IF NOT EXISTS vehicle_types (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  icon              VARCHAR(100),
  min_capacity_kg   DECIMAL(12, 2),
  max_capacity_kg   DECIMAL(12, 2),
  status            VARCHAR(20) DEFAULT 'available',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- invite_tokens: time-limited invitation links for onboarding new users
CREATE TABLE IF NOT EXISTS invite_tokens (
  id          SERIAL PRIMARY KEY,
  token       VARCHAR(255) UNIQUE NOT NULL,
  email       VARCHAR(255) NOT NULL,
  role_id     INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  invited_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  expires_at  TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- notifications: per-user notification inbox
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT,
  data       JSONB,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2. ALTER EXISTING TABLES
-- ---------------------------------------------------------------------------

-- users: add phone, status, and optional FK to roles
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone   VARCHAR(20),
  ADD COLUMN IF NOT EXISTS status  VARCHAR(20) NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL;

-- orders: add estimated routing fields
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS estimated_distance_km DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS estimated_time_hrs    DECIMAL(10, 2);

-- vehicles: link to vehicle_types, add status, make, model
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS vehicle_type_id INTEGER REFERENCES vehicle_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status          VARCHAR(20) NOT NULL DEFAULT 'available',
  ADD COLUMN IF NOT EXISTS model           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS make            VARCHAR(100);

-- bookings: completion timestamp and free-text notes
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notes        TEXT;

-- ---------------------------------------------------------------------------
-- 3. INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_invite_tokens_token   ON invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ---------------------------------------------------------------------------
-- 4. SEED — roles
-- ---------------------------------------------------------------------------
-- Using DO $$ blocks so the seed is idempotent (skip if name already exists).

DO $$
BEGIN
  -- Admin: full access across the platform
  IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Admin') THEN
    INSERT INTO roles (name, permissions) VALUES (
      'Admin',
      '["manage_users","manage_roles","manage_orders","manage_vehicles","manage_bookings",
        "view_analytics","manage_invites","manage_notifications","manage_vehicle_types","manage_settings"]'::jsonb
    );
  END IF;

  -- Supplier: create and track their own orders
  IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Supplier') THEN
    INSERT INTO roles (name, permissions) VALUES (
      'Supplier',
      '["create_orders","view_own_orders","manage_own_profile","view_notifications"]'::jsonb
    );
  END IF;

  -- Driver: accept and fulfil assigned bookings
  IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Driver') THEN
    INSERT INTO roles (name, permissions) VALUES (
      'Driver',
      '["view_assigned_bookings","update_booking_status","view_own_profile","view_notifications"]'::jsonb
    );
  END IF;

  -- Manager: operational oversight without full admin privileges
  IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Manager') THEN
    INSERT INTO roles (name, permissions) VALUES (
      'Manager',
      '["manage_orders","manage_bookings","view_analytics","manage_invites","view_notifications"]'::jsonb
    );
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 5. SEED — vehicle_types
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  -- Full Truck Load: large bulk shipments
  IF NOT EXISTS (SELECT 1 FROM vehicle_types WHERE name = 'Full Truck Load') THEN
    INSERT INTO vehicle_types (name, icon, min_capacity_kg, max_capacity_kg, status)
    VALUES ('Full Truck Load', 'truck-full', 10000.00, 30000.00, 'available');
  END IF;

  -- Partial Load: shared / consolidated freight
  IF NOT EXISTS (SELECT 1 FROM vehicle_types WHERE name = 'Partial Load') THEN
    INSERT INTO vehicle_types (name, icon, min_capacity_kg, max_capacity_kg, status)
    VALUES ('Partial Load', 'truck-partial', 500.00, 10000.00, 'available');
  END IF;

  -- Mini Truck: last-mile / urban deliveries
  IF NOT EXISTS (SELECT 1 FROM vehicle_types WHERE name = 'Mini Truck') THEN
    INSERT INTO vehicle_types (name, icon, min_capacity_kg, max_capacity_kg, status)
    VALUES ('Mini Truck', 'truck-mini', 100.00, 2000.00, 'available');
  END IF;

  -- Refrigerated: temperature-controlled perishables
  IF NOT EXISTS (SELECT 1 FROM vehicle_types WHERE name = 'Refrigerated') THEN
    INSERT INTO vehicle_types (name, icon, min_capacity_kg, max_capacity_kg, status)
    VALUES ('Refrigerated', 'truck-refrigerated', 1000.00, 15000.00, 'available');
  END IF;

  -- Flatbed: oversized / heavy machinery
  IF NOT EXISTS (SELECT 1 FROM vehicle_types WHERE name = 'Flatbed') THEN
    INSERT INTO vehicle_types (name, icon, min_capacity_kg, max_capacity_kg, status)
    VALUES ('Flatbed', 'truck-flatbed', 5000.00, 25000.00, 'available');
  END IF;

  -- Tanker: liquids and bulk fluids
  IF NOT EXISTS (SELECT 1 FROM vehicle_types WHERE name = 'Tanker') THEN
    INSERT INTO vehicle_types (name, icon, min_capacity_kg, max_capacity_kg, status)
    VALUES ('Tanker', 'truck-tanker', 5000.00, 20000.00, 'available');
  END IF;
END
$$;
