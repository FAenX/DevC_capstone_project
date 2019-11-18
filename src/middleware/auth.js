import jwt from "jsonwebtoken";
import pg from "pg";
import bcrypt from "bcrypt";

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

    if (req.body.email && req.body.email !== email) {
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
          data: error.stack,
        });
      } else if (result.rows < 1) {
        res.status(401).send({
          status: "error",
          data: {
            message: "User does not exist",
          },
        });
      } else if (result.rows[0].is_staff !== true) {
        res.status(401).send({
          status: "error",
          data: {
            message: "Access denied, you should be admin to create user",
          },
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
