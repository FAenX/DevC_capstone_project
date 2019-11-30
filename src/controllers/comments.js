import uuidv1 from "uuid/v1";
import {
  saveComment, findAllComments, findOneComment, editComment, deleteComment,
} from "../models/comments";


exports.createComment = (request, response) => {
  const {
    comment, userId, createdOn, testArticleId, gifId,
  } = request.body;
  const id = uuidv1();
  saveComment([id, comment, createdOn, userId, testArticleId, gifId]).then((data) => {
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

exports.getAllComments = (request, response) => {
  findAllComments().then((comments) => {
    response.status(200).send({
      status: "success",
      data: comments,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error,

    });
  });
};

exports.getCommentById = (request, response) => {
  const { id } = request.params;
  findOneComment([id]).then((comment) => {
    response.status(200).send({
      status: "success",
      data: comment,
    });
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error,

    });
  });
};

exports.editComment = (request, response) => {
  const { comment, id, userId } = request.body;
  const values = [comment, id];
  findOneComment([id]).then((comm) => {
    const { authorid } = comm;
    if (userId === authorid) {
      editComment(values).then((res) => {
        response.status(200).send({
          status: "success",
          data: res,
        });
      }).catch((error) => {
        response.status(400).send({
          status: "error",
          data: error,

        });
      });
    }
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error,
    });
  });
};


exports.deleteComment = (request, response) => {
  const { id } = request.params;
  const { userId, isStaff } = request.body;
  findOneComment([id]).then((comm) => {
    const { authorid } = comm;
    if (userId === authorid || isStaff) {
      deleteComment([id]).then((comments) => {
        response.status(200).send({
          status: "success",
          data: comments,
        });
      }).catch((error) => {
        response.status(400).send({
          status: "error",
          data: error,

        });
      });
    }
  }).catch((error) => {
    response.status(400).send({
      status: "error",
      data: error,

    });
  });
};
