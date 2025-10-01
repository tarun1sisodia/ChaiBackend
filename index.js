require('dotenv').config()

const express = require("express");
//we are making an object for express framework to use.
const app = express();

const PORT = 4000;

app.get('/', (req, res) => {
    res.send("Root");
});

app.get('/login', (req, res) => {
    res.send('<h1>Please Go to Hitesh Sir backend playlist</h2>');
});

app.listen(process.env.PORT, () => {
    // print();
    // setInterval(() => { print(); }, 2000);
    console.log(`Server Listening on ${PORT}`);
});

app.get('/x', (req, res) => {
    res.send('Congrats You Are Admin at X');
});

app.get('/youtube', (req, res) => {
    res.send('<h2>CHai AUr COde</h2>');
});
/* function print() {
    console.log("Nothing Found:");
} */