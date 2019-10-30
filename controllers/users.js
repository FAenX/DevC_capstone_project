import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import { pool } from '../services/db';

exports.viewAll = (req, res, next) => {
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM users';
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      } else if (result.rows < '1') {
        res.status(404).send({
          status: 'Failed',
          message: 'No student information found',
        });
      } else {
        res.status(200).send({
          status: 'Successful',
          message: 'Students Information retrieved',
          students: result.rows,
        });
      }
    });
  });
};


exports.createUser = (req, res) => {
  const data = {
    name: req.body.studentName,
    age: req.body.studentAge,
    classroom: req.body.studentClass,
    parents: req.body.parentContact,
    admission: req.body.admissionDate,
  };
  console.log(req.body.studentAge);
  console.log(data);

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO students(student_name,student_age, student_class, parent_contact, admission_date) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const values = [data.name, data.age, data.classroom, data.parents, data.admission];

    client.query(query, values, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(202).send({
          status: 'SUccessful',
          result: result.rows[0],

        });
      }
    });
  });
};
