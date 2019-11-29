import query from "./dbConnector";

exports.findOneArticle = (value) => {
  const queryText = "SELECT * FROM articles WHERE id=$1";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => err);
  return row;
};

exports.findAllArticles = () => {
  const queryText = "SELECT * FROM articles";
  const rows = query(queryText, [])
    .then((res) => res.rows)
    .catch((err) => err);
  return rows;
};

exports.saveArticle = (values) => {
  const queryText = `INSERT INTO
      articles (id, title, article, createdOn, authorId)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const row = query(queryText, values)
    .then((res) => res.rows)
    .catch((error) => error);
  return row;
};

exports.deleteArticle = (value) => {
  const queryText = "DELETE FROM gifs WHERE ID=$1 RETURNING *";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => {
      throw err;
    });
  return row;
};
