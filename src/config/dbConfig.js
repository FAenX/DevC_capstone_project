import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
let conn;

if (isProduction) {
  conn = "";
} else if (isDevelopment) {
  conn = `postgresql://${process.env.DEV_DB_USER}:${process.env.DEV_DB_PASSWORD}@${process.env.DEV_DB_HOST}:${process.env.DEV_DB_PORT}/${process.env.DEV_DATABASE}`;
} else {
  conn = "";
}

const pool = new Pool({
  connectionString: conn,
});

pool.on("error", (err, client) => {
  client.release();
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
