require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

app.get("/applications", auth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM job_applications WHERE user_id = ?")
    .all(req.userId);
  res.json(rows);
});
app.get("/applications/:id", auth, (req, res) => {
  const { id } = req.params;
  const job = db
    .prepare("SELECT * FROM job_applications WHERE id = ? AND user_id = ?")
    .get(id, req.userId);

  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found or unauthorized"});
  }
});
app.post("/applications", auth,(req, res) => {
    const {company, role, status, applied_date} = req.body;
    const appliedDate = req.body.applied_date || new Date().toISOString().split("T")[0];
    const info = db.prepare(
        "INSERT INTO job_applications (company, role, status, applied_date, user_id) VALUES (?, ?, ?, ?, ?)"
    ).run(company, role, status, appliedDate, req.userId);

    res.json({
        id: info.lastInsertRowid,
        company,
        role,
        status,
        applied_date: appliedDate,
    });
});
app.delete("/applications/:id", auth, (req, res) =>{
    const { id } = req.params;

    const stmt = db.prepare("Delete FROM job_applications WHERE id = ? AND user_id = ?");
    const info = stmt.run(id, req.user_Id);

    if(info.changes>0){
        res.json({success: true, id})
    } else {
        res.status(404).json({success: false, message: "Job not found or unauthorized"});
    }
});
app.put("/applications/:id", auth, (req, res) => {
  const {id} = req.params;
  const {company, role, status, applied_date} = req.body;

  const stmt = db.prepare(`
    UPDATE job_applications
    SET company = ?, role = ?, status = ?, applied_date = ?
    WHERE id = ? AND user_id = ?
  `);
  
  const result = stmt.run(company, role, status, applied_date, id);

  if (result.changes === 0){
    return res.status(404).json({error: "job not found or unauthorized"});
  }

  res.json({
    id: Number(id),
    company,
    role,
    status,
    applied_date,
  });
});
app.post("/register", async (req, res) =>{
  const {email, password} = req.body;
  
  const hash = await bcrypt.hash(password, 10);

  try{
    db.prepare(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)"
    ).run(email, hash);

    res.json({success: true});
  } catch {
    res.status(400).json({error: "User already exists"});
  }
});
app.post("/login", async (req, res) =>{
  const {email, password} = req.body;
  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);
  
  if (!user) return res.status(401).json({error: "Invalid Credentials"});
  
  const valid = await bcrypt.compare(password, user.password_hash);
  
  if (!valid) return res.status(401).json({error: "Invalid Credentials"});

  const token = jwt.sign({userId: user.id}, JWT_SECRET,{
    expiresIn: "1h",
  });

  res.json({token});
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
