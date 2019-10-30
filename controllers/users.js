import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import { pool } from '../services/db';


exports.viewAllUsers = (request, response, next) => {
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM users';
    client.query(query, (error, result) => {
      done();
      if (error) {
        response.status(400).json({ error });
      } else if (result.rows < '1') {
        response.status(404).send({
          status: 'Failed',
          message: 'No user information found',
        });
      } else {
        response.status(200).send({
          status: 'Successful',
          message: 'Users Information retrieved',
          students: result.rows,
        });
      }
    });
  });
};


exports.createUser = (request, response) => {
  const data = {
    firstName: request.body.first_name,
    lastName: request.body.last_name,
    userName: request.body.username,
    email: request.body.email,
    password: request.body.password,
  };
  console.log(request.body.email);
  console.log(data);

  pool.connect((error, client, done) => {
    const query = 'INSERT INTO users(first_name, last_name, username, email, password) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const values = [data.firstName, data.lastName, data.userName, data.email, data.password];

    client.query(query, values, (error, result) => {
      done();
      if (error) {
        response.status(400).json({ error });
      } else {
        response.status(202).send({
          status: 'SUccessful',
          result: result.rows[0],

        });
      }
    });
  });
};

exports.getUserById = (request, response, next) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw (error);
    }
    response.status(200).json(results.rows);
  });
};

exports.modifyUser = (request, response, next) => {
  const id = parseInt(request.params.id);
  const { username, email } = request.body;

  pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE id = $3',
    [username, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    },
  );
};

exports.deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}