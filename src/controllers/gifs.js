import path from "path";
import Datauri from "datauri";
import uuidv1 from "uuid/v1";
import {
  saveGif, findAllGifs, findOneGif, deleteSingleGif,
} from "../models/gifs";
import uploader from "../config/cloudinaryConfig";

const dUri = new Datauri();
const dataUri = (req) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

exports.createGif = (request, response) => {
  // console.log(request);
  if (request.file) {
    const file = dataUri(request).content;

    uploader.upload(file).then((result) => {
      const gifUrl = result.url;

      const {
        title, userId, createdOn,
      } = request.body;

      const id = uuidv1();

      const values = [id, title, gifUrl, createdOn, userId];
      saveGif(values).then((data) => {
        response.status(200).send({
          status: "success",
          data: {
            id,
            title,
            userId,
            createdOn,
            gifUrl,
          },
        });
      }).catch((error) => {
        response.status(400).send({
          status: "error",
          data: {
            error,
          },
        });
      });
    }).catch((error) => {
      response.status(500).send({
        status: "error",
        data: {
          error,
        },
      });
    });
  }
  console.log("file not found");
};

exports.getAllGifs = (request, response) => {
  findAllGifs().then((gifs) => {
    response.status(200).send({
      status: "success",
      data: gifs,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error.stack,
    });
  });
};


exports.getGif = (request, response) => {
  const { id } = request.params;
  findOneGif([id]).then((gif) => {
    response.status(200).send({
      status: "success",
      data: gif,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error.stack,
    });
  });
};

exports.deleteGif = (request, response) => {
  const { id } = request.params;
  deleteSingleGif([id]).then((gif) => {
    response.status(200).send({
      status: "success",
      data: gif,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error.stack,
    });
  });
};
