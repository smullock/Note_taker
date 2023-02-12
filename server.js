// Import express package
const express = require('express');
const path = require('path');

// Initialize our app variable by setting it to the value of express()
const app = express();
const PORT = process.env.PORT ||5001;
const fs = require("fs");
const data = require("./db/db.json")
var uniqid = require('uniqid');


//setup middleware to server static files from /public
app.use(express.static('public'));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//return the notes.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, "/notes.html"))
);

//return the index.html file
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);


//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {

  fs.readFile('./db/db.json', 'utf-8',(err,data) => {
    if(err){
      console.log(err);
     } else {
      res.json(JSON.parse(data));
    }
  })
});



app.post('/api/notes', (req, res) => {
  console.log(`${req.method} request received to add a note`)

  const {title, text} = req.body;

  if (title && text) {
      const newNote = {
          title,
          text,
          id: uniqid()
      }

      fs.readFile('./db/db.json', 'utf-8', (err, data) => {
          if (err) {
              console.log(err);
          } else {
              const parsedNotes = JSON.parse(data);
              parsedNotes.push(newNote)
              fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => {
                  err ? console.log(err) : console.log('successfully added note')
              })
          }
      })

      const response = {
          status: 'success',
          body: newNote
      }

      console.log(response);
      res.json(response);
  } else {
      res.json('unable to post note')
  }
})
//POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).


//bonus
//DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file./*  */
