const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simple query helper
module.exports = {
  query: (text, params) => pool.query(text, params),
};
