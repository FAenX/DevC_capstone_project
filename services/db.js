/* const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'devc-capstone-project.ce9guunrhjao.us-east-2.rds.amazonaws.com',
    database: 'DevC_capstone_project',
    password: '6LppV5MJQ0sXh5M1mt2R',
    port: 5432,
  })
  
client.connect();
  
  
module.exports = client;   */

import pg from "pg";

const config = {
  host: 'devc-capstone-project.ce9guunrhjao.us-east-2.rds.amazonaws.com',
  user: 'postgres',
  database: 'DevC_capstone_project',
  password: '6LppV5MJQ0sXh5M1mt2R',
  port: 5432,
  max: 10, 
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const createUsersTable =  () => {
  const users = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        username VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL
      )`;

      return pool.query(users)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createCommentsTable =()=>{
    const comments = `CREATE TABLE IF NOT EXISTS
      comments(
        id SERIAL PRIMARY KEY,
        comment VARCHAR(128) NOT NULL,
        FOREIGN KEY (user) REFERENCES users (id) NOT NULL,
        FOREIGN KEY (gif) REFERENCES gifs (id) NULL,
        FOREIGN KEY (article) REFERENCES articles (id)  NULL,     

      )`;

    return pool.query(comments)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

}

const createGifsTable =()=>{
    const gifs = `CREATE TABLE IF NOT EXISTS
      gifs(
        id SERIAL PRIMARY KEY,
        address VARCHAR(128) NOT NULL,
        FOREIGN KEY (user) REFERENCES users (id)

      )`;       

  return pool.query(gifs)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createArticlesTable =()=>{
  const articles = `CREATE TABLE IF NOT EXISTS
    articles(
      id SERIAL PRIMARY KEY,
      article VARCHAR(128) NOT NULL,
      FOREIGN KEY (user) REFERENCES users (id),


    )`;       

return pool.query(gifs)
  .then((res) => {
    console.log(res);
    pool.end();
  })
  .catch((err) => {
    console.log(err);
    pool.end();
  });
};



pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


//export pool and createTables to be accessible  from an where within the application
module.exports = {
  createUsersTable,
  createCommentsTable,
  createGifsTable,
  pool,
};

require('make-runnable');

