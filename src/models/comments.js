import query from "./dbConnector";

exports.findOneComment = (value) => {
  const queryText = "SELECT * FROM comments WHERE id=$1";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => err);
  return row;
};

exports.findAllComments = () => {
  const queryText = "SELECT * FROM comments";
  const rows = query(queryText, [])
    .then((res) => res.rows)
    .catch((err) => err);
  return rows;
};

exports.saveComment = (values) => {
  const queryText = `INSERT INTO
      comments (id, comment, createdOn, authorId, articleid, gifid)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const row = query(queryText, values)
    .then((res) => res.rows[0])
    .catch((error) => error);
  return row;
};

exports.editComment = (values) => {
  const queryText = "UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *";
  const rows = query(queryText, values)
    .then((res) => res.rows)
    .catch((err) => err);
  return rows;
};


exports.deleteComment = (value) => {
  const queryText = "DELETE FROM comments WHERE ID=$1 RETURNING *";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => {
      throw err;
    });
  return row;
};
