import jwt from "jsonwebtoken";


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const { userId } = decodedToken;

    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).send({ error: "Invalid user ID" });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request"),
    });
  }
};
