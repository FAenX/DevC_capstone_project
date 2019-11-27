import { saveGif, findAllGifs } from "../models/gifs";

exports.createGif = (request, response) => {
  const {
    title, userId, createdOn,
  } = request.body;

  console.log(request.body);
  response.status(200).send({
    status: "success",
    data: [],
  });
};

exports.getAllGifs = (request, response) => {
  findAllGifs().then((gifs) => {
    console.log(gifs);
    response.status(200).send({
      status: "success",
      data: [],
    });
  }).catch((error) => {
    response.status(400).send({
      status: "success",
      data: error.stack,
    });
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
      data: results.rows[0],
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
