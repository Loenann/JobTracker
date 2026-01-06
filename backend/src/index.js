const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/applications", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM job_applications")
    .all();
  res.json(rows);
});
app.post("/applications", (req, res) => {
    const {company, role, status, applied_date} = req.body;
    const appliedDate = req.body.applied_date || new Date().toISOString().split("T")[0];
    const stmt = db.prepare(
        "INSERT INTO job_applications (company, role, status, applied_date) VALUES (?, ?, ?, ?)"
    )
    const info = stmt.run(company, role, status, appliedDate);

    res.json({
        id: info.lastInsertRowid,
        company,
        role,
        status,
        applied_date: appliedDate,
    });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
