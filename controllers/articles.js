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

exports.createArticle = (request, response) => {
  const { title, body, userId } = request.body;

  const query = "INSERT INTO articles(title, body, user_id) VALUES($1, $2, $3) RETURNING *";
  const values = [title, body, userId];

  pool.query(query, values, (err, result) => {
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
};

exports.getAllArticles = (request, response) => {
  const query = "SELECT * FROM articles";

  pool.query(query, (err, result) => {
    if (err) {
      response.status(400).send({
        status: "error",
        err: err.stack,
      });
    } else {
      response.status(200).send({
        status: "success",
        data: result.rows,

      });
    }
  });
};

exports.getArticleById = (request, response) => {
  const query = "SELECT * FROM articles WHERE id = $1";
  const id = parseInt(request.params.id);
  const values = [id];

  pool.query(query, values, (err, result) => {
    if (err) {
      response.status(400).send({
        status: "error",
        err: err.stack,
      });
    } else {
      response.status(200).send({
        status: "success",
        data: result.rows[0],

      });
    }
  });
};

exports.editArticle = (request, response) => {
  const query = "UPDATE articles SET title = $1, body = $2 WHERE id = $3 RETURNING *";
  const id = parseInt(request.params.id);
  const { title, body } = request.body;
  const values = [title, body, id];

  pool.query(query, values, (err, result) => {
    if (err) {
      response.status(400).send({
        status: "error",
        err: err.stack,
      });
    } else {
      response.status(200).send({
        status: "success",
        data: result.rows[0],

      });
    }
  });
};


exports.deleteArticle = (request, response) => {
  const query = "DELETE FROM articles WHERE id = $1";
  const id = parseInt(request.params.id);

  const values = [id];

  pool.query(query, values, (err, result) => {
    if (err) {
      response.status(400).send({
        status: "error",
        err: err.stack,
      });
    } else {
      response.status(204).send({
        status: "success",
        data: `Article deleted with ID: ${id}`,

      });
    }
  });
};
