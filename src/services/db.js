import pg from "pg";

const config = {
  host: "devc-capstone-project.ce9guunrhjao.us-east-2.rds.amazonaws.com",
  user: "postgres",
  database: "DevC_capstone_project",
  password: "6LppV5MJQ0sXh5M1mt2R",
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};


const pool = new pg.Pool(config);

pool.on("connect", () => {
  console.log("connected to the Database");
});

exports.createTables = () => {
  const users = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        gender VARCHAR(128) NOT NULL,
        job_role VARCHAR(128) NOT NULL,
        department VARCHAR(128) NOT NULL,
        address VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        is_staff BOOLEAN
      )`;

  const comments = `CREATE TABLE IF NOT EXISTS
      comments(
        id SERIAL PRIMARY KEY,
        comment VARCHAR(128) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        article_id INTEGER REFERENCES articles(id),
        gif_id INTEGER REFERENCES gifs(id)   

      )`;

  const gifs = `CREATE TABLE IF NOT EXISTS gifs (
        id SERIAL PRIMARY KEY, 
        user_id INTEGER REFERENCES users(id),
        url VARCHAR,
        created_on VARCHAR NOT NULL,
        title VARCHAR NOT NULL
      )`;

  const articles = `CREATE TABLE IF NOT EXISTS
    articles(
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        article VARCHAR NOT NULL,
        created_on VARCHAR NOT NULL,
        user_id INTEGER REFERENCES users(id)
      )`;

  pool.query(users).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });

  pool.query(gifs).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });

  pool.query(comments).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });

  pool.query(articles).then((res) => {
    console.log(res);
    pool.end();
  }).catch((err) => {
    console.log(err);
    pool.end();
  });
};
pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});


require("make-runnable");
