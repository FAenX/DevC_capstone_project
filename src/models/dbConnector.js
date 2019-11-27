import pool from "../config/dbConfig";


/**
   * DB Query
   * @param {string} text
   * @param {object} params
   * @returns {object} object
   */
const query = (text, params) => new Promise((resolve, reject) => {
  pool.query(text, params)
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
});

export default query;
