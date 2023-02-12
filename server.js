// Import express package
const express = require('express');
const path = require('path');

// Initialize our app variable by setting it to the value of express()
const app = express();
const PORT = process.env.PORT ||3000;
const fs = require("fs");
const db = require("./db/db.json")
var uniqid = require('uniqid');




// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setup middleware to server static files from /public
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for Notes 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);




//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {

  fs.readFile(__dirname + './db/db.json', 'utf-8',(err,data) => {
    if(err){
      console.log(err);
     } else {
      res.json(JSON.parse(data));
    }
  })
});

//POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
        let allNotes = [];
        let newNote = {
            title: req.body.title,
            text: req.body.text,
            id: uniqid,
          }
        fs.readFile(__dirname + "./db/db.json", (err, data) => {
            if (err) throw err;
            allNotes = JSON.parse(data);
            allNotes.push(newNote);
            fs.writeFile(__dirname + "./db/db.json", JSON.stringify(allNotes), "utf-8", (err) => {
                if (err) throw err;
                console.log("The note has been saved.")
                res.end();
            })
        })
        console.log(newNote)
    });
  
 // DELETE note
 app.delete("/api/notes/:id", (req, res) => {
    let noteId = req.params.id;
    fs.readFile(__dirname + "./db/db.json", (err, data) => {
      if (err) throw err;
      let notesDB = JSON.parse(data);
      const filteredNotes = notesDB.filter(values => values.id != noteId);
      fs.writeFile(__dirname + "./db/db.json", JSON.stringify(filteredNotes), "utf-8", err => {
          if (err) throw err;
          console.log("The note has been deleted.")
          res.end();
      });
  });
});



//return the index.html file
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);


