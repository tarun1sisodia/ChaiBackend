import configDotenv from "dotenv";
configDotenv.config();

import express from "express";
const app = express();
const port = 5000;

console.debug(`ENV PORT ${process.env.PORT}`);

//Define APIs
//Home 
app.get('/', (req, res) => {
    res.send("Hello Home\n200 OK");
});

//Upload file 
app.post('/upload-file', (req, res) => { });

//Serve runs.
app.listen(process.env.PORT || port, () => {
    console.log(`Server is now listening at port ${process.env.PORT}`);
});

app.post('/register/users', (req, res) => {
    res.send('Create something... 201')
});

app.put('/user', (req, res) => {
    res.send('Replace entire detailss.... ')
});

app.delete('/users/me', (req, res) => {
    res.send('Delete something...')
});

app.get('/login', (req, res) => { res.send("<h1>Please Login at Chai Aur Code</h1>"); })

app.get('/youtube', (req, res) => { res.send("<h2>Welcome to Youtube</h2>") });

