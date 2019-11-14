import jwt from "jsonwebtoken";
import pg from "pg";

const config = {
  host: "devc-capstone-project.ce9guunrhjao.us-east-2.rds.amazonaws.com",
  user: "postgres",
  database: "DevC_capstone_project",
  password: "6LppV5MJQ0sXh5M1mt2R",
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};


const pool = new pg.Pool(config);


exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const { email } = decodedToken;

    if (req.body.email && req.body.userId !== email) {
      res.status(401).send({
        status: "error",
        data: "access denied",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      data: "Bad request",
    });
  }
};

exports.isStaff = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const { email } = decodedToken;


    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    pool.query(query, values, (error, result) => {
      if (error) {
        res.status(400).send({
          status: "error",
          error,
        });
      }
      if (req.body.email && req.body.userId !== email) {
        res.status(401).send({
          status: "error",
          data: "access denied",
        });
      } else {
        next();
      }
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      data: "Bad request",
    });
  }
};
