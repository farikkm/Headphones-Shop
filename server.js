import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const CURRENT_DIR = path.dirname("pages");

app.get("/", (_, res) => {
  const filePath = path.join(CURRENT_DIR, "pages/home.html");
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  res.status(200).setHeader("Content-Type", "text/html").send(content);
});

app.listen(port, hostname, () => {
  console.log(`Server is running on port http://${hostname}:${port}`);
});
