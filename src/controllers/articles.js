import uuidv1 from "uuid/v1";
import { saveArticle, findAllArticles, findOneArticle } from "../models/articles";


exports.createArticle = (request, response) => {
  const {
    title, article, fkUserId, createdOn,
  } = request.body;
  const id = uuidv1();
  saveArticle([id, title, article, createdOn, fkUserId]).then((data) => {
    response.status(200).send({
      status: "success",
      data,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error,

    });
  });
};

exports.getAllArticles = (request, response) => {
  findAllArticles().then((articles) => {
    response.status(200).send({
      status: "success",
      data: articles,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error,

    });
  });
};

exports.getArticleById = (request, response) => {
  const { id } = request.params;

  findOneArticle([id]).then((article) => {
    console.log(article);
    response.status(200).send({
      status: "success",
      data: article,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error,

    });
  });
};

exports.editArticle = (request, response) => {
  const { title, article } = request.body;
  const values = [title, article, id];
  console.log(values);
};


exports.deleteArticle = (request, response) => {
  const id = parseInt(request.params.id);
  const values = [id];
  console.log(id);
};
