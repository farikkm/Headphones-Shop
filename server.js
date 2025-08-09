import express from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";

import 'dotenv/config'

import logger from "./logger.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const CURRENT_DIR = path.dirname("pages");
const morganFormat = ":method :url :status :response-time ms";

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      logger.info(JSON.stringify(logObject))
    }
  },  
}))

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
  logger.info("Getting all headphones")
  
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .send(headphonesList);
});

// Create a new headphone
app.post("/headphones/add", (req, res) => {
  logger.info("Adding a new headphone")

  if (!req.body) {
    return res.status(404).send("Not OK");
  }

  const { name, price } = req.body;
  const newHeadphone = { id: nextId++, name, price, successMessage: "Response is Ok" };
  headphonesList.push(newHeadphone);
  res
    .status(201)
    .setHeader("Content-Type", "application/json")
    .send(newHeadphone);
});

// Update the headphone
app.put("/headphones/update/:id", (req, res) => {
  logger.warn("Updating an existing headphone")

  if (!req.body) {
    return res.status(404).send("Not OK");
  }

  const { name, price } = req.body;

  const headphone = headphonesList.find(
    (h) => h.id === parseInt(req.params.id)
  );

  if (headphone === -1) {
    logger.error("Headphone not found");
    return res.status(404).send("Headphone not found");
  }

  headphone.name = name;
  headphone.price = price;

  res.status(204).end();
});

// Delete the headphone
app.delete("/headphones/delete/:id", (req, res) => {
  logger.warn("Deleting an existing headphone")

  const headphoneIdx = headphonesList.findIndex(
    (h) => h.id === parseInt(req.params.id)
  );

  if (headphoneIdx === -1) {
    logger.error("Headphone not found");
    return res.status(404).setHeader("Content-Type", "text/plain").send("Headphone not found");
  }

  headphonesList.splice(headphoneIdx, 1);
  res.status(204).setHeader("Content-Type", "text/xml").end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
