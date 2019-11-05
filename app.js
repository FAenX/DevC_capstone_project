import path from "path";
import express from "express";
import bodyParser from "body-parser";

import userRoutes from "./routes/users";
import gifRoutes from "./routes/gifs";

const app = express();


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/gifs/", gifRoutes);


module.exports = app;
