-- ZeroEmpty PostgreSQL schema

CREATE TYPE user_role AS ENUM ('supplier', 'transport_owner', 'driver');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'in_transit', 'delivered', 'completed', 'cancelled');
CREATE TYPE commodity_type AS ENUM ('perishable', 'fragile', 'bulk', 'electronics', 'other');
CREATE TYPE delivery_type AS ENUM ('timed', 'non_timed');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Table: users
-- Stores all users including suppliers, transport owners, and drivers.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'supplier',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: orders
-- Stores the delivery orders placed by suppliers.
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pickup_location VARCHAR(500) NOT NULL,
  drop_location VARCHAR(500) NOT NULL,
  pickup_date DATE NOT NULL,
  transport_type VARCHAR(100),
  delivery_type delivery_type NOT NULL DEFAULT 'non_timed',
  delivery_deadline TIMESTAMPTZ,
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT timed_delivery_requires_deadline CHECK (
    (delivery_type = 'non_timed') OR (delivery_deadline IS NOT NULL)
  )
);

-- Table: commodities
-- Stores the items/cargo details associated with a specific order.
CREATE TABLE commodities (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type commodity_type NOT NULL DEFAULT 'bulk',
  weight_kg DECIMAL(12, 2) NOT NULL,
  length_cm DECIMAL(10, 2),
  width_cm DECIMAL(10, 2),
  height_cm DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: vehicles
-- Stores registered transport vehicles.
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  capacity_kg DECIMAL(12, 2) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: bookings
-- Stores transport bookings that map an order to a vehicle and driver.
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  price DECIMAL(12, 2),
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_commodities_order ON commodities(order_id);
