import query from "./dbConnector";

exports.findOneArticles =(value)=> {
    const queryText = 'SELECT * FROM gifs WHERE ID=$1';
    const row = query(queryText, value)
      .then((res) => res.rows[0])
      .catch((err) => {
        throw err;
      });
    return row;
  };

exports.findAllArticles=() =>{
    const queryText = 'SELECT * FROM articles';
    const rows = query(queryText, [])
      .then((res) => res.rows)
      .catch((err) => {
        throw err;
      });
    return rows;
  };

exports.saveArticles=(values)=> {
    const queryText = `INSERT INTO
      gifs (ID, title, gifURL, gifPublicId, createdOn, authorID)
      VALUES ($1, $2, $3, $4, $5, $6)`;
    return query(queryText, values);
  };

exports.deleteArticles=(value)=> {
    const queryText = 'DELETE FROM gifs WHERE ID=$1 RETURNING *';
    const row = query(queryText, value)
      .then((res) => res.rows[0])
      .catch((err) => {
        throw err;
      });
    return row;
  };