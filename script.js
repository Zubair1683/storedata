const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/comments', (req, res) => {
    fs.readFile("./comments.json", (err, fileData) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }

        let comments = JSON.parse(fileData);
        res.json(comments);
    });
});



app.post('/submit-comment', (req, res) => {
    const name = req.body.name;
    const comments = req.body.comments;

    // Read the existing JSON file
    fs.readFile("./comments.json", (err, fileData) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }

        let data = JSON.parse(fileData);

        // Add a new comment object to the existing data
        const newComment = {
            name: name,
            comments: comments
        };
        data.push(newComment);

        // Write the updated data back to the JSON file
        fs.writeFile("./comments.json", JSON.stringify(data, null, 2), err => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send("Error writing file");
            }
            console.log("New comment added successfully!");
            return res.redirect('/');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});