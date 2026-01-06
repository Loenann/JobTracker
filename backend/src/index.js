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
app.get("/applications/:id", (req, res) => {
  const { id } = req.params;
  const job = db.prepare("SELECT * FROM job_applications WHERE id = ?").get(id);

  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
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
app.delete("/applications/:id", (req, res) =>{
    const { id } = req.params;

    const stmt = db.prepare("Delete FROM job_applications WHERE id = ?");
    const info = stmt.run(id);

    if(info.changes>0){
        res.json({success: true, id})
    } else {
        res.status(404).json({success: false, message: "Job not found"});
    }
});
app.put("/applications/:id", (req, res) => {
  const {id} = req.params;
  const {company, role, status, applied_date} = req.body;

  const stmt = db.prepare(`
    UPDATE job_applications
    SET company = ?, role = ?, status = ?, applied_date = ?
    WHERE id = ?
  `);
  
  const result = stmt.run(company, role, status, applied_date, id);

  if (result.changes === 0){
    return res.status(404).json({error: "job not found"});
  }

  res.json({
    id: Number(id),
    company,
    role,
    status,
    applied_date,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
