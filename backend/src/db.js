const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../data/jobtracker.db");
const db = new Database(dbPath);

// Create table for Users
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    applied_date TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`).run();

module.exports = db;
