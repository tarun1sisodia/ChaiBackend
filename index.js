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
    res.new('Create something... 201')
});

const githubData = {
    "login": "tarun1sisodia",
    "id": 128500527,
    "node_id": "U_kgDOB6jDLw",
    "avatar_url": "https://avatars.githubusercontent.com/u/128500527?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/tarun1sisodia",
    "html_url": "https://github.com/tarun1sisodia",
    "followers_url": "https://api.github.com/users/tarun1sisodia/followers",
    "following_url": "https://api.github.com/users/tarun1sisodia/following{/other_user}",
    "gists_url": "https://api.github.com/users/tarun1sisodia/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/tarun1sisodia/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/tarun1sisodia/subscriptions",
    "organizations_url": "https://api.github.com/users/tarun1sisodia/orgs",
    "repos_url": "https://api.github.com/users/tarun1sisodia/repos",
    "events_url": "https://api.github.com/users/tarun1sisodia/events{/privacy}",
    "received_events_url": "https://api.github.com/users/tarun1sisodia/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Tarun Sisodia",
    "company": "tarun1sisodia@gmail.com",
    "blog": "https://tarun-sisodia-nup9tne.gamma.site/",
    "location": "India",
    "email": null,
    "hireable": true,
    "bio": "MCA Cybersecurity. \r\nCurrently,on APP & Backend Dev.. \r\nAutomation using AI agents",
    "twitter_username": "tarun1sisodia",
    "public_repos": 28,
    "public_gists": 0,
    "followers": 14,
    "following": 25,
    "created_at": "2023-03-21T15:03:02Z",
    "updated_at": "2026-06-08T13:42:05Z"
};

app.get('/github/me', (req, res) => {
    res.json(githubData)
});

app.delete('/users/me', (req, res) => {
    res.send('Delete something...')
});

app.get('/login', (req, res) => { res.send("<h1>Please Login at Chai Aur Code</h1>"); })

app.get('/youtube', (req, res) => { res.send("<h2>Welcome to Youtube</h2>") });
