const { Pool } = require("pg");

// Connect to Postgres using separate env vars
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Simple query helper
const db = {
  query: (text, params) => pool.query(text, params),
};

// Immediately create tables if they don't exist
(async () => {
  try {
    // USERS table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // JOB_APPLICATIONS table
    await db.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        applied_date DATE,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log("Tables checked/created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
})();

module.exports = db;
