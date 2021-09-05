const express = require("express");
const path = require("path");
const { Client } = require("pg");
const app = express();
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));






var mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});





conn.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");
 
    var sql3 = "DROP TABLE IF EXISTS Tags ";
 
    conn.query(sql3, function(err, results) {
        if (err) throw err;
        console.log("Table Tags dropped");
    });


    // Drop Videos table if Exists!!
    var sql1 = "DROP TABLE IF EXISTS Videos ";
 
    conn.query(sql1, function(err, results) {
        if (err) throw err;
        console.log("Table Videos dropped");
    });
 
    // Create Videos Table.
    var sql2 = "CREATE TABLE Videos " +
        " (video_id INT not null AUTO_INCREMENT, " +
        " Name VARCHAR(100), " +
        " Description VARCHAR(1000), " +
        " URL VARCHAR(200), " +
        " CreatedAt DATE, " +
        " UpdatedAt DATE, " +
        " PRIMARY KEY (video_id) )";
 
    conn.query(sql2, function(err, results) {
        if (err) throw err;
        console.log("Table Videos created");
    });
 	
    
    var sql4 = "CREATE TABLE Tags " +
        " (tags_id INT not null AUTO_INCREMENT, " +
        "fk_video_id INT not null,"+
        " Value VARCHAR(500), " +
        " PRIMARY KEY (tags_id),"+       
        "FOREIGN KEY (fk_video_id) REFERENCES Videos(video_id) ON DELETE CASCADE )";
 
    conn.query(sql4, function(err, results) {
        if (err) throw err;
        console.log("Table Tags created");
    });

    var Names = ["V01", "V02", "V03"];
    var urls = ["v01.youtube.com", "v02.youtube.com", "v03.youtube.com"];
    var createdDates = ["22/10/2001", "11/11/2000", "12/12/1990"];
 	var updatedDates = ["22/10/2002", "11/11/2001", "12/12/1995"];
 	var descriptions =["je suis la video num 1","je suis la video num 2","je suis la video num 3"];
 	var tags =["alimentation","sport","cuisine","motivation","comedie"];
    // Insert Datas to EMPLOYEES.
    for (var i = 0; i < Names.length; i++) {
        var sql5 = "Insert into Videos (Name, Description, URL, CreatedAt,UpdatedAt) " //
            +
            " Values ('" + Names[i] + "', '" + descriptions[i]  + "', '" + urls[i] + "', STR_TO_DATE('" + createdDates[i] + "', '%d/%m/%Y') " + ", STR_TO_DATE('" + updatedDates[i] + "', '%d/%m/%Y') )";
 		
        conn.query(sql5, function(err, results) {
            if (err) throw err;
            console.log("Insert a video successfuly!");
        });
        
    }
 
});


app.get("/", (req, res) => {
  // res.send("Bonjour le monde...");
  res.render("index");
});



app.get("/videos", (req, res) => {
  const sql6 = "SELECT * FROM Videos ";
   const vi = {
    Value: " "
  }
  conn.query(sql6, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("videos", { model: result, model1: vi });
  });
});


app.post("/videos", (req, res) => {
  const sql = "INSERT INTO Tags (fk_video_id,Value) VALUES (?,?) ";
  const video = [req.body.videoID, req.body.tags];
  
  conn.query(sql,video, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/videos");
    
  });
});


// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Videos WHERE video_id = ? ";
  conn.query(sql,[id], (err, result) => {
    // if (err) ...
    res.render("edit", { model: result[0] });
    
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const video = [req.body.name, req.body.url, req.body.description, id];
  const sql = "UPDATE Videos SET Name = ?, URL = ?, Description = ? WHERE video_id = ?";
  
  conn.query(sql, video, (err, result) => {
    
    res.redirect("/videos");
    

  });

});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Videos WHERE video_id = ?";
  conn.query(sql, [id], (err, result) => {
    // if (err) ...
    res.render("delete", { model: result[0] });
  });
});


// GET /create
app.get("/create", (req, res) => {
  const vi = {
    Name: "V"
  }
  res.render("create", { model: vi });
});

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Videos WHERE video_id = ?";
  conn.query(sql, [id], (err, result) => {
    // if (err) ...
    res.redirect("/videos");
  });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Videos (Name, URL, Description) VALUES (?,?, ?)";
  const video = [req.body.name, req.body.url, req.body.description];
  conn.query(sql, video, (err, result) => {
    // if (err) ...
    res.redirect("/videos");
  });
});


app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});





