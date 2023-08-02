const path = require("path");
const express = require("express");
const notes = require("./db/db.json")
const app = express();
const fs = require('fs');
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


app.post('/api/notes', (req, res) => {

    const userNote = req.body;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) 
        {
          console.error(err);
        } 
        else {
          // Convert string into JSON object
          const parsedReviews = JSON.parse(data);

          parsedReviews.push(userNote);

          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedReviews, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }

          

})
})




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);