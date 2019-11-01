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

exports.login = (request, response, next) => {
  const userEmail = request.body.email;
  const userPassword = request.body.password;
  const isStaff = request.body.is_staff;

  pool.query("SELECT * FROM users WHERE email = $1", [userEmail], (error, results) => {
    if (error) {
      throw (error);
    }
    const { email, password, is_staff } = results.rows[0];

    bcrypt.compare(userPassword, password).then(
      (valid) => {
        if (!valid) {
          return response.status(401).json({
            message: "Incorrect password",
          });
        }
        const token = jwt.sign(
          { userId: email },
          "RANDOM_TOKEN_SECRET",
          { expiresIn: "24h" },
        );
        response.status(200).json({
          userId: email,
          token,
        });
      },
    ).catch(
      (err) => response.status(500).json({
        err,
      }),
    );
  });
};

exports.createUser = (request, response) => {
  const data = {
    firstName: request.body.first_name,
    lastName: request.body.last_name,
    userName: request.body.username,
    email: request.body.email,
    password: request.body.password,
    is_staff: request.body.is_staff,
  };


  let hashed;
  bcrypt.hash(request.body.password, 10).then(
    (hash) => {
      hashed = hash;
    },
  ).catch(
    (error) => {
      response.status(500).json({
        error,
      });
    },
  );


  pool.connect((error, client, done) => {
    const query = "INSERT INTO users(first_name, last_name, username, email, password, is_staff) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
    const values = [
      data.firstName,
      data.lastName,
      data.userName,
      data.email,
      hashed,
      data.is_staff,
    ];

    client.query(query, values, (err, result) => {
      done();
      if (err) {
        response.status(400).json({ err });
        console.log(err);
      } else {
        response.status(202).send({
          status: "Successful",
          result: result.rows[0],

        });
      }
    });
  });
};

exports.viewAllUsers = (request, response) => {
  pool.connect((err, client, done) => {
    const query = "SELECT * FROM users";
    client.query(query, (error, result) => {
      done();
      if (error) {
        response.status(400).json({ error });
      } else if (result.rows < "1") {
        response.status(200).send({
          status: "Successful",
          message: "Users Information retrieved",
          students: [],
        });
      } else {
        response.status(200).send({
          status: "Successful",
          message: "Users Information retrieved",
          students: result.rows,
        });
      }
    });
  });
};

exports.getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw (error);
    }
    response.status(200).json(results.rows);
  });
};

exports.modifyUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { username, email } = request.body;

  pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3",
    [username, email, id],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send({
        status: `User modified with ID: ${id}`,
      });
    },
  );
};

exports.deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send({
      status: `User deleted with ID: ${id}`,
    });
  });
};
