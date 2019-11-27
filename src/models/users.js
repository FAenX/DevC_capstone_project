import query from "./dbConnector";


exports.findOne = (value) => {
  const queryText = "SELECT * FROM users WHERE storeduseremail = $1";
  const user = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => {
      throw err;
    });
  return user;
};

exports.save = (values) => {
  const queryText = "INSERT INTO users(id, firstname, lastname, storeduseremail, hashedpassword, gender,  jobrole, department, address,  isstaff) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *";
  const row = query(queryText, values)
    .then((res) => res.rows[0])
    .catch((err) => {
      throw err;
    });
  return row;
};
