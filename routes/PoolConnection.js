import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

//Check if DATABASE_URL is being loaded correctly
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Verify connection
pool.connect()
  .then((client) => {
    console.log("Connected to Neon PostgreSQL database!");
    client.release();
  })
  .catch((err) => console.error("Database connection error:", err.stack));

export default pool;
