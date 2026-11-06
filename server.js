const express = require("express"), fs = require("fs"), path = require("path");
const app = express(), FILE = path.join(__dirname, "data.json");
const MODES = ["quiz", "el", "mm", "bal", "match", "daily"];
let db = {}; try { db = JSON.parse(fs.readFileSync(FILE)); } catch (e) {}
const hits = {};
app.set("trust proxy", 1);
app.use(express.json({ limit: "1kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/leaderboard", (req, res) => {
  const m = req.query.mode;
  if (!MODES.includes(m)) return res.status(400).json({ error: "Bad mode" });
  res.json((db[m] || []).slice(0, 10));
});

app.post("/api/score", (req, res) => {
  const now = Date.now();
  if (hits[req.ip] && now - hits[req.ip] < 5000) return res.status(429).json({ error: "Slow down a bit" });
  hits[req.ip] = now;
  let { name, mode, score } = req.body || {};
  name = String(name || "").replace(/[<>&"']/g, "").trim().slice(0, 16);
  score = Math.floor(+score);
  if (!name || !MODES.includes(mode) || !(score > 0 && score <= 400)) return res.status(400).json({ error: "Invalid score" });
  const list = (db[mode] = db[mode] || []);
  list.push({ name, score, date: new Date().toISOString().slice(0, 10) });
  list.sort((a, b) => b.score - a.score);
  db[mode] = list.slice(0, 50);
  fs.writeFile(FILE, JSON.stringify(db), () => {});
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => console.log("ChemEase running"));
