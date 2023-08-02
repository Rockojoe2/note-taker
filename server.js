const path = require("path");
const express = require("express");
const notes = require("./db/db.json")
// const { title, text, id } = require("./db/db.json");
const app = express();
const fs = require('fs');
// const uuid = require('./helpers/uuid');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/api/notes' , (req, res)=>{
    res.json(notes.slice());
});


app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

function updateNotesArray(newNote) {
    notes.push(newNote);
  
    fs.writeFile(
      './db/db.json',
      JSON.stringify(notes, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully updated Notes!')
    );
  }

app.post('/api/notes', (req, res) => {

    // const userNote = req.body;
    const { title, text, id } = req.body;

    const newNote = {
        title,
        text,
        id: uuidv4(),
    }
    updateNotesArray(newNote);
    res.json(notes);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) 
        {
          console.error(err);
        } 
        else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);

          parsedNotes.push(newNote);
         
        }
})
})

app.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = req.params.id;
  
    // Find the index of the note with the given id in the notes array
    const noteIndex = notes.findIndex((note) => note.id === noteIdToDelete);
  
    if (noteIndex === -1) {
      // If the note with the given id is not found, return 404 Not Found
      return res.status(404).json({ error: 'Note not found' });
    }
  
    // Remove the note from the notes array
    notes.splice(noteIndex, 1);
  
    // Update the db.json file with the updated notes array
    fs.writeFile(
      './db/db.json',
      JSON.stringify(notes, null, 4),
      (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).json({ error: 'Failed to delete note' });
        }
        console.info('Successfully deleted Note!');
        return res.json(notes);
      }
    );
  });



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);