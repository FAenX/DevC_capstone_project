import jwt from "jsonwebtoken";


exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { cleanEmail } = decodedToken;

    if (req.body.email && req.body.email !== cleanEmail) {
      res.status(401).send({
        status: "error",
        data: "token failed to validate",
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

exports.isStaff = (req, response, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { isstaff } = decodedToken;

    if (!isstaff) {
      response.status(401).json({
        status: "error",
        data: "You must be admin",
      });
    } else if (isstaff) {
      next();
    } else {
      response.status(400).json({
        status: "error",
        data: "An error occured",
      });
    }
  } catch (err) {
    response.status(400).json({
      status: "error",
      data: err.stack,
    });
  }
};
