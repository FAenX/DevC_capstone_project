import jwt from "jsonwebtoken";


exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const { userId } = decodedToken;

    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).send({
        status: "error",
        data: "access denied",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      data: "Bad request",
    });
  }
};

exports.isStaff = (req, res, next) => {
  try {
    const Staff = req.headers.authorization.split(" ")[1];
    if (Staff === "false") {
      res.status(401).send({
        status: "error",
        data: "access denied, you should be admin to create user",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      data: "You have not includes any authentication",
    });
  }
};
