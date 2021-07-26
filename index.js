const express = require("express");
const app = express();
const mysql = require("mysql");
const faker = require("faker");

app.set("view engine", "ejs");

const port = 3000;
const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

function createPerson() {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config);
    const randomName = faker.name.findName();
    const sql = `insert into people(name) values ('${randomName}');`;
    connection.query(sql, (err, rows) => {
      connection.end();
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getPerson() {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config);
    const sql = `select * from people;`;
    connection.query(sql, (err, rows) => {
      connection.end();
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

app.get("/", async (req, res) => {
  try {
    await createPerson();
    const people = await getPerson();
    res.render("index", { people });
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
