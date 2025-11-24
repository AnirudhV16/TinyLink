import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ Connected to Neon DB successfully!"))
  .catch(err => console.error("❌ Neon DB connection error:", err));

export default pool;
