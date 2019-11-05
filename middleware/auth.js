import jwt from "jsonwebtoken";


exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const { userId } = decodedToken;

    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).send({
        status: "error",
        error: "access denied",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      status: "error",
      error: "access denied",
    });
  }
};

exports.isStaff = (req, res, next) => {
  try {
    const Staff = req.headers.authorization.split(" ")[1];
    if (Staff === "false") {
      res.status(401).send({
        status: "error",
        error: "access denied",
      });
    } else {
      next();
    }
  } catch (erro) {
    res.status(400).send({
      status: "error",
      error: "invalid request",
    });
  }
};
