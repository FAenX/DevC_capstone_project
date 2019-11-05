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

exports.createGif = (request, response) => {
  const url = `${request.protocol}://${request.get("host")}`;
  const { title, comment, userId } = request.body;
  const imageUrl = `${url}/images/${request.file.filename}`;


  const query = "INSERT INTO gifs(title, gif_comment, url, user_id) VALUES($1,$2,$3,$4) RETURNING *";
  const values = [
    title,
    comment,
    imageUrl,
    userId,
  ];
  pool.query(query, values, (err, result) => {
    if (err) {
      response.status(400).send({
        status: "error",
        err,
      });
    } else {
      response.status(202).send({
        status: "success",
        data: result.rows[0],

      });
    }
  });
};

exports.getAllGifs = (request, response) => {
  pool.query("SELECT * FROM gifs", (error, result) => {
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
};

exports.getGif = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM gifs WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(400).send({
        status: "error",
        error,
      });
    }
    response.status(200).send({
      status: "success",
      data: results.rows,
    });
  });
};

exports.deleteGif = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM gifs WHERE id = $1", [id], (error) => {
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

exports.patchGif = (request, response) => {
  const id = parseInt(request.params.id);
  const { comment } = request.body;

  pool.query("UPDATE gifs SET gif_comment = $1 WHERE id = $2", [comment, id], (error) => {
    if (error) {
      response.status(400).send({
        status: "error",
        error,
      });
    }
    response.status(200).send({
      status: "success",
      data: `new comment: ${comment}`,
    });
  });
};
