import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const hostname = "127.0.0.1";
const port = 3000;

const CURRENT_DIR = path.dirname("pages");

let nextId = 1;
const headphonesList = [];

// Trial Home Page
app.get("/", (_, res) => {
  const filePath = path.join(CURRENT_DIR, "pages/home.html");
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  res.status(200).setHeader("Content-Type", "text/html").send(content);
});

// Get all headphones
app.get("/headphones", (_, res) => {
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .send(headphonesList);
});

// Create a new headphone
app.post("/headphones/add", (req, res) => {
  if (!req.body) {
    return res.status(404).send("Not OK");
  }

  const { name, price } = req.body;
  const newHeadphone = { id: nextId++, name, price };
  headphonesList.push(newHeadphone);
  res
    .status(201)
    .setHeader("Content-Type", "application/json")
    .send(newHeadphone);
});

app.listen(port, hostname, () => {
  console.log(`Server is running on port http://${hostname}:${port}`);
});
