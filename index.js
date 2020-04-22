const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 8080;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = new sqlite3.Database('testDb', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

app.listen(PORT, function(){
  console.log(`App running on localhost:${PORT}`);
});

db.serialize(function() {
  // db.run(`CREATE TABLE IF NOT EXISTS users (
  //   id INTEGER PRIMARY KEY AUTOINCREMENT,
  //   name text,
  //   email text UNIQUE,
  //   password text
  // );`);

  // db.run(`DROP TABLE users `);

  // for (let i = 0; i < 10; i++) {
  //     db.run(`INSERT INTO users (id, name, email, password) VALUES(?,?, ?, ?)`, [i, `User${i}`, `User${i}@gmail.com`, `${i}_user${i}`]);
  // }

  // });

  // db.run(`CREATE TABLE IF NOT EXISTS articles (
  //   id INTEGER PRIMARY KEY AUTOINCREMENT,
  //   content TEXT NOT NULL
  // );`);

    // db.run(`DROP TABLE articles`);


//   for (let i = 0; i < 10; i++) {
//     db.run(`INSERT INTO articles (id,content) VALUES(?,?)`, [i, i + 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque quod nulla veritatis nisi beatae quos architecto in veniam officiis velit.']);
// }

});

// Read users
app.get("/users", (req, res) => {
  const sql = "select * from users";
  const params = [];
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

// Read user
app.get("/users/:id", (req, res) => {
  var sql = "select * from users where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

// Read articles
app.get("/articles", (req, res) => {
  const sql = "select * from articles";
  const params = [];
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

// Read article
app.get("/articles/:id", (req, res) => {
  var sql = "select * from articles where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

// Create user
app.post("/users/", (req, res) => {
  var errors=[];
  if (!req.body.password){
      errors.push("No password specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : req.body.password
  }
  var sql ='INSERT INTO users (name, email, password) VALUES (?,?,?)';
  var params =[data.name, data.email, data.password];
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
})

// Update user
app.put("/users/:id", (req, res) => {
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : req.body.password
  }
  db.run(
      `UPDATE users set 
         name = COALESCE(?,name), 
         email = COALESCE(?,email), 
         password = COALESCE(?,password) 
         WHERE id = ?`,
      [data.name, data.email, data.password, req.params.id],
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({
              message: "success",
              data: data,
              changes: this.changes
          })
  });
})

// Delete user
app.delete("/users/:id", (req, res) => {
  db.run(
      'DELETE FROM users WHERE id = ?',
      req.params.id,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
  });
})