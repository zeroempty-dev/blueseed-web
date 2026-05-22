/**
 * ZeroEmpty — Database Migration v2 Runner
 *
 * Reads migrate_v2.sql from the same directory and executes it against the
 * PostgreSQL database configured via DATABASE_URL in the environment.
 *
 * Usage:
 *   node src/db/migrate_v2.js
 *
 * The SQL file uses IF NOT EXISTS / DO $$ guards so this script is safe to
 * re-run at any time without duplicating data or throwing errors.
 */

'use strict';

require('dotenv').config();

const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const sqlPath = path.join(__dirname, 'migrate_v2.sql');

  console.log(`Reading migration file: ${sqlPath}`);
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = await pool.connect();
  try {
    console.log('Applying migration v2…');
    await client.query(sql);
    console.log('Migration v2 applied successfully.');
  } catch (err) {
    console.error('Migration v2 failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
