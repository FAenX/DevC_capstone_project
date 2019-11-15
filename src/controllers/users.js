/* eslint-disable no-console */
/* eslint-disable radix */
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

exports.token = (request, response) => {
  const userEmail = request.body.email;
  const userPassword = request.body.password;

  // check if user is a registered user
  pool.query("SELECT * FROM users WHERE email = $1", [userEmail], (error, results) => {
    if (error) {
      throw (error);
    } else if (results.rows < 1) {
      response.status(401).send({
        status: "error",
        data: {
          message: "User does not exist",
        },
      });
    } else {
      const { email, password, id } = results.rows[0];

      // compared saved hashed password to supplied password
      bcrypt.compare(userPassword, password).then(
        (valid) => {
          if (!valid) {
            response.status(401).send({
              status: "error",
              error: "Incorrect password",
            });
          }
          const token = jwt.sign(
            { email },
            "RANDOM_TOKEN_SECRET",
            { expiresIn: "24h" },
          );

          // respond with jwt token
          response.status(200).send({
            status: "success",
            data: {
              userId: id,
              email,
              token,
            },
          });
        },
      ).catch(
        (err) => response.status(500).send({
          status: "error",
          err,
        }),
      );
    }
  });
};

// create user
exports.createUser = (request, response) => {
  const data = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    gender: request.body.gender,
    jobRole: request.body.jobRole,
    department: request.body.department,
    address: request.body.address,
    email: request.body.email,
    password: request.body.password,
    isStaff: request.body.isStaff,
  };


  // hash password before saving
  bcrypt.hash(request.body.password, 10).then(
    (hash) => {
      const query = "INSERT INTO users(first_name, last_name, gender, email, job_role, department, address, password, is_staff) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *";
      const values = [
        data.firstName,
        data.lastName,
        data.gender,
        data.email,
        data.jobRole,
        data.department,
        data.address,
        hash,
        data.isStaff,
      ];
      pool.query(query, values, (err, result) => {
        if (err) {
          response.status(400).send({
            status: "error",
            data: err.stack,
          });
        } else {
          const token = jwt.sign(
            { email: result.rows[0].email },
            "RANDOM_TOKEN_SECRET",
            { expiresIn: "24h" },
          );
          response.status(202).send({
            status: "success",
            data: {
              message: "User account successfully created",
              token,
              userId: result.rows[0].id,
            },

          });
        }
      });
    },

  ).catch(
    (error) => {
      response.status(500).send({
        status: "error",
        data: error,
      });
    },
  );
};

exports.viewAllUsers = (request, response) => {
  pool.connect((err, client, done) => {
    const query = "SELECT * FROM users";
    client.query(query, (error, result) => {
      done();
      if (error) {
        response.status(400).send({
          status: "error",
          error,
        });
      } else if (result.rows < "1") {
        response.status(200).send({
          status: "success",
          data: [],
        });
      } else {
        response.status(200).send({
          status: "success",
          data: result.rows,
        });
      }
    });
  });
};

exports.getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(400).send({
        status: "error",
        data: error.stack,
      });
    }
    response.status(200).send({
      status: "success",
      data: results.rows[0],
    });
  });
};

exports.modifyUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { firstName, lastName } = request.body;

  pool.query(
    "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3", [firstName, lastName, id],
    (error) => {
      if (error) {
        response.status(400).send({
          status: "error",
          error: error.stack,
        });
      }
      response.status(200).send({
        status: "success",
        data: `User modified with ID: ${id}`,
      });
    },
  );
};

exports.deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error) => {
    if (error) {
      response.status(400).send({
        status: "error",
        error,
      });
    }
    response.status(200).send({
      status: "success",
      data: `User deleted with ID: ${id}`,
    });
  });
};
