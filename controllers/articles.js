import pg from "pg";

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

exports.createArticle = (request, response) => {
  const { title, body, userId } = request.body;
  pool.connect((error, client, done) => {
    const query = "INSERT INTO users(title, body, userId) VALUES($1, $2, $3) RETURNING *";
    const values = [title, body, userId];

    client.query(query, values, (err, result) => {
      done();
      if (err) {
        response.status(400).send({
          status: "error",
          err: err.stack,
        });
      } else {
        response.status(202).send({
          status: "success",
          data: result.rows[0],

        });
      }
    });
  });
};
