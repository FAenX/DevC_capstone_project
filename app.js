import { path, resolve } from "path";
import express from "express";
import { urlencoded, json } from "body-parser";

import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { cloudinaryConfig } from "./cloudinaryConfig";


import userRoutes from "./routes/users";
import gifRoutes from "./routes/gifs";

dotenv.config();

const app = express();


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(urlencoded({ extended: false }));
app.use("*", cloudinaryConfig);

app.use(json());

// app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/gifs/", gifRoutes);

export default app;
