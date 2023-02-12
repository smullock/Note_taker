// Dependencies
const fs = require("fs");
const uniqid = require("uniqid");
const db = require("../db/db.json")

// Routing
module.exports = function (app) {
    // API GET request
    app.get("/api/notes", function (req, res) {
        fs.readFile(__dirname + "/../db/db.json", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
        });
      
    });
  
  // API POST request
    app.post("/api/notes", function (req, res) {
        let allNotes = [];
        let newNote = {
            title: req.body.title,
            text: req.body.text,
            id: uniqid,
        }
        fs.readFile(__dirname + "/../db/db.json", (err, data) => {
            if (err) throw err;
            allNotes = JSON.parse(data);
            allNotes.push(newNote);
            fs.writeFile(__dirname + "/../db/db.json", JSON.stringify(allNotes), "utf-8", (err) => {
                if (err) throw err;
                console.log("The note has been saved.")
                res.end();
            })
        })
        console.log(newNote)
    });
  
  // API DELETE Request
    app.delete("/api/notes/:id", (req, res) => {
        let noteId = req.params.id;
        fs.readFile(__dirname + "/../db/db.json", (err, data) => {
            if (err) throw err;
            let notesDB = JSON.parse(data);
            const filteredNotes = notesDB.filter(values => values.id != noteId);
            fs.writeFile(__dirname + "/../db/db.json", JSON.stringify(filteredNotes), "utf-8", err => {
                if (err) throw err;
                console.log("The note has been deleted.")
                res.end();
            });
        });
    });
};