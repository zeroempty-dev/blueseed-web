const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Database schema applied successfully.');
  } catch (err) {
    if (err.code === '42710' || err.message.includes('already exists')) {
      console.log('Schema objects may already exist. Skipping duplicates.');
    } else {
      throw err;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
