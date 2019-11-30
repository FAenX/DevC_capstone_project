import query from "./dbConnector";

exports.findOneGif = (value) => {
  const queryText = "SELECT * FROM gifs WHERE id=$1";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => err);
  return row;
};

exports.findAllGifs = () => {
  const queryText = "SELECT * FROM gifs";
  const rows = query(queryText, [])
    .then((res) => res.rows)
    .catch((err) => {
      throw err;
    });
  return rows;
};

exports.saveGif = (values) => {
  const queryText = `INSERT INTO
      gifs (id, title, gifurl, createdOn, userid)
      VALUES ($1, $2, $3, $4, $5)`;
  return query(queryText, values);
};

exports.deleteGif = (value) => {
  const queryText = "DELETE FROM gifs WHERE ID=$1 RETURNING *";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => {
      throw err;
    });
  return row;
};
