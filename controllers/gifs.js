import pg from "pg";
import { dataUri } from "../middleware/multerUpload";
import { uploader } from "../cloudinaryConfig";

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
  if (request.file) {
    const file = dataUri(request).content;
    return uploader.upload(file).then((result) => {
      const image = result.url;

      const {
        title, userId,
      } = request.body;

      const query = "INSERT INTO gifs(title, url, user_id) VALUES($1,$2,$3) RETURNING *";
      const values = [
        title,
        image,
        userId,
      ];

      (async () => {
        const client = await pool.connect();
        try {
          const res = await client.query(query, values);
          return response.status(200).json({
            status: "success",
            data: {
              imageUrl: image,
              gifId: res.rows[0].id,
              messge: "Your image has been uploded successfully to cloudinary",
              createdOn: res.rows[0].created_on,
            },
          });
        } finally {
          // Make sure to release the client before any error handling,
          // just in case the error handling itself throws an error.
          client.release();
        }
      })().catch((e) => console.log(e.stack));
    }).catch((err) => response.status(400).json({
      messge: "someting went wrong while processing your request",
      data: {
        err,
      },
    }));
  }
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
      data: {
        message: "Gif deleted successfully",
      },
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
