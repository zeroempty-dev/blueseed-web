/**
 * PostgreSQL Database Connection Pool
 * This module configures and exports a shared connection pool to interact
 * with the PostgreSQL database. It utilizes environment variables for configuration.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Create a new Pool instance for managing database connections
const pool = new Pool({
  // Use DATABASE_URL from the environment or default to local credentials
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/zeroempty',
});

module.exports = pool;
