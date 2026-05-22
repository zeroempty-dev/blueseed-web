const pool = require('./pool');

async function seed() {
  const client = await pool.connect();
  try {
    const { rows: existing } = await client.query(
      "SELECT id FROM users WHERE email = 'rajan@zeroempty.com'"
    );
    if (existing.length > 0) {
      console.log('Seed data already exists.');
      return;
    }

    const supplier = await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ('Rajan', 'rajan@zeroempty.com', 'demo', 'supplier')
       RETURNING id`
    );
    const supplierId = supplier.rows[0].id;

    const order1 = await client.query(
      `INSERT INTO orders (supplier_id, pickup_location, drop_location, pickup_date, delivery_type, status)
       VALUES ($1, 'Delhi', 'Pune', '2025-06-01', 'non_timed', 'in_transit')
       RETURNING id`,
      [supplierId]
    );
    await client.query(
      `INSERT INTO commodities (order_id, name, type, weight_kg)
       VALUES ($1, 'Steel Rods', 'bulk', 2400)`,
      [order1.rows[0].id]
    );

    const order2 = await client.query(
      `INSERT INTO orders (supplier_id, pickup_location, drop_location, pickup_date, delivery_type, status)
       VALUES ($1, 'Mumbai', 'Surat', '2025-05-20', 'timed', 'delivered')
       RETURNING id`,
      [supplierId]
    );
    await client.query(
      `INSERT INTO commodities (order_id, name, type, weight_kg)
       VALUES ($1, 'Electronics', 'electronics', 800)`,
      [order2.rows[0].id]
    );

    const order3 = await client.query(
      `INSERT INTO orders (supplier_id, pickup_location, drop_location, pickup_date, delivery_type, status)
       VALUES ($1, 'Kolkata', 'Bhopal', '2025-05-10', 'non_timed', 'completed')
       RETURNING id`,
      [supplierId]
    );
    await client.query(
      `INSERT INTO commodities (order_id, name, type, weight_kg)
       VALUES ($1, 'Rice', 'perishable', 5000)`,
      [order3.rows[0].id]
    );

    console.log('Seed data inserted.');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
