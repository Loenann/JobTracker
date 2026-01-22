require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

console.log("Connecting to Postgres:", process.env.DB_HOST, process.env.DB_NAME);

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ======================
   JOB APPLICATIONS
====================== */

app.get("/applications", auth, async (req, res) => {
  const result = await db.query(
    "SELECT * FROM job_applications WHERE user_id = $1",
    [req.userId]
  );
  res.json(result.rows);
});

app.get("/applications/:id", auth, async (req, res) => {
  const { id } = req.params;

  const result = await db.query(
    "SELECT * FROM job_applications WHERE id = $1 AND user_id = $2",
    [id, req.userId]
  );

  const job = result.rows[0];

  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found or unauthorized" });
  }
});

app.post("/applications", auth, async (req, res) => {
  const { company, role, status, applied_date } = req.body;
  const appliedDate =
    applied_date || new Date().toISOString().split("T")[0];

  const result = await db.query(
    `
    INSERT INTO job_applications
      (company, role, status, applied_date, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `,
    [company, role, status, appliedDate, req.userId]
  );

  res.json({
    id: result.rows[0].id,
    company,
    role,
    status,
    applied_date: appliedDate,
  });
});

app.delete("/applications/:id", auth, async (req, res) => {
  const { id } = req.params;

  const result = await db.query(
    "DELETE FROM job_applications WHERE id = $1 AND user_id = $2",
    [id, req.userId]
  );

  if (result.rowCount > 0) {
    res.json({ success: true, id });
  } else {
    res
      .status(404)
      .json({ success: false, message: "Job not found or unauthorized" });
  }
});

app.put("/applications/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { company, role, status, applied_date } = req.body;

  const result = await db.query(
    `
    UPDATE job_applications
    SET company = $1, role = $2, status = $3, applied_date = $4
    WHERE id = $5 AND user_id = $6
    `,
    [company, role, status, applied_date, id, req.userId]
  );

  if (result.rowCount === 0) {
    return res
      .status(404)
      .json({ error: "Job not found or unauthorized" });
  }

  res.json({
    id,
    company,
    role,
    status,
    applied_date,
  });
});

/* ======================
   AUTH
====================== */

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3)",
      [email, username, hash]
    );

    res.json({ success: true });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Email or Username already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const result = await db.query(
    "SELECT * FROM users WHERE email = $1 OR username = $1",
    [identifier]
  );

  const user = result.rows[0];

  if (!user)
    return res.status(401).json({ error: "Invalid Credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid)
    return res.status(401).json({ error: "Invalid Credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
